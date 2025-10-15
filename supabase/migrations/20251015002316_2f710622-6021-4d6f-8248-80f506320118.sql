-- Ensure storage policies for assignments bucket are correctly configured

-- First, clean up any existing policies for assignments bucket
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Anyone can view assignment files" ON storage.objects;
  DROP POLICY IF EXISTS "Teachers and admins can upload assignment files" ON storage.objects;
  DROP POLICY IF EXISTS "Teachers and admins can update assignment files" ON storage.objects;
  DROP POLICY IF EXISTS "Teachers and admins can delete assignment files" ON storage.objects;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Create storage policies for assignments bucket
CREATE POLICY "Anyone can view assignment files"
ON storage.objects FOR SELECT
USING (bucket_id = 'assignments');

CREATE POLICY "Teachers and admins can upload assignment files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'assignments' 
  AND (
    public.has_role(auth.uid(), 'teacher'::public.app_role) 
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
  )
);

CREATE POLICY "Teachers and admins can update assignment files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'assignments' 
  AND (
    public.has_role(auth.uid(), 'teacher'::public.app_role) 
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
  )
);

CREATE POLICY "Teachers and admins can delete assignment files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'assignments' 
  AND (
    public.has_role(auth.uid(), 'teacher'::public.app_role) 
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
  )
);