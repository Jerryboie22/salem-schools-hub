import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import SchoolsSection from "@/components/SchoolsSection";
import GallerySlider from "@/components/GallerySlider";
import NewsSection from "@/components/NewsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Users, Trophy, Microscope, Globe, Laptop, GraduationCap, Award, Library, FlaskConical, Monitor, MapPin, Mail, Phone, Clock } from "lucide-react";
import facilitiesImg from "@/assets/modern-facilities.jpg";
import aboutImg from "@/assets/school-exterior.jpg";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      
      <SchoolsSection />
      
      {/* About Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src={aboutImg} 
                alt="Salem School Building" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-4 md:space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">About Salem Group of Schools</h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                For over 25 years, Salem Group of Schools has been a beacon of excellence in education. 
                We combine academic rigor with Christian values to develop well-rounded individuals 
                prepared for the challenges of tomorrow.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-4">
                <div className="flex items-start gap-3">
                  <GraduationCap className="text-primary flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-base md:text-lg mb-1">Quality Education</h3>
                    <p className="text-sm text-muted-foreground">Comprehensive curriculum meeting international standards</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="text-primary flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-base md:text-lg mb-1">Excellence Awards</h3>
                    <p className="text-sm text-muted-foreground">Consistently recognized for outstanding performance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="text-primary flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-base md:text-lg mb-1">Expert Teachers</h3>
                    <p className="text-sm text-muted-foreground">Dedicated and qualified teaching staff</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BookOpen className="text-primary flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-semibold text-base md:text-lg mb-1">Modern Resources</h3>
                    <p className="text-sm text-muted-foreground">State-of-the-art facilities and learning materials</p>
                  </div>
                </div>
              </div>
              
              <Button size="lg" className="touch-target w-full sm:w-auto mt-4" asChild>
                <Link to="/about">Read More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <GallerySlider />
      
      <NewsSection />
      
      {/* Facilities Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-soft-green">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">Our World-Class Facilities</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Modern infrastructure designed to enhance learning and development
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6 md:space-y-8">
              <div className="flex items-start gap-3 md:gap-4">
                <Library className="text-primary flex-shrink-0 mt-1" size={28} />
                <div>
                  <h3 className="font-semibold text-lg md:text-xl mb-2">Extensive Library</h3>
                  <p className="text-sm md:text-base text-muted-foreground">Over 10,000 books and digital resources for comprehensive learning</p>
                </div>
              </div>
              <div className="flex items-start gap-3 md:gap-4">
                <FlaskConical className="text-primary flex-shrink-0 mt-1" size={28} />
                <div>
                  <h3 className="font-semibold text-lg md:text-xl mb-2">Science Labs</h3>
                  <p className="text-sm md:text-base text-muted-foreground">Fully equipped laboratories for Physics, Chemistry, and Biology</p>
                </div>
              </div>
              <div className="flex items-start gap-3 md:gap-4">
                <Monitor className="text-primary flex-shrink-0 mt-1" size={28} />
                <div>
                  <h3 className="font-semibold text-lg md:text-xl mb-2">ICT Center</h3>
                  <p className="text-sm md:text-base text-muted-foreground">Modern computer labs with high-speed internet connectivity</p>
                </div>
              </div>
              <div className="flex items-start gap-3 md:gap-4">
                <Trophy className="text-primary flex-shrink-0 mt-1" size={28} />
                <div>
                  <h3 className="font-semibold text-lg md:text-xl mb-2">Sports Complex</h3>
                  <p className="text-sm md:text-base text-muted-foreground">Multiple playing fields and indoor sports facilities</p>
                </div>
              </div>
            </div>
            <div>
              <img 
                src={facilitiesImg} 
                alt="School Facilities" 
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <TestimonialsSection />

      {/* Contact Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">Get In Touch</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              We're here to answer any questions you may have about our schools
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <MapPin className="text-primary mb-3 md:mb-4 mx-auto" size={32} />
                <h3 className="font-semibold text-base md:text-lg mb-2 text-center">Address</h3>
                <p className="text-xs md:text-sm text-muted-foreground text-center">
                  Salem School Complex, Awka, Anambra State, Nigeria
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <Mail className="text-primary mb-3 md:mb-4 mx-auto" size={32} />
                <h3 className="font-semibold text-base md:text-lg mb-2 text-center">Email</h3>
                <p className="text-xs md:text-sm text-muted-foreground text-center break-words">
                  info@salemschools.edu.ng
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <Phone className="text-primary mb-3 md:mb-4 mx-auto" size={32} />
                <h3 className="font-semibold text-base md:text-lg mb-2 text-center">Phone</h3>
                <p className="text-xs md:text-sm text-muted-foreground text-center">
                  +234 803 XXX XXXX
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <Clock className="text-primary mb-3 md:mb-4 mx-auto" size={32} />
                <h3 className="font-semibold text-base md:text-lg mb-2 text-center">Working Hours</h3>
                <p className="text-xs md:text-sm text-muted-foreground text-center">
                  Mon - Fri: 8:00 AM - 4:00 PM
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-lg mb-6 md:mb-8 h-[250px] md:h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.2!2d7.0!3d6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMDAuMCJOIDfCsDAwJzAwLjAiRQ!5e0!3m2!1sen!2sng!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Salem Schools Location"
            />
          </div>
          
          <div className="text-center">
            <Button size="lg" className="touch-target w-full sm:w-auto" asChild>
              <Link to="/contact">Send Us a Message</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
