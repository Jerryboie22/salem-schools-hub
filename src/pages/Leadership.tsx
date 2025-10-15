import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Award } from "lucide-react";

interface Leader {
  id: string;
  name: string;
  position: string;
  bio: string | null;
  image_url: string | null;
  order_index: number;
  is_active: boolean;
}

const Leadership = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      const { data, error } = await supabase
        .from("leadership_team")
        .select("*")
        .eq("is_active", true)
        .order("order_index");

      if (error) throw error;
      setLeaders(data || []);
    } catch (error) {
      console.error("Error fetching leaders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Parse bio to extract qualifications if formatted with bullets
  const parseQualifications = (bio: string | null) => {
    if (!bio) return [];
    
    const lines = bio.split('\n').filter(line => line.trim());
    const qualifications: string[] = [];

    lines.forEach(line => {
      if (line.startsWith('•') || line.startsWith('-')) {
        qualifications.push(line.replace(/^[•-]\s*/, ''));
      } else if (!line.toLowerCase().includes('qualification') && !line.toLowerCase().includes('about')) {
        qualifications.push(line);
      }
    });

    return qualifications.filter(q => q.length > 0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary via-primary/90 to-accent overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCAzLjk5LTRoMi4wMmMxLjEgMCAyIC45IDIgMnYyYzAgMS4xLS45IDItMiAySDM4Yy0xLjEgMC0yLS45LTItMnYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4 animate-fade-in">
            Leadership Team
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto animate-fade-in">
            Meet the dedicated leaders shaping the future of Salem Group of Schools
          </p>
        </div>
      </section>

      {/* Leaders Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-muted-foreground">Loading leadership team...</p>
            </div>
          ) : leaders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No leadership team members found.</p>
            </div>
          ) : (
            <div className="space-y-6 max-w-5xl mx-auto">
              {leaders.map((leader, index) => {
                const qualifications = parseQualifications(leader.bio);
                const isEven = index % 2 === 0;
                
                return (
                  <div
                    key={leader.id}
                    className="bg-card rounded-xl shadow-md overflow-hidden border border-border/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`grid md:grid-cols-[280px,1fr] gap-0 ${!isEven ? 'md:grid-cols-[1fr,280px]' : ''}`}>
                      {/* Profile Section */}
                      <div className={`bg-gradient-to-br from-accent/5 via-background to-primary/5 p-6 flex flex-col items-center justify-center ${!isEven ? 'md:order-2' : ''}`}>
                        <div className="relative mb-4">
                          <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-background shadow-lg">
                            {leader.image_url ? (
                              <img
                                src={leader.image_url}
                                alt={leader.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                <span className="text-4xl font-bold text-primary/40">
                                  {leader.name.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg ring-4 ring-background">
                            <Award className="w-5 h-5 text-accent-foreground" />
                          </div>
                        </div>
                        
                        <h2 className="text-xl font-bold text-foreground mb-1 text-center">
                          {leader.name}
                        </h2>
                        <span className="inline-block px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs font-semibold">
                          {leader.position}
                        </span>
                      </div>

                      {/* Qualifications Section */}
                      <div className={`p-6 flex flex-col justify-center ${!isEven ? 'md:order-1' : ''}`}>
                        {qualifications.length > 0 && (
                          <div>
                            <h3 className="text-lg font-bold text-foreground mb-3">Qualifications</h3>
                            <ul className="space-y-2">
                              {qualifications.map((qual, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                                  <span className="text-sm text-muted-foreground">{qual}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Leadership;
