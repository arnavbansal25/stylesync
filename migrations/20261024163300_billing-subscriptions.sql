-- Billing: free tier 25 credits, subscription state, Stripe webhook fulfillment, checkout RLS.

ALTER TABLE public.users
  ALTER COLUMN credits SET DEFAULT 25;

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS billing_plan TEXT NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS subscription_status TEXT,
  ADD COLUMN IF NOT EXISTS subscription_period_end TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS subscription_cancel_at TIMESTAMPTZ;

ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_billing_plan_check;

ALTER TABLE public.users
  ADD CONSTRAINT users_billing_plan_check
  CHECK (billing_plan IN ('free', 'basic', 'pro'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url, credits, billing_plan)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    NEW.profile->>'name',
    NEW.profile->>'avatar_url',
    25,
    'free'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.subscription_credit_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_invoice_id TEXT NOT NULL UNIQUE,
  plan TEXT NOT NULL CHECK (plan IN ('basic', 'pro')),
  credits_granted INTEGER NOT NULL CHECK (credits_granted > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS subscription_credit_grants_user_idx
  ON public.subscription_credit_grants (user_id, created_at DESC);

ALTER TABLE public.subscription_credit_grants ENABLE ROW LEVEL SECURITY;

CREATE POLICY subscription_credit_grants_owner_select
  ON public.subscription_credit_grants
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE OR REPLACE FUNCTION public.credits_for_billing_plan(p_plan TEXT)
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE p_plan
    WHEN 'basic' THEN 350
    WHEN 'pro' THEN 1000
    ELSE NULL
  END;
$$;

CREATE OR REPLACE FUNCTION public.fulfill_stripe_billing_webhook()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_obj JSONB;
  v_subject_type TEXT;
  v_subject_id TEXT;
  v_user_id UUID;
  v_plan TEXT;
  v_invoice_id TEXT;
  v_credits INTEGER;
  v_grant_id UUID;
  v_status TEXT;
  v_period_end BIGINT;
  v_cancel_at BIGINT;
BEGIN
  IF NEW.provider <> 'stripe' OR NEW.processing_status <> 'processed' THEN
    RETURN NEW;
  END IF;

  IF NEW.event_type = 'invoice.paid' THEN
    v_obj := NEW.payload -> 'data' -> 'object';
    v_invoice_id := v_obj ->> 'id';

    IF v_invoice_id IS NULL THEN
      RETURN NEW;
    END IF;

    v_subject_type := COALESCE(
      v_obj -> 'parent' -> 'subscription_details' -> 'metadata' ->> 'insforge_subject_type',
      v_obj -> 'metadata' ->> 'insforge_subject_type'
    );
    v_subject_id := COALESCE(
      v_obj -> 'parent' -> 'subscription_details' -> 'metadata' ->> 'insforge_subject_id',
      v_obj -> 'metadata' ->> 'insforge_subject_id'
    );

    IF v_subject_id IS NULL THEN
      SELECT m.subject_type, m.subject_id
      INTO v_subject_type, v_subject_id
      FROM payments.customer_mappings m
      WHERE m.provider = NEW.provider
        AND m.environment = NEW.environment
        AND m.provider_customer_id = v_obj ->> 'customer';
    END IF;

    IF v_subject_type IS DISTINCT FROM 'user' OR v_subject_id IS NULL THEN
      RETURN NEW;
    END IF;

    v_user_id := v_subject_id::uuid;
    v_plan := COALESCE(
      v_obj -> 'parent' -> 'subscription_details' -> 'metadata' ->> 'plan',
      v_obj -> 'metadata' ->> 'plan'
    );

    IF v_plan IS NULL OR v_plan NOT IN ('basic', 'pro') THEN
      RETURN NEW;
    END IF;

    v_credits := public.credits_for_billing_plan(v_plan);
    IF v_credits IS NULL THEN
      RETURN NEW;
    END IF;

    INSERT INTO public.subscription_credit_grants (
      user_id,
      stripe_invoice_id,
      plan,
      credits_granted
    )
    VALUES (v_user_id, v_invoice_id, v_plan, v_credits)
    ON CONFLICT (stripe_invoice_id) DO NOTHING
    RETURNING id INTO v_grant_id;

    IF v_grant_id IS NOT NULL THEN
      UPDATE public.users
      SET credits = credits + v_credits,
          billing_plan = v_plan,
          updated_at = now()
      WHERE id = v_user_id;
    END IF;

    RETURN NEW;
  END IF;

  IF NEW.event_type IN (
    'customer.subscription.created',
    'customer.subscription.updated'
  ) THEN
    v_obj := NEW.payload -> 'data' -> 'object';
    v_subject_id := v_obj -> 'metadata' ->> 'insforge_subject_id';
    v_status := v_obj ->> 'status';

    IF v_subject_id IS NULL THEN
      RETURN NEW;
    END IF;

    v_user_id := v_subject_id::uuid;
    v_plan := v_obj -> 'metadata' ->> 'plan';
    v_period_end := NULLIF(v_obj ->> 'current_period_end', '')::bigint;
    v_cancel_at := NULLIF(v_obj ->> 'cancel_at', '')::bigint;

    UPDATE public.users
    SET subscription_status = v_status,
        subscription_period_end = CASE
          WHEN v_period_end IS NOT NULL THEN to_timestamp(v_period_end)
          ELSE subscription_period_end
        END,
        subscription_cancel_at = CASE
          WHEN v_cancel_at IS NOT NULL THEN to_timestamp(v_cancel_at)
          ELSE NULL
        END,
        billing_plan = CASE
          WHEN v_status IN ('active', 'trialing')
            AND v_plan IN ('basic', 'pro') THEN v_plan
          WHEN v_status IN ('canceled', 'unpaid', 'incomplete_expired') THEN 'free'
          ELSE billing_plan
        END,
        updated_at = now()
    WHERE id = v_user_id;

    RETURN NEW;
  END IF;

  IF NEW.event_type = 'customer.subscription.deleted' THEN
    v_obj := NEW.payload -> 'data' -> 'object';
    v_subject_id := v_obj -> 'metadata' ->> 'insforge_subject_id';

    IF v_subject_id IS NULL THEN
      RETURN NEW;
    END IF;

    UPDATE public.users
    SET billing_plan = 'free',
        subscription_status = 'canceled',
        subscription_period_end = NULL,
        subscription_cancel_at = NULL,
        updated_at = now()
    WHERE id = v_subject_id::uuid;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS fulfill_stripe_billing_webhook ON payments.webhook_events;

CREATE TRIGGER fulfill_stripe_billing_webhook
  AFTER INSERT OR UPDATE ON payments.webhook_events
  FOR EACH ROW
  EXECUTE FUNCTION public.fulfill_stripe_billing_webhook();

-- Stripe Checkout + Billing Portal (user-owned billing subject).
ALTER TABLE payments.stripe_checkout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments.stripe_customer_portal_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_create_stripe_checkout ON payments.stripe_checkout_sessions;
DROP POLICY IF EXISTS users_read_stripe_checkout ON payments.stripe_checkout_sessions;
DROP POLICY IF EXISTS users_create_stripe_portal ON payments.stripe_customer_portal_sessions;
DROP POLICY IF EXISTS users_read_stripe_portal ON payments.stripe_customer_portal_sessions;

CREATE POLICY users_create_stripe_checkout
  ON payments.stripe_checkout_sessions
  FOR INSERT TO authenticated
  WITH CHECK (
    subject_type = 'user'
    AND subject_id = auth.uid()::text
  );

CREATE POLICY users_read_stripe_checkout
  ON payments.stripe_checkout_sessions
  FOR SELECT TO authenticated
  USING (
    subject_type = 'user'
    AND subject_id = auth.uid()::text
  );

CREATE POLICY users_create_stripe_portal
  ON payments.stripe_customer_portal_sessions
  FOR INSERT TO authenticated
  WITH CHECK (
    subject_type = 'user'
    AND subject_id = auth.uid()::text
  );

CREATE POLICY users_read_stripe_portal
  ON payments.stripe_customer_portal_sessions
  FOR SELECT TO authenticated
  USING (
    subject_type = 'user'
    AND subject_id = auth.uid()::text
  );
