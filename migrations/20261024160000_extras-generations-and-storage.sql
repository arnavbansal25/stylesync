CREATE TABLE IF NOT EXISTS public.extras_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id TEXT NOT NULL,
  preset_id TEXT,
  result_url TEXT,
  result_storage_key TEXT,
  youcam_task_id TEXT,
  credits_spent INTEGER NOT NULL DEFAULT 5,
  status TEXT NOT NULL DEFAULT 'completed',
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS extras_generations_user_created_idx
  ON public.extras_generations (user_id, created_at DESC);

ALTER TABLE public.extras_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY extras_generations_owner_select ON public.extras_generations
FOR SELECT TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY extras_generations_owner_insert ON public.extras_generations
FOR INSERT TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY extras_results_path_select ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket = 'extras-results'
    AND (storage.foldername(key))[1] = (SELECT auth.jwt() ->> 'sub')
  );

CREATE POLICY extras_results_path_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket = 'extras-results'
    AND (storage.foldername(key))[1] = (SELECT auth.jwt() ->> 'sub')
  );

CREATE POLICY extras_results_path_update ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket = 'extras-results'
    AND (storage.foldername(key))[1] = (SELECT auth.jwt() ->> 'sub')
  )
  WITH CHECK (
    bucket = 'extras-results'
    AND (storage.foldername(key))[1] = (SELECT auth.jwt() ->> 'sub')
  );

CREATE POLICY extras_results_path_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket = 'extras-results'
    AND (storage.foldername(key))[1] = (SELECT auth.jwt() ->> 'sub')
  );
