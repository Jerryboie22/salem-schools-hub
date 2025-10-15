import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Mail, Linkedin, Award } from "lucide-react";

interface Leader {
  id: string;
  name: string;
  position: string;
  bio: string;
  image_url: string | null;
  order_index: number;
}

const Leadership = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    const { data, error } = await supabase
      .from("leadership_team")
      .select("*")
      .eq("is_active", true)
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Error fetching leaders:", error);
      return;
    }

    setLeaders(data || []);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary via-primary/95 to-accent py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur rounded-full mb-6">
            <Users className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">Leadership Team</h1>
          <p className="text-base md:text-xl text-white/90 max-w-2xl mx-auto">
            Meet the dedicated professionals guiding Salem Group of Schools toward excellence
          </p>
        </div>
      </div>

      {/* Leadership Grid */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {leaders.map((leader, index) => (
            <Card 
              key={leader.id} 
              className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-t-4 border-t-primary"
            >
              {/* Image Section */}
              <div className="relative h-64 md:h-72 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                {leader.image_url ? (
                  <img
                    src={leader.image_url}
                    alt={leader.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Users className="w-24 h-24 md:w-32 md:h-32 text-primary/30" />
                  </div>
                )}
                {/* Ranking Badge */}
                <div className="absolute top-3 right-3 w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold shadow-lg">
                  {index + 1}
                </div>
              </div>

              {/* Content Section */}
              <CardContent className="p-5 md:p-6">
                <div className="mb-3">
                  <h3 className="text-xl md:text-2xl font-bold mb-1 group-hover:text-primary transition-colors">
                    {leader.name}
                  </h3>
                  <div className="flex items-center gap-2 text-accent font-semibold text-sm">
                    <Award className="w-4 h-4" />
                    <span>{leader.position}</span>
                  </div>
                </div>
                
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed line-clamp-4">
                  {leader.bio}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {leaders.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No leadership team members to display</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Leadership;
