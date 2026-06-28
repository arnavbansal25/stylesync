-- Refund credits when a studio generation fails after an upfront deduct.

CREATE OR REPLACE FUNCTION public.refund_user_credits(
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
    RAISE EXCEPTION 'refund amount must be positive';
  END IF;

  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RETURN NULL;
  END IF;

  UPDATE public.users
  SET credits = credits + p_amount,
      updated_at = now()
  WHERE id = p_user_id
  RETURNING credits INTO new_balance;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  RETURN new_balance;
END;
$$;

REVOKE ALL ON FUNCTION public.refund_user_credits(UUID, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.refund_user_credits(UUID, INTEGER) TO authenticated;
