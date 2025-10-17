import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Baby, BookOpen, Sparkles, Users } from "lucide-react";
import childrenSchoolImg from "@/assets/IMG-20251016-WA0007.jpg";
import SchoolPhotoSlider from "@/components/SchoolPhotoSlider";
import PrincipalDesk from "@/components/PrincipalDesk";
import SchoolFacilities from "@/components/SchoolFacilities";
import SchoolAssignments from "@/components/SchoolAssignments";

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
            <Baby className="w-16 md:w-20 h-16 md:h-20 mx-auto mb-4" />
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Children School</h1>
            <p className="text-lg md:text-xl">Nurturing Young Minds (Ages 2-5)</p>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our School Gallery</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Take a visual tour of our nurturing environment
            </p>
          </div>
          <SchoolPhotoSlider schoolType="children" />
        </div>
      </section>

      {/* Principal's Desk */}
      <section className="py-12 md:py-16 bg-soft-green">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">From the Head Teacher's Desk</h2>
          </div>
          <PrincipalDesk schoolType="children" />
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-base md:text-lg mb-12 text-center text-muted-foreground">
            Our Children School provides a warm, stimulating environment where your child's
            first steps in education are filled with joy, discovery, and learning through play.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            <Card className="border-t-4 border-t-primary hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <h3 className="text-base md:text-lg font-semibold text-center">Academic Excellence</h3>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <h3 className="text-base md:text-lg font-semibold text-center">ICT Integration</h3>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <h3 className="text-base md:text-lg font-semibold text-center">Early Learning</h3>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <h3 className="text-base md:text-lg font-semibold text-center">Creative Play</h3>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Facilities Section */}
      <section className="py-12 md:py-16 bg-soft-green">
        <div className="container mx-auto px-4">
          <SchoolFacilities schoolType="children" />
        </div>
      </section>

      {/* Assignments Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <SchoolAssignments schoolType="children" />
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-4 text-center">Program Highlights</h2>
              <ul className="space-y-3 max-w-2xl mx-auto">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span className="text-sm md:text-base">Morning and afternoon sessions available</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span className="text-sm md:text-base">Music, art, and movement activities</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span className="text-sm md:text-base">Nutritious snacks and healthy meal options</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span className="text-sm md:text-base">Regular parent-teacher communication</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span className="text-sm md:text-base">Preparation for Primary School transition</span>
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
