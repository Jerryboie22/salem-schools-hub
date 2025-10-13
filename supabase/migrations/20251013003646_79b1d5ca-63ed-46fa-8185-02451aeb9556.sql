-- Create profiles table for user information
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  address text,
  avatar_url text,
  date_of_birth date,
  gender text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create subjects table
CREATE TABLE public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text,
  description text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view subjects"
  ON public.subjects FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage subjects"
  ON public.subjects FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create student_subjects table
CREATE TABLE public.student_subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  enrolled_at timestamp with time zone DEFAULT now(),
  UNIQUE(student_id, subject_id)
);

ALTER TABLE public.student_subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own subjects"
  ON public.student_subjects FOR SELECT
  USING (auth.uid() = student_id OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));

CREATE POLICY "Students can manage their own subjects"
  ON public.student_subjects FOR ALL
  USING (auth.uid() = student_id OR has_role(auth.uid(), 'admin'::app_role));

-- Create school_fees table
CREATE TABLE public.school_fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  academic_year text NOT NULL,
  term text NOT NULL,
  amount numeric NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(class_id, academic_year, term)
);

ALTER TABLE public.school_fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view school fees"
  ON public.school_fees FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage school fees"
  ON public.school_fees FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create fee_payments table
CREATE TABLE public.fee_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_fee_id uuid NOT NULL REFERENCES public.school_fees(id) ON DELETE CASCADE,
  amount_paid numeric NOT NULL,
  payment_date timestamp with time zone DEFAULT now(),
  payment_method text,
  reference_number text,
  status text DEFAULT 'completed',
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students and parents can view their fee payments"
  ON public.fee_payments FOR SELECT
  USING (
    auth.uid() = student_id 
    OR has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.parent_students 
      WHERE parent_id = auth.uid() AND student_id = fee_payments.student_id
    )
  );

CREATE POLICY "Students and parents can create fee payments"
  ON public.fee_payments FOR INSERT
  WITH CHECK (
    auth.uid() = student_id 
    OR has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.parent_students 
      WHERE parent_id = auth.uid() AND student_id = fee_payments.student_id
    )
  );

-- Add subject column to assignments
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS subject text;

-- Add subject column to grades if not exists
ALTER TABLE public.grades ADD COLUMN IF NOT EXISTS subject_id uuid REFERENCES public.subjects(id);

-- Create trigger for updating profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updating school_fees updated_at
CREATE TRIGGER update_school_fees_updated_at
  BEFORE UPDATE ON public.school_fees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();