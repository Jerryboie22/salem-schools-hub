import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-main.jpg";

const Hero = () => {
  return (
    <section className="relative h-[600px] flex items-center">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary/70"></div>
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
