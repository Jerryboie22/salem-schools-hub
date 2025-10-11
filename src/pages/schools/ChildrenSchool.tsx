import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Baby, BookOpen, Sparkles, Users } from "lucide-react";
import childrenSchoolImg from "@/assets/children-school.jpg";

const ChildrenSchool = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="relative h-[400px]">
        <img
          src={childrenSchoolImg}
          alt="Children School"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div>
            <Baby className="w-20 h-20 mx-auto mb-4" />
            <h1 className="text-5xl font-bold mb-4">Children School</h1>
            <p className="text-xl">Nurturing Young Minds (Ages 2-5)</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg mb-12 text-center text-muted-foreground">
            Our Children School provides a warm, stimulating environment where your child's
            first steps in education are filled with joy, discovery, and learning through play.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="border-t-4 border-t-primary hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3">Early Learning</h3>
                <p className="text-muted-foreground">
                  Age-appropriate curriculum focusing on literacy, numeracy, and creative expression
                  through hands-on activities and play-based learning.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-accent hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-xl mb-3">Small Class Sizes</h3>
                <p className="text-muted-foreground">
                  Low student-to-teacher ratios ensure personalized attention and care for
                  each child's individual needs and learning pace.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3">Creative Play</h3>
                <p className="text-muted-foreground">
                  Safe, colorful play areas equipped with age-appropriate toys and learning
                  materials that encourage imagination and motor skill development.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-accent hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Baby className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-xl mb-3">Caring Environment</h3>
                <p className="text-muted-foreground">
                  Experienced, nurturing teachers create a home-away-from-home atmosphere
                  where children feel safe, loved, and excited to learn.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-center">Program Highlights</h2>
              <ul className="space-y-3 max-w-2xl mx-auto">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span>Morning and afternoon sessions available</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span>Music, art, and movement activities</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span>Nutritious snacks and healthy meal options</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span>Regular parent-teacher communication</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span>Preparation for Primary School transition</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ChildrenSchool;
