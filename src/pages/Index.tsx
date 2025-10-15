import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import SchoolsSection from "@/components/SchoolsSection";
import GallerySlider from "@/components/GallerySlider";
import NewsSection from "@/components/NewsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Users, Award, Library, FlaskConical, Monitor, Trophy, MapPin, Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import aboutImg from "@/assets/school-exterior.jpg";
import facilitiesImg from "@/assets/modern-facilities.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      
      {/* About Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="space-y-4 md:space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">Welcome to Salem</h2>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  For over 25 years, Salem Group of Schools has been committed to providing 
                  quality education that combines academic excellence with Christian values.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <BookOpen className="text-primary flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold mb-1">Quality Curriculum</h3>
                      <p className="text-sm text-muted-foreground">International standards</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <Users className="text-primary flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold mb-1">Expert Teachers</h3>
                      <p className="text-sm text-muted-foreground">Qualified professionals</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <Award className="text-primary flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold mb-1">Excellence Awards</h3>
                      <p className="text-sm text-muted-foreground">Recognized performance</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <Library className="text-primary flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-semibold mb-1">Modern Facilities</h3>
                      <p className="text-sm text-muted-foreground">State-of-the-art resources</p>
                    </div>
                  </div>
                </div>
                
                <Button size="lg" className="touch-target w-full sm:w-auto mt-6" asChild>
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
              
              <div className="order-first lg:order-last">
                <img 
                  src={aboutImg} 
                  alt="Salem School" 
                  className="rounded-lg shadow-xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SchoolsSection />
      
      {/* Facilities Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">Our Facilities</h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Modern infrastructure designed for optimal learning
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <img 
                  src={facilitiesImg} 
                  alt="School Facilities" 
                  className="rounded-lg shadow-xl w-full h-auto"
                />
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <Library className="text-primary flex-shrink-0 mt-1" size={28} />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Library</h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Extensive collection of books and digital resources
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <FlaskConical className="text-primary flex-shrink-0 mt-1" size={28} />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Science Labs</h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Fully equipped for Physics, Chemistry, and Biology
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <Monitor className="text-primary flex-shrink-0 mt-1" size={28} />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">ICT Center</h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Modern computer labs with high-speed internet
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                  <Trophy className="text-primary flex-shrink-0 mt-1" size={28} />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Sports Complex</h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Multiple fields and indoor sports facilities
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GallerySlider />
      
      <NewsSection />

      <TestimonialsSection />

      {/* Contact Section */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">Get In Touch</h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                We're here to answer your questions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 md:mb-12">
              <Card>
                <CardContent className="p-6 text-center">
                  <MapPin className="text-primary mb-4 mx-auto" size={32} />
                  <h3 className="font-semibold text-lg mb-2">Address</h3>
                  <p className="text-sm text-muted-foreground">
                    Salem School Complex<br />Awka, Anambra State
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Mail className="text-primary mb-4 mx-auto" size={32} />
                  <h3 className="font-semibold text-lg mb-2">Email</h3>
                  <p className="text-sm text-muted-foreground break-words">
                    info@salemschools.edu.ng
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Phone className="text-primary mb-4 mx-auto" size={32} />
                  <h3 className="font-semibold text-lg mb-2">Phone</h3>
                  <p className="text-sm text-muted-foreground">
                    +234 803 XXX XXXX
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center">
              <Button size="lg" className="touch-target w-full sm:w-auto" asChild>
                <Link to="/contact">Send Us a Message</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
