import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import logo from "@/assets/salem-logo-new.jpg";

const Hero = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false })
  ]);

  const { data: slides, isLoading } = useQuery({
    queryKey: ["hero-slides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homepage_content")
        .select("*")
        .eq("section", "hero")
        .eq("is_active", true)
        .order("order_index");
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="relative h-[55vh] md:h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </section>
    );
  }

  return (
    <section className="relative h-[55vh] md:h-[60vh] overflow-hidden" ref={emblaRef}>
      <div className="flex h-full">
        {slides?.map((slide) => (
          <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 h-full">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image_url})` }}
            />
            <div className="absolute inset-0 bg-black/30" />
            
            <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 h-full flex items-center">
              <div className="max-w-4xl mx-auto text-center text-white w-full">
                <div className="mb-4 md:mb-6">
                  <img src={logo} alt="Salem Group of Schools" className="h-16 md:h-20 w-auto mx-auto drop-shadow-2xl" />
                </div>
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
                  {slide.title}
                </h1>
                <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
                  {slide.subtitle}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" variant="secondary" className="text-base" asChild>
                    <Link to="/contact">Apply Now</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="bg-white/90 text-primary hover:bg-white border-white text-base" asChild>
                    <Link to="/about">Learn More</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;
