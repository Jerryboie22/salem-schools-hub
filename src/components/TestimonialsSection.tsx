import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  message: string;
  image_url: string | null;
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: "center",
    slidesToScroll: 1
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching testimonials:", error);
      return;
    }

    setTestimonials(data || []);
  };

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <section className="py-6 md:py-10 bg-gradient-to-br from-[hsl(var(--cream))] via-[hsl(var(--gold-light))] to-[hsl(var(--cream))]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-8">
          <Quote className="w-8 h-8 mx-auto mb-2 text-[hsl(var(--gold-dark))]" />
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-primary">What Our People Say</h2>
          <p className="text-sm md:text-base text-primary/80 max-w-2xl mx-auto">
            Hear from our satisfied parents, students, and alumni
          </p>
        </div>

        {testimonials.length > 0 ? (
          <div className="relative max-w-6xl mx-auto">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="flex-[0_0_100%] min-w-0 px-4">
                    <Card className="relative hover:shadow-xl transition-all duration-300 border-2 border-[hsl(var(--gold))]/30 bg-white/95 backdrop-blur max-w-2xl mx-auto">
                      <CardContent className="pt-8 pb-6 px-6 md:pt-10 md:pb-8 md:px-8">
                        <Quote className="w-8 h-8 md:w-10 md:h-10 text-[hsl(var(--gold))]/30 absolute top-4 left-4 md:top-6 md:left-6" />
                        <p className="text-primary/70 mb-6 relative z-10 text-sm md:text-base leading-relaxed italic text-center">
                          "{testimonial.message}"
                        </p>
                        <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-[hsl(var(--gold))]/20">
                          {testimonial.image_url && (
                            <img
                              src={testimonial.image_url}
                              alt={testimonial.name}
                              className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover ring-2 ring-[hsl(var(--gold-dark))]/30"
                            />
                          )}
                          <div className="text-center">
                            <div className="font-bold text-base md:text-lg text-primary">{testimonial.name}</div>
                            <div className="text-xs md:text-sm text-[hsl(var(--gold-dark))] font-medium">{testimonial.role}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 hover:bg-white shadow-lg hidden md:flex"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 hover:bg-white shadow-lg hidden md:flex"
              onClick={scrollNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-primary/60">No testimonials available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
