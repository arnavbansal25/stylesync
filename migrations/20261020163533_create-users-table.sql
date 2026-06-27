-- App-owned user profile rows synced from auth.users on first sign-up (email or OAuth).

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX users_email_idx ON public.users (email);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_owner_select ON public.users
FOR SELECT TO authenticated
USING (id = (SELECT auth.uid()));

CREATE POLICY users_owner_update ON public.users
FOR UPDATE TO authenticated
USING (id = (SELECT auth.uid()))
WITH CHECK (id = (SELECT auth.uid()));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    NEW.profile->>'name',
    NEW.profile->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
