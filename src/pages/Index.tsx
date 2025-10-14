import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import SchoolsSection from "@/components/SchoolsSection";
import GallerySlider from "@/components/GallerySlider";
import NewsSection from "@/components/NewsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Users, Trophy, Microscope, Globe, Laptop, GraduationCap, Award, Target, Heart } from "lucide-react";
import facilitiesImg from "@/assets/modern-facilities.jpg";
import aboutImg from "@/assets/school-exterior.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      
      {/* Welcome Section with Stats */}
      <section className="py-20 bg-gradient-cream relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMC0xOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnpNMCAwaDYwdjYwSDB6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii4wMiIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block mb-4">
              <span className="px-6 py-2 rounded-full bg-secondary/20 text-primary text-sm font-bold tracking-wide">
                WELCOME TO SALEM
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gradient">
              Building Tomorrow's Leaders
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              For over 25 years, we've been nurturing excellence, character, and achievement in the heart of Ota, Ogun State
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 animate-slide-up">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-secondary/20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-gold flex items-center justify-center shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">25+</div>
              <div className="text-sm text-muted-foreground font-medium">Years of Excellence</div>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-secondary/20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-accent flex items-center justify-center shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-sm text-muted-foreground font-medium">Students Enrolled</div>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-secondary/20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-gold flex items-center justify-center shadow-lg">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground font-medium">Qualified Teachers</div>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-secondary/20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-accent flex items-center justify-center shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground font-medium">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 animate-fade-in">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={aboutImg} 
                  alt="Salem Group of Schools Campus" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent"></div>
              </div>
            </div>
            <div className="order-1 lg:order-2 animate-slide-up">
              <div className="inline-block mb-4">
                <span className="px-6 py-2 rounded-full bg-secondary/20 text-primary text-sm font-bold tracking-wide">
                  ABOUT US
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">Excellence in Education Since 1999</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Salem Group of Schools has been at the forefront of educational excellence in Ota, Ogun State. We are committed to nurturing young minds and developing well-rounded individuals who excel academically, socially, and spiritually.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our three schools provide continuous quality education from early childhood through secondary level, ensuring your child receives the best foundation for future success.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-4 p-4 bg-gradient-cream rounded-xl hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center flex-shrink-0 shadow">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary mb-1">Excellence</h4>
                    <p className="text-sm text-muted-foreground">Quality education standards</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gradient-cream rounded-xl hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0 shadow">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary mb-1">Expert Staff</h4>
                    <p className="text-sm text-muted-foreground">Experienced educators</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gradient-cream rounded-xl hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center flex-shrink-0 shadow">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary mb-1">Track Record</h4>
                    <p className="text-sm text-muted-foreground">Proven success history</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gradient-cream rounded-xl hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0 shadow">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary mb-1">Holistic Care</h4>
                    <p className="text-sm text-muted-foreground">Character development</p>
                  </div>
                </div>
              </div>
              <Button size="lg" className="gradient-accent text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all" asChild>
                <Link to="/about">Discover Our Story</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SchoolsSection />

      {/* Facilities Section */}
      <section className="py-20 bg-gradient-cream">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-up">
              <div className="inline-block mb-4">
                <span className="px-6 py-2 rounded-full bg-secondary/20 text-primary text-sm font-bold tracking-wide">
                  OUR FACILITIES
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary">World-Class Learning Environment</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Salem Group of Schools boasts modern facilities designed to enhance learning and overall student development in a safe, inspiring environment.
              </p>
              <div className="space-y-5">
                <div className="flex items-start gap-4 p-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-xl gradient-gold flex items-center justify-center flex-shrink-0 shadow">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-primary mb-1">Modern Library</h4>
                    <p className="text-muted-foreground">Extensive collection of books and digital resources for research</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0 shadow">
                    <Microscope className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-primary mb-1">Science Laboratories</h4>
                    <p className="text-muted-foreground">Fully equipped labs for Physics, Chemistry, and Biology</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-xl gradient-gold flex items-center justify-center flex-shrink-0 shadow">
                    <Laptop className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-primary mb-1">ICT Center</h4>
                    <p className="text-muted-foreground">Modern computer labs with high-speed internet access</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center flex-shrink-0 shadow">
                    <Trophy className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-primary mb-1">Sports Facilities</h4>
                    <p className="text-muted-foreground">Football fields, basketball courts, and athletic tracks</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="animate-fade-in">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={facilitiesImg} 
                  alt="School Facilities" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-bl from-secondary/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GallerySlider />
      
      <NewsSection />
      <TestimonialsSection />

      {/* Contact & Map Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-block mb-4">
                <span className="px-6 py-2 rounded-full bg-secondary/20 text-primary text-sm font-bold tracking-wide">
                  GET IN TOUCH
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">Visit Us Today</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We'd love to hear from you. Come visit our campus or send us a message
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex items-start gap-5 p-6 bg-gradient-cream rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 gradient-gold rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-primary mb-2">Address</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      No. 17 Bolanle Awosika Street, Off Ilogbo Road, Ojuore, Ota, Ogun State
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5 p-6 bg-gradient-cream rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 gradient-accent rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-primary mb-2">Email</h4>
                    <p className="text-muted-foreground">info@salemschools.edu.ng</p>
                  </div>
                </div>

                <div className="flex items-start gap-5 p-6 bg-gradient-cream rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 gradient-gold rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-primary mb-2">Phone</h4>
                    <p className="text-muted-foreground">+234 XXX XXX XXXX</p>
                  </div>
                </div>

                <div className="flex items-start gap-5 p-6 bg-gradient-cream rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="w-14 h-14 gradient-accent rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-primary mb-2">Working Hours</h4>
                    <p className="text-muted-foreground">Monday - Friday: 8:00 AM - 4:00 PM</p>
                  </div>
                </div>

                <Button size="lg" className="w-full md:w-auto gradient-accent text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all" asChild>
                  <Link to="/contact">Send Us a Message</Link>
                </Button>
              </div>

              <div className="h-[600px] rounded-3xl overflow-hidden shadow-2xl border-4 border-secondary/20">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.2868842!2d3.1897!3d6.6155!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMzYnNTUuOCJOIDPCsDExJzIyLjkiRQ!5e0!3m2!1sen!2sng!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
