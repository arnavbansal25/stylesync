-- User credits (50 free on signup) and beauty generation history.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS credits INTEGER NOT NULL DEFAULT 50;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url, credits)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    NEW.profile->>'name',
    NEW.profile->>'avatar_url',
    50
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.beauty_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id TEXT NOT NULL,
  look_id TEXT,
  source_storage_key TEXT,
  result_url TEXT,
  result_storage_key TEXT,
  youcam_task_id TEXT,
  credits_spent INTEGER NOT NULL DEFAULT 5,
  status TEXT NOT NULL DEFAULT 'completed',
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS beauty_generations_user_created_idx
  ON public.beauty_generations (user_id, created_at DESC);

ALTER TABLE public.beauty_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY beauty_generations_owner_select ON public.beauty_generations
FOR SELECT TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY beauty_generations_owner_insert ON public.beauty_generations
FOR INSERT TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));

-- Atomically deduct credits when the user has enough balance.
CREATE OR REPLACE FUNCTION public.deduct_user_credits(
  p_user_id UUID,
  p_amount INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_balance INTEGER;
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'deduct amount must be positive';
  END IF;

  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RETURN NULL;
  END IF;

  UPDATE public.users
  SET credits = credits - p_amount,
      updated_at = now()
  WHERE id = p_user_id
    AND credits >= p_amount
  RETURNING credits INTO new_balance;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  RETURN new_balance;
END;
$$;

REVOKE ALL ON FUNCTION public.deduct_user_credits(UUID, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.deduct_user_credits(UUID, INTEGER) TO authenticated;
