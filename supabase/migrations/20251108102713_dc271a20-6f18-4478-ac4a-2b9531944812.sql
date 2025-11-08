-- Add feedback column to student_results table
ALTER TABLE public.student_results 
ADD COLUMN feedback TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN public.student_results.feedback IS 'Teacher comments or feedback on the student result';