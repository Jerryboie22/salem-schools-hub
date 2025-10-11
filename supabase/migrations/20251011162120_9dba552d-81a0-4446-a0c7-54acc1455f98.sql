-- Create classes/sections table
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- e.g., "JSS 2A", "JSS 3B"
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create student-class assignments
CREATE TABLE public.student_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(student_id, class_id)
);

-- Create parent-student relationships
CREATE TABLE public.parent_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL,
  student_id UUID NOT NULL,
  relationship TEXT, -- e.g., "Mother", "Father", "Guardian"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(parent_id, student_id)
);

-- Create assignments table
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create assignment submissions
CREATE TABLE public.assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
  student_id UUID NOT NULL,
  file_url TEXT,
  notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  grade NUMERIC(5,2),
  feedback TEXT,
  UNIQUE(assignment_id, student_id)
);

-- Create class notes/materials
CREATE TABLE public.class_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create grades/results
CREATE TABLE public.grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  score NUMERIC(5,2) NOT NULL,
  max_score NUMERIC(5,2) NOT NULL,
  term TEXT, -- e.g., "First Term", "Second Term"
  academic_year TEXT,
  teacher_id UUID NOT NULL,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create lesson plans
CREATE TABLE public.lesson_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  objectives TEXT,
  content TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create class schedules
CREATE TABLE public.class_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  teacher_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for classes
CREATE POLICY "Anyone can view classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Admins can manage classes" ON public.classes FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for student_classes
CREATE POLICY "Students can view their own class assignments" ON public.student_classes FOR SELECT USING (auth.uid() = student_id OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'teacher'));
CREATE POLICY "Admins can manage student class assignments" ON public.student_classes FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for parent_students
CREATE POLICY "Parents can view their student relationships" ON public.parent_students FOR SELECT USING (auth.uid() = parent_id OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Parents can create their student relationships" ON public.parent_students FOR INSERT WITH CHECK (auth.uid() = parent_id);
CREATE POLICY "Admins can manage parent-student relationships" ON public.parent_students FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for assignments
CREATE POLICY "Students can view assignments for their classes" ON public.assignments FOR SELECT USING (
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'teacher') OR
  EXISTS (SELECT 1 FROM public.student_classes WHERE student_id = auth.uid() AND class_id = assignments.class_id)
);
CREATE POLICY "Teachers can create assignments" ON public.assignments FOR INSERT WITH CHECK (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Teachers can update their own assignments" ON public.assignments FOR UPDATE USING (auth.uid() = teacher_id OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins and teachers can delete assignments" ON public.assignments FOR DELETE USING (auth.uid() = teacher_id OR has_role(auth.uid(), 'admin'));

-- RLS Policies for assignment_submissions
CREATE POLICY "Students can view their own submissions" ON public.assignment_submissions FOR SELECT USING (
  auth.uid() = student_id OR
  has_role(auth.uid(), 'admin') OR
  (has_role(auth.uid(), 'teacher') AND EXISTS (SELECT 1 FROM public.assignments WHERE assignments.id = assignment_submissions.assignment_id AND assignments.teacher_id = auth.uid()))
);
CREATE POLICY "Students can submit assignments" ON public.assignment_submissions FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update their own submissions" ON public.assignment_submissions FOR UPDATE USING (auth.uid() = student_id);
CREATE POLICY "Teachers can grade submissions" ON public.assignment_submissions FOR UPDATE USING (
  has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin')
);

-- RLS Policies for class_notes
CREATE POLICY "Students can view notes for their classes" ON public.class_notes FOR SELECT USING (
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'teacher') OR
  EXISTS (SELECT 1 FROM public.student_classes WHERE student_id = auth.uid() AND class_id = class_notes.class_id)
);
CREATE POLICY "Teachers can create class notes" ON public.class_notes FOR INSERT WITH CHECK (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Teachers can update their own notes" ON public.class_notes FOR UPDATE USING (auth.uid() = teacher_id OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins and teachers can delete notes" ON public.class_notes FOR DELETE USING (auth.uid() = teacher_id OR has_role(auth.uid(), 'admin'));

-- RLS Policies for grades
CREATE POLICY "Students can view their own grades" ON public.grades FOR SELECT USING (
  auth.uid() = student_id OR
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'teacher')
);
CREATE POLICY "Teachers can create grades" ON public.grades FOR INSERT WITH CHECK (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Teachers can update grades" ON public.grades FOR UPDATE USING (auth.uid() = teacher_id OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete grades" ON public.grades FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for lesson_plans
CREATE POLICY "Teachers and admins can view lesson plans" ON public.lesson_plans FOR SELECT USING (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Teachers can create lesson plans" ON public.lesson_plans FOR INSERT WITH CHECK (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Teachers can update their own lesson plans" ON public.lesson_plans FOR UPDATE USING (auth.uid() = teacher_id OR has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins and teachers can delete lesson plans" ON public.lesson_plans FOR DELETE USING (auth.uid() = teacher_id OR has_role(auth.uid(), 'admin'));

-- RLS Policies for class_schedules
CREATE POLICY "Students can view schedules for their classes" ON public.class_schedules FOR SELECT USING (
  has_role(auth.uid(), 'admin') OR
  has_role(auth.uid(), 'teacher') OR
  EXISTS (SELECT 1 FROM public.student_classes WHERE student_id = auth.uid() AND class_id = class_schedules.class_id)
);
CREATE POLICY "Teachers and admins can manage schedules" ON public.class_schedules FOR ALL USING (has_role(auth.uid(), 'teacher') OR has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON public.assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_class_notes_updated_at BEFORE UPDATE ON public.class_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON public.grades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lesson_plans_updated_at BEFORE UPDATE ON public.lesson_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_class_schedules_updated_at BEFORE UPDATE ON public.class_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();