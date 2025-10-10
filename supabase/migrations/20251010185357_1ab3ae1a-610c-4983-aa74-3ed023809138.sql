-- Create leadership team table
CREATE TABLE public.leadership_team (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leadership_team ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing active leadership team members
CREATE POLICY "Anyone can view active leadership team"
ON public.leadership_team
FOR SELECT
USING (is_active = true);

-- Create trigger for updated_at
CREATE TRIGGER update_leadership_team_updated_at
BEFORE UPDATE ON public.leadership_team
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample leadership data
INSERT INTO public.leadership_team (name, position, bio, order_index) VALUES
('Dr. Emmanuel Adeyemi', 'Proprietor & Founder', 'Visionary leader with over 25 years in educational excellence and Christian values.', 1),
('Mrs. Grace Adeyemi', 'Director of Academics', 'Expert in curriculum development and academic standards with 20+ years experience.', 2),
('Mr. John Okafor', 'Principal - Covenant College', 'Dedicated educator focused on student excellence and character development.', 3),
('Mrs. Sarah Williams', 'Head Teacher - Primary School', 'Passionate about early childhood education and holistic student development.', 4),
('Miss Rebecca Ademola', 'Head Teacher - Children School', 'Specialist in nursery education with a heart for young learners.', 5),
('Mr. David Eze', 'ICT Coordinator', 'Technology integration expert committed to digital literacy for all students.', 6);