-- Create gallery images table
CREATE TABLE public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  author TEXT DEFAULT 'Salem Admin',
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  message TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact messages table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read access for active content
CREATE POLICY "Anyone can view active gallery images"
ON public.gallery_images FOR SELECT
USING (is_active = true);

CREATE POLICY "Anyone can view published blog posts"
ON public.blog_posts FOR SELECT
USING (is_published = true);

CREATE POLICY "Anyone can view active testimonials"
ON public.testimonials FOR SELECT
USING (is_active = true);

-- Allow anyone to insert contact messages
CREATE POLICY "Anyone can submit contact messages"
ON public.contact_messages FOR INSERT
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_gallery_images_updated_at
BEFORE UPDATE ON public.gallery_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.testimonials (name, role, message) VALUES
('Mrs. Adeyemi', 'Parent', 'Salem Group of Schools has been instrumental in shaping my children''s future. The teachers are dedicated and the facilities are excellent.'),
('John Okafor', 'Former Student', 'My time at Salem Covenant College prepared me well for university. The academic foundation I received here was invaluable.'),
('Rev. Ademola', 'Parent', 'The Christian values and discipline instilled in students at Salem is commendable. I''m proud to have my children here.');

INSERT INTO public.blog_posts (title, slug, excerpt, content, featured_image) VALUES
('Welcome to Salem Group of Schools 2025/2026 Session', 'welcome-2025-session', 'We are excited to announce the beginning of a new academic year filled with opportunities for growth and excellence.', 'Welcome to the 2025/2026 academic session at Salem Group of Schools! We are thrilled to embark on another year of academic excellence, character development, and spiritual growth. Our dedicated staff and modern facilities are ready to provide your children with the best educational experience.

This year brings new opportunities including enhanced STEM programs, upgraded computer labs, and expanded sports facilities. We remain committed to our mission of building a generation rooted in knowledge, discipline, and excellence.

Registration is now open for all three schools. Visit our admissions page to learn more about enrollment procedures.', NULL),
('New Science Laboratory Commissioned', 'new-science-lab', 'Salem Group of Schools unveils state-of-the-art science laboratory to enhance practical learning experience.', 'We are proud to announce the commissioning of our new, fully-equipped science laboratory at Salem Covenant College. This modern facility features the latest equipment and technology to provide students with hands-on experience in Physics, Chemistry, and Biology.

The laboratory includes digital microscopes, modern chemistry equipment, and interactive demonstration tools. This investment demonstrates our commitment to providing world-class education and preparing students for careers in STEM fields.

Students and teachers alike are excited about the possibilities this new facility brings to our science curriculum.', NULL),
('Inter-House Sports Competition 2025', 'inter-house-sports-2025', 'Annual inter-house sports competition showcases talent, teamwork, and sportsmanship among Salem students.', 'The annual Inter-House Sports Competition was a resounding success! Students from all three schools participated in various athletic events including track and field, football, volleyball, and more.

The competition fostered a spirit of healthy rivalry, teamwork, and sportsmanship. Red House emerged as the overall champions, but every participant demonstrated exceptional dedication and school spirit.

We congratulate all participants and coaches for making this year''s event memorable. Physical education remains a crucial part of our holistic approach to student development.', NULL);