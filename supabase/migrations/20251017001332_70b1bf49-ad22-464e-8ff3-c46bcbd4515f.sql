-- Add more homepage sections for comprehensive editing
INSERT INTO public.homepage_content (section, content_key, title, subtitle, description, image_url, order_index) VALUES
-- About Section
('about', 'main', 'Welcome to Salem', NULL, 'For over 25 years, Salem Group of Schools has been committed to providing quality education that combines academic excellence with Christian values.', '/src/assets/school-exterior.jpg', 1),
('about', 'feature1', 'Quality Curriculum', 'International standards', NULL, NULL, 1),
('about', 'feature2', 'Expert Teachers', 'Qualified professionals', NULL, NULL, 2),
('about', 'feature3', 'Excellence Awards', 'Recognized performance', NULL, NULL, 3),
('about', 'feature4', 'Modern Facilities', 'State-of-the-art resources', NULL, NULL, 4),

-- Mission Section
('mission', 'main', 'Our Mission', NULL, 'To raise leaders of tomorrow from adolescents through academics, character, and spiritual training that orientates them to pursue values for self and beyond self.', NULL, 1),

-- Core Values
('values', 'value1', 'Fear of God', NULL, NULL, NULL, 1),
('values', 'value2', 'Integrity', NULL, NULL, NULL, 2),
('values', 'value3', 'Diligence', NULL, NULL, NULL, 3),
('values', 'value4', 'Help', NULL, NULL, NULL, 4),

-- Facilities Section
('facilities', 'main', 'Our Facilities', 'Modern infrastructure designed for optimal learning', NULL, '/src/assets/modern-facilities.jpg', 1),
('facilities', 'facility1', 'Library', 'Extensive collection of books and digital resources', NULL, NULL, 1),
('facilities', 'facility2', 'Science Labs', 'Fully equipped for Physics, Chemistry, and Biology', NULL, NULL, 2),
('facilities', 'facility3', 'ICT Center', 'Modern computer labs with high-speed internet', NULL, NULL, 3),
('facilities', 'facility4', 'Sports Complex', 'Multiple fields and indoor sports facilities', NULL, NULL, 4),

-- Contact Section
('contact', 'main', 'Get In Touch', 'Visit us or reach out for any inquiries', NULL, NULL, 1),
('contact', 'address', 'Address', 'Salem School Complex, Awka, Anambra State', NULL, NULL, 1),
('contact', 'email', 'Email', 'info@salemschools.edu.ng', NULL, NULL, 2),
('contact', 'phone', 'Phone', '+234 803 XXX XXXX', NULL, NULL, 3);