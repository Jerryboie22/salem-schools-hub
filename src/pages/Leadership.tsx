import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

interface Leader {
  id: string;
  name: string;
  position: string;
  bio: string;
  image_url: string | null;
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
      <div className="gradient-hero py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Users className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">Leadership Team</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Meet the dedicated professionals guiding Salem Group of Schools toward excellence
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {leaders.map((leader) => (
            <Card key={leader.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="h-64 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                {leader.image_url ? (
                  <img
                    src={leader.image_url}
                    alt={leader.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Users className="w-24 h-24 text-primary/40" />
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2">{leader.name}</h3>
                <p className="text-accent font-semibold mb-4">{leader.position}</p>
                <p className="text-muted-foreground leading-relaxed">{leader.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Leadership;
