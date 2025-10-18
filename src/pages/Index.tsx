import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import SchoolsSection from "@/components/SchoolsSection";
import GallerySlider from "@/components/GallerySlider";
import NewsSection from "@/components/NewsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Users, Award, Library, FlaskConical, Monitor, Trophy, MapPin, Mail, Phone, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import aboutImg from "@/assets/welcome-salem-building.jpg";
import facilitiesImg from "@/assets/science-lab.jpg";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      
      {/* About Section */}
      <section className="py-6 md:py-10 bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
              <div className="space-y-3 md:space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold">Welcome to Salem</h2>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  For over 25 years, Salem Group of Schools has been committed to providing 
                  quality education that combines academic excellence with Christian values.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                    <BookOpen className="text-primary flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <h3 className="font-semibold text-sm mb-0.5">Quality Curriculum</h3>
                      <p className="text-xs text-muted-foreground">International standards</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                    <Users className="text-primary flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <h3 className="font-semibold text-sm mb-0.5">Expert Teachers</h3>
                      <p className="text-xs text-muted-foreground">Qualified professionals</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                    <Award className="text-primary flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <h3 className="font-semibold text-sm mb-0.5">Excellence Awards</h3>
                      <p className="text-xs text-muted-foreground">Recognized performance</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                    <Library className="text-primary flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <h3 className="font-semibold text-sm mb-0.5">Modern Facilities</h3>
                      <p className="text-xs text-muted-foreground">State-of-the-art resources</p>
                    </div>
                  </div>
                </div>
                
                <Button size="lg" className="touch-target w-full sm:w-auto mt-4" asChild>
                  <Link to="/vision-mission">Learn More</Link>
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


      {/* Mission & Values Section */}
      <section className="py-8 md:py-12 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(var(--primary-rgb),0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(var(--accent-rgb),0.1),transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3">Our Mission</h2>
              <div className="max-w-3xl mx-auto">
                <p className="text-base md:text-lg leading-relaxed">
                  To raise leaders of tomorrow from adolescents through academics, character, and spiritual training that orientates them to pursue values for self and beyond self.
                </p>
              </div>
            </div>

            <div className="mt-8 md:mt-10">
              <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">Core Values</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                <Card className="hover:shadow-lg transition-all hover:-translate-y-1 border-t-4 border-t-primary bg-background/80 backdrop-blur">
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                      <Heart className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <h4 className="text-sm md:text-base font-bold">Fear of God</h4>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all hover:-translate-y-1 border-t-4 border-t-accent bg-background/80 backdrop-blur">
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-accent to-accent/70 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                      <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <h4 className="text-sm md:text-base font-bold">Integrity</h4>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all hover:-translate-y-1 border-t-4 border-t-primary bg-background/80 backdrop-blur">
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                      <Award className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <h4 className="text-sm md:text-base font-bold">Diligence</h4>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all hover:-translate-y-1 border-t-4 border-t-accent bg-background/80 backdrop-blur">
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-accent to-accent/70 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                      <Users className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <h4 className="text-sm md:text-base font-bold">Help</h4>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center mt-6">
                <Button variant="outline" size="lg" className="touch-target" asChild>
                  <Link to="/vision-mission">Learn More About Our Vision</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SchoolsSection />
      
      {/* Facilities Section */}
      <section className="py-6 md:py-10 bg-background">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3">Our Facilities</h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                Modern infrastructure designed for optimal learning
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
              <div>
                <img 
                  src={facilitiesImg} 
                  alt="School Facilities" 
                  className="rounded-lg shadow-xl w-full h-auto"
                />
              </div>
              
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Library className="text-primary flex-shrink-0 mt-0.5" size={22} />
                  <div>
                    <h3 className="font-semibold text-base mb-1">Library</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Extensive collection of books and digital resources
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <FlaskConical className="text-primary flex-shrink-0 mt-0.5" size={22} />
                  <div>
                    <h3 className="font-semibold text-base mb-1">Science Labs</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Fully equipped for Physics, Chemistry, and Biology
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Monitor className="text-primary flex-shrink-0 mt-0.5" size={22} />
                  <div>
                    <h3 className="font-semibold text-base mb-1">ICT Center</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Modern computer labs with high-speed internet
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Trophy className="text-primary flex-shrink-0 mt-0.5" size={22} />
                  <div>
                    <h3 className="font-semibold text-base mb-1">Sports Complex</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
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
      <section className="py-6 md:py-10 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Get In Touch</h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                Visit us or reach out for any inquiries
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Map */}
              <div className="rounded-lg overflow-hidden shadow-lg h-[300px] md:h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.3098877098677!2d7.0659!3d6.2085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMzAuNiJOIDfCsDAzJzU3LjIiRQ!5e0!3m2!1sen!2sng!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Salem School Location"
                />
              </div>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="text-primary flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <h3 className="font-semibold text-sm mb-1">Address</h3>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          No. 17 Bolanle Awosika Street, Off Ilogbo Road, Ojuore, Ota, Ogun State
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Mail className="text-primary flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <h3 className="font-semibold text-sm mb-1">Email</h3>
                        <p className="text-xs md:text-sm text-muted-foreground break-words">
                          info@salemschools.edu.ng
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Phone className="text-primary flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <h3 className="font-semibold text-sm mb-1">Phone</h3>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          +234 802 370 2107
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="pt-1">
                  <Button size="lg" className="w-full" asChild>
                    <Link to="/contact">Send Us a Message</Link>
                  </Button>
                </div>
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
