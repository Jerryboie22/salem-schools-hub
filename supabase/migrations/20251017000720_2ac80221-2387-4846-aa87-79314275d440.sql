-- Create homepage_content table for managing dynamic homepage content
CREATE TABLE public.homepage_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL, -- e.g., 'hero', 'about', 'mission', 'facilities'
  content_key TEXT NOT NULL, -- specific identifier within section
  title TEXT,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

-- Anyone can view active content
CREATE POLICY "Anyone can view active homepage content"
ON public.homepage_content
FOR SELECT
USING (is_active = true OR has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage homepage content
CREATE POLICY "Admins can manage homepage content"
ON public.homepage_content
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_homepage_content_updated_at
BEFORE UPDATE ON public.homepage_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default hero slides
INSERT INTO public.homepage_content (section, content_key, title, subtitle, image_url, order_index) VALUES
('hero', 'slide1', 'Welcome to Salem Schools', 'Nurturing Excellence in Education Since 1985', '/src/assets/hero-main.jpg', 1),
('hero', 'slide2', 'Modern Learning Facilities', 'State-of-the-art classrooms and technology', '/src/assets/school-building-new.jpg', 2),
('hero', 'slide3', 'Comprehensive Education', 'From Children School to Covenant College', '/src/assets/school-courtyard-hero.jpg', 3);