-- Path-scoped RLS for beauty generation results: {user_id}/{object_key}

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

CREATE POLICY beauty_results_path_select ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket = 'beauty-results'
    AND (storage.foldername(key))[1] = (SELECT auth.jwt() ->> 'sub')
  );

CREATE POLICY beauty_results_path_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket = 'beauty-results'
    AND (storage.foldername(key))[1] = (SELECT auth.jwt() ->> 'sub')
  );

CREATE POLICY beauty_results_path_update ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket = 'beauty-results'
    AND (storage.foldername(key))[1] = (SELECT auth.jwt() ->> 'sub')
  )
  WITH CHECK (
    bucket = 'beauty-results'
    AND (storage.foldername(key))[1] = (SELECT auth.jwt() ->> 'sub')
  );

CREATE POLICY beauty_results_path_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket = 'beauty-results'
    AND (storage.foldername(key))[1] = (SELECT auth.jwt() ->> 'sub')
  );

GRANT SELECT, INSERT, UPDATE, DELETE ON storage.objects TO authenticated;
