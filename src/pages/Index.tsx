import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import SchoolsSection from "@/components/SchoolsSection";
import GallerySlider from "@/components/GallerySlider";
import NewsSection from "@/components/NewsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Users, Trophy, Microscope, Globe, Laptop } from "lucide-react";
import facilitiesImg from "@/assets/modern-facilities.jpg";
import aboutImg from "@/assets/school-exterior.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      
      {/* About Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <img 
                src={aboutImg} 
                alt="Salem Group of Schools Campus" 
                className="rounded-lg shadow-xl w-full h-[400px] object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">About Salem Group of Schools</h2>
              <p className="text-base text-muted-foreground mb-3">
                For over 25 years, Salem Group of Schools has been at the forefront of educational excellence in Ota, Ogun State. We are committed to nurturing young minds and developing well-rounded individuals.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-accent flex-shrink-0" />
                  <span className="text-sm font-semibold">Excellence in Education</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-accent flex-shrink-0" />
                  <span className="text-sm font-semibold">Experienced Teachers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-accent flex-shrink-0" />
                  <span className="text-sm font-semibold">Proven Track Record</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-6 h-6 text-accent flex-shrink-0" />
                  <span className="text-sm font-semibold">Global Standards</span>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link to="/about">Learn More About Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SchoolsSection />

      <GallerySlider />

      {/* Facilities Section */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our World-Class Facilities</h2>
              <p className="text-base text-muted-foreground mb-4">
                Modern facilities designed to enhance learning and student development.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <BookOpen className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-sm mb-0.5">Modern Library</h4>
                    <p className="text-sm text-muted-foreground">Extensive collection of books and digital resources</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Microscope className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-sm mb-0.5">Science Laboratories</h4>
                    <p className="text-sm text-muted-foreground">Fully equipped labs for Physics, Chemistry, and Biology</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Laptop className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-sm mb-0.5">ICT Center</h4>
                    <p className="text-sm text-muted-foreground">Modern computer labs with internet access</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Trophy className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-sm mb-0.5">Sports Facilities</h4>
                    <p className="text-sm text-muted-foreground">Football fields, basketball courts, and athletic tracks</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img 
                src={facilitiesImg} 
                alt="School Facilities" 
                className="rounded-lg shadow-xl w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <NewsSection />
      <TestimonialsSection />

      {/* Contact & Map Section */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Get In Touch</h2>
              <p className="text-base text-muted-foreground">
                We'd love to hear from you. Visit us or send us a message
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-[hsl(var(--gold))]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-[hsl(var(--gold-dark))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Address</h4>
                      <p className="text-primary/70">
                        No. 17 Bolanle Awosika Street, Off Ilogbo Road, Ojuore, Ota, Ogun State
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Email</h4>
                      <p className="text-primary/70">info@salemschools.edu.ng</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-[hsl(var(--gold))]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-[hsl(var(--gold-dark))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Phone</h4>
                      <p className="text-primary/70">+234 XXX XXX XXXX</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">Working Hours</h4>
                      <p className="text-primary/70">Monday - Friday: 8:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </div>

                <Button size="lg" className="w-full md:w-auto bg-primary hover:bg-primary/90" asChild>
                  <Link to="/contact">Send Us a Message</Link>
                </Button>
              </div>

              <div className="h-[500px] rounded-xl overflow-hidden shadow-2xl ring-1 ring-[hsl(var(--gold-dark))]/20">
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
