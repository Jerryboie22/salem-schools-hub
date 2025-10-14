-- Create school type enum
CREATE TYPE public.school_type AS ENUM ('children', 'primary', 'covenant');

-- Create school photos table for galleries
CREATE TABLE public.school_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_type public.school_type NOT NULL,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.school_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for school_photos
CREATE POLICY "Anyone can view active school photos"
ON public.school_photos
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage school photos"
ON public.school_photos
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create school info table (principal's desk, facilities)
CREATE TABLE public.school_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_type public.school_type NOT NULL UNIQUE,
  principal_name TEXT,
  principal_position TEXT DEFAULT 'Principal',
  principal_image_url TEXT,
  principal_message TEXT,
  facilities TEXT[], -- Array of facilities
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.school_info ENABLE ROW LEVEL SECURITY;

-- RLS Policies for school_info
CREATE POLICY "Anyone can view school info"
ON public.school_info
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage school info"
ON public.school_info
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add school_type to assignments table
ALTER TABLE public.assignments ADD COLUMN school_type public.school_type;

-- Create trigger for updated_at on school_photos
CREATE TRIGGER update_school_photos_updated_at
BEFORE UPDATE ON public.school_photos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updated_at on school_info
CREATE TRIGGER update_school_info_updated_at
BEFORE UPDATE ON public.school_info
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default school info
INSERT INTO public.school_info (school_type, principal_name, principal_position, principal_message, facilities)
VALUES 
  ('children', 'Mrs. Sarah Johnson', 'Head Teacher', 'Welcome to Salem Children School. We provide a nurturing environment for your little ones.', ARRAY['Play Area', 'Learning Rooms', 'Art Studio', 'Music Room']),
  ('primary', 'Mr. David Okonkwo', 'Principal', 'At Salem Primary School, we build strong foundations for academic excellence.', ARRAY['Computer Lab', 'Science Lab', 'Library', 'Sports Field', 'Music Room']),
  ('covenant', 'Dr. Grace Adebayo', 'Principal', 'Salem Covenant College prepares students for university and life beyond with excellence and Christian values.', ARRAY['Science Labs', 'Computer Labs', 'Library', 'Sports Complex', 'Auditorium', 'Cafeteria']);