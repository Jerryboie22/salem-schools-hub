import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/children-school.jpg";
import logo from "@/assets/salem-logo-new.jpg";

const Hero = () => {
  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] flex items-center">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-primary/40"></div>
      </div>
      
      <div className="absolute top-4 md:top-8 left-1/2 -translate-x-1/2">
        <img src={logo} alt="Salem Group of Schools Logo" className="h-16 md:h-20 lg:h-24 w-auto drop-shadow-2xl" />
      </div>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl text-primary-foreground animate-fade-in">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            Salem Group of Schools
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 opacity-95">
            Building a generation rooted in knowledge, discipline, and excellence.
          </p>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 mb-8 md:mb-12">
            <Button size="lg" variant="secondary" className="touch-target w-full sm:w-auto" asChild>
              <Link to="/contact">Apply for Admission</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white hover:bg-white hover:text-primary touch-target w-full sm:w-auto" asChild>
              <Link to="/about">Learn More About Us</Link>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-2xl">
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">3,000+</div>
              <div className="text-xs md:text-sm opacity-90">Students</div>
            </div>
            <div className="text-center border-l border-r border-white/30">
              <div className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">25+</div>
              <div className="text-xs md:text-sm opacity-90">Years of Excellence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">3</div>
              <div className="text-xs md:text-sm opacity-90">School Branches</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
