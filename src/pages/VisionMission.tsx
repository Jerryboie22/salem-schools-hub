import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Target, Eye, Heart, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const VisionMission = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="gradient-hero py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Target className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">Vision & Mission</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Our commitment to educational excellence and godly character
          </p>
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
                  <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                    Building a generation rooted in knowledge, discipline, and excellence through quality education and Christian values. Our mission is to:
                  </p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span>Provide world-class education that combines academic excellence with moral and spiritual development</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span>Foster an environment where students discover and develop their God-given talents and abilities</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span>Instill discipline, integrity, and leadership qualities in every student</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span>Partner with parents to ensure holistic child development</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span>Equip students with 21st-century skills for global competitiveness</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Core Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold">Excellence</h3>
                </div>
                <p className="text-muted-foreground">
                  We pursue the highest standards in everything we do, from academics to character development.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Integrity</h3>
                </div>
                <p className="text-muted-foreground">
                  We uphold honesty, transparency, and ethical behavior in all our interactions and decisions.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold">Discipline</h3>
                </div>
                <p className="text-muted-foreground">
                  We instill self-control, focus, and determination in our students to achieve their goals.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Godly Character</h3>
                </div>
                <p className="text-muted-foreground">
                  We nurture Christian values and spiritual growth in every aspect of school life.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VisionMission;
