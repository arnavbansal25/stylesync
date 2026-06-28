-- Studio credit RPCs keyed only on auth.uid() (avoids PostgREST overload / cache issues).

CREATE OR REPLACE FUNCTION public.deduct_studio_credits(p_amount INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  new_balance INTEGER;
BEGIN
  IF p_amount IS NULL OR p_amount <= 0 THEN
    RAISE EXCEPTION 'deduct amount must be positive';
  END IF;

  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;

  UPDATE public.users
  SET credits = credits - p_amount,
      updated_at = now()
  WHERE id = v_user_id
    AND credits >= p_amount
  RETURNING credits INTO new_balance;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  RETURN new_balance;
END;
$$;

CREATE OR REPLACE FUNCTION public.refund_studio_credits(p_amount INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  new_balance INTEGER;
BEGIN
  IF p_amount IS NULL OR p_amount <= 0 THEN
    RAISE EXCEPTION 'refund amount must be positive';
  END IF;

  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;

  UPDATE public.users
  SET credits = credits + p_amount,
      updated_at = now()
  WHERE id = v_user_id
  RETURNING credits INTO new_balance;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  RETURN new_balance;
END;
$$;

REVOKE ALL ON FUNCTION public.deduct_studio_credits(INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.refund_studio_credits(INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.deduct_studio_credits(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.refund_studio_credits(INTEGER) TO authenticated;
