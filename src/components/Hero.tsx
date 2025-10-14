import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/children-school.jpg";
import logo from "@/assets/salem-logo-new.jpg";

const Hero = () => {
  return (
    <section className="relative h-[600px] md:h-[700px] flex items-center">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-primary/40"></div>
      </div>
      
      <div className="absolute top-8 left-1/2 -translate-x-1/2 md:top-12">
        <img src={logo} alt="Salem Group of Schools Logo" className="h-20 md:h-24 w-auto drop-shadow-2xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl text-primary-foreground animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Salem Group of Schools
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-95">
            Building a generation rooted in knowledge, discipline, and excellence.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-12">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">Apply for Admission</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white hover:bg-white hover:text-primary" asChild>
              <Link to="/about">Learn More About Us</Link>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-2xl">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">3,000+</div>
              <div className="text-sm opacity-90">Students</div>
            </div>
            <div className="text-center border-l border-r border-white/30">
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-sm opacity-90">Years of Excellence</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">3</div>
              <div className="text-sm opacity-90">School Branches</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
