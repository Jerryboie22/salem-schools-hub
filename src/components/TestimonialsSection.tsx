import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  message: string;
  image_url: string | null;
}

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

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

  return (
    <section className="py-16 bg-gradient-to-br from-[hsl(var(--cream))] via-[hsl(var(--gold-light))] to-[hsl(var(--cream))]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Quote className="w-12 h-12 mx-auto mb-4 text-[hsl(var(--gold-dark))]" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">What Our People Say</h2>
          <p className="text-lg text-primary/80 max-w-2xl mx-auto">
            Hear from our satisfied parents, students, and alumni about their experiences at Salem Group of Schools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id} 
              className="relative hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-[hsl(var(--gold))]/30 bg-white/95 backdrop-blur"
            >
              <CardContent className="pt-12 pb-6 px-6">
                <Quote className="w-10 h-10 text-[hsl(var(--gold))]/30 absolute top-6 left-6" />
                <p className="text-primary/70 mb-8 relative z-10 text-base leading-relaxed italic">
                  "{testimonial.message}"
                </p>
                <div className="flex items-center gap-4 mt-6 pt-6 border-t border-[hsl(var(--gold))]/20">
                  {testimonial.image_url && (
                    <img
                      src={testimonial.image_url}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-[hsl(var(--gold-dark))]/30"
                    />
                  )}
                  <div>
                    <div className="font-bold text-lg text-primary">{testimonial.name}</div>
                    <div className="text-sm text-[hsl(var(--gold-dark))] font-medium">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {testimonials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-primary/60">No testimonials available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
