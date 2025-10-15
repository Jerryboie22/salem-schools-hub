-- Create assignments storage bucket and policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('assignments', 'assignments', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access to assignments
DROP POLICY IF EXISTS "Public can read assignment files" ON storage.objects;
CREATE POLICY "Public can read assignment files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'assignments');

-- Teachers and admins can upload assignment files
DROP POLICY IF EXISTS "Teachers and admins can upload assignments" ON storage.objects;
CREATE POLICY "Teachers and admins can upload assignments"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'assignments'
  AND (
    public.has_role(auth.uid(), 'teacher'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Teachers and admins can update their assignment files
DROP POLICY IF EXISTS "Teachers and admins can update assignments" ON storage.objects;
CREATE POLICY "Teachers and admins can update assignments"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'assignments'
  AND (
    public.has_role(auth.uid(), 'teacher'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Teachers and admins can delete assignment files
DROP POLICY IF EXISTS "Teachers and admins can delete assignments" ON storage.objects;
CREATE POLICY "Teachers and admins can delete assignments"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'assignments'
  AND (
    public.has_role(auth.uid(), 'teacher'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role)
  )
);
