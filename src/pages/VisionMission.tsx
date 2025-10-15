import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Target, Eye, Heart, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import visionHero from "@/assets/vision-hero.jpg";

const VisionMission = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="relative h-[400px] overflow-hidden">
        <img src={visionHero} alt="Vision & Mission" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-accent/70"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 text-center text-primary-foreground">
            <Target className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">Vision & Mission</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Our commitment to educational excellence and godly character
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Vision */}
          <Card className="border-t-4 border-t-accent overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Eye className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    To be a leading educational institution that nurtures excellence, discipline, and godly character in every student. We envision a generation of learners who are academically outstanding, morally upright, and spiritually grounded, ready to make positive impacts in their communities and the world at large.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mission */}
          <Card className="border-t-4 border-t-primary overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-primary">Mission Statement</h2>
                  <p className="text-lg leading-relaxed">
                    The mission of the school is to raise leaders of tomorrow from adolescents through academics, character, and spiritual training that orientates them to pursue values for self and beyond self.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Core Values */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-primary">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Fear of God</h3>
                  <p className="text-sm text-muted-foreground italic">
                    The foundation of wisdom and character
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-accent">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Integrity</h3>
                  <p className="text-sm text-muted-foreground italic">
                    Upholding honesty and ethical standards
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-primary">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Diligence</h3>
                  <p className="text-sm text-muted-foreground italic">
                    Persistent effort towards excellence
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-all hover:-translate-y-1 border-t-4 border-t-accent">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Help</h3>
                  <p className="text-sm text-muted-foreground italic">
                    Serving others with compassion
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VisionMission;
