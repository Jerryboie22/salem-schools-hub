import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/children-school.jpg";
import logo from "@/assets/salem-logo-new.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center bg-primary">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          <div className="mb-6 md:mb-8">
            <img src={logo} alt="Salem Group of Schools" className="h-20 md:h-28 w-auto mx-auto drop-shadow-2xl" />
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            Salem Group of Schools
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 max-w-2xl mx-auto">
            Excellence in Education. Character Development. Future Leaders.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 md:mb-16">
            <Button size="lg" variant="secondary" className="touch-target text-base md:text-lg" asChild>
              <Link to="/contact">Apply Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white hover:bg-white hover:text-primary touch-target text-base md:text-lg" asChild>
              <Link to="/about">Learn More</Link>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6 md:gap-12 max-w-3xl mx-auto pt-8 border-t border-white/20">
            <div>
              <div className="text-3xl md:text-5xl font-bold mb-2">3,000+</div>
              <div className="text-sm md:text-base opacity-90">Students</div>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-bold mb-2">25+</div>
              <div className="text-sm md:text-base opacity-90">Years</div>
            </div>
            <div>
              <div className="text-3xl md:text-5xl font-bold mb-2">3</div>
              <div className="text-sm md:text-base opacity-90">Branches</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
