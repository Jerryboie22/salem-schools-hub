-- Allow students to insert and update their own class assignments
CREATE POLICY "Students can manage their own class assignments"
ON public.student_classes
FOR INSERT
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own class assignments"
ON public.student_classes
FOR UPDATE
USING (auth.uid() = student_id);

CREATE POLICY "Students can delete their own class assignments"
ON public.student_classes
FOR DELETE
USING (auth.uid() = student_id);