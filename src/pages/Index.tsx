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
import facilitiesImg from "@/assets/facilities.jpg";
import aboutImg from "@/assets/school-exterior.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      
      {/* About Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img 
                src={aboutImg} 
                alt="Salem Group of Schools Campus" 
                className="rounded-lg shadow-xl w-full"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-bold mb-6">About Salem Group of Schools</h2>
              <p className="text-lg text-muted-foreground mb-4">
                For over 25 years, Salem Group of Schools has been at the forefront of educational excellence in Ota, Ogun State. We are committed to nurturing young minds and developing well-rounded individuals who excel academically, socially, and spiritually.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Our three schools provide continuous quality education from early childhood through secondary level, ensuring your child receives the best foundation for future success.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-accent" />
                  <span className="font-semibold">Excellence in Education</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-accent" />
                  <span className="font-semibold">Experienced Teachers</span>
                </div>
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-accent" />
                  <span className="font-semibold">Proven Track Record</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-8 h-8 text-accent" />
                  <span className="font-semibold">Global Standards</span>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link to="/about">Read More About Salem Group</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SchoolsSection />

      {/* Facilities Section */}
      <section className="py-20 bg-cool-gray">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our World-Class Facilities</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Salem Group of Schools boasts modern facilities designed to enhance learning and overall student development.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Modern Library</h4>
                    <p className="text-muted-foreground">Extensive collection of books and digital resources</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Microscope className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Science Laboratories</h4>
                    <p className="text-muted-foreground">Fully equipped labs for Physics, Chemistry, and Biology</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Laptop className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">ICT Center</h4>
                    <p className="text-muted-foreground">Modern computer labs with internet access</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Trophy className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Sports Facilities</h4>
                    <p className="text-muted-foreground">Football fields, basketball courts, and athletic tracks</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <img 
                src={facilitiesImg} 
                alt="School Facilities" 
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <GallerySlider />
      <NewsSection />
      <TestimonialsSection />

      {/* Contact & Map Section */}
      <section className="py-20 bg-gradient-to-r from-light-yellow to-cream-beige">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold mb-6">Get In Touch</h2>
              <div className="space-y-4 mb-8">
                <div>
                  <h4 className="font-semibold mb-2">Address</h4>
                  <p className="text-muted-foreground">
                    No. 17 Bolanle Awosika Street, Off Ilogbo Road, Ojuore, Ota, Ogun State
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Email</h4>
                  <p className="text-muted-foreground">info@salemschools.edu.ng</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Phone</h4>
                  <p className="text-muted-foreground">+234 XXX XXX XXXX</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Working Hours</h4>
                  <p className="text-muted-foreground">Monday - Friday: 8:00 AM - 4:00 PM</p>
                </div>
              </div>
              <Button asChild>
                <Link to="/contact">Send Us a Message</Link>
              </Button>
            </div>
            <div className="h-[400px] rounded-lg overflow-hidden shadow-xl">
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
      </section>

      <Footer />
    </div>
  );
};

export default Index;
