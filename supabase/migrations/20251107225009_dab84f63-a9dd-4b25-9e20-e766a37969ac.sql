-- Create student_results table
CREATE TABLE public.student_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  class_id UUID NOT NULL,
  term TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_results ENABLE ROW LEVEL SECURITY;

-- Students can view only their own results
CREATE POLICY "Students can view their own results"
ON public.student_results
FOR SELECT
USING (auth.uid() = student_id);

-- Admins and teachers can view all results
CREATE POLICY "Admins can view all results"
ON public.student_results
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));

-- Admins and teachers can upload results
CREATE POLICY "Admins can upload results"
ON public.student_results
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));

-- Admins can update results
CREATE POLICY "Admins can update results"
ON public.student_results
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));

-- Admins can delete results
CREATE POLICY "Admins can delete results"
ON public.student_results
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for results
INSERT INTO storage.buckets (id, name, public)
VALUES ('results', 'results', false);

-- Storage policies for results bucket
CREATE POLICY "Admins can upload results"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'results' AND
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role))
);

CREATE POLICY "Students can download their own results"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'results' AND
  (
    auth.uid()::text = (storage.foldername(name))[1] OR
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'teacher'::app_role)
  )
);

CREATE POLICY "Admins can delete results files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'results' AND
  (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role))
);

-- Add trigger for updated_at
CREATE TRIGGER update_student_results_updated_at
BEFORE UPDATE ON public.student_results
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();