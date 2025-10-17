import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Book, Award, Trophy } from "lucide-react";
import primarySchoolImg from "@/assets/IMG-20251016-WA0013.jpg";
import SchoolPhotoSlider from "@/components/SchoolPhotoSlider";
import PrincipalDesk from "@/components/PrincipalDesk";
import SchoolFacilities from "@/components/SchoolFacilities";
import SchoolAssignments from "@/components/SchoolAssignments";

const PrimarySchool = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="relative h-[400px]">
        <img
          src={primarySchoolImg}
          alt="Primary School"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div>
            <Book className="w-16 md:w-20 h-16 md:h-20 mx-auto mb-4" />
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Primary School</h1>
            <p className="text-lg md:text-xl">Building Strong Foundations (Grades 1-6)</p>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our School Gallery</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our vibrant learning environment
            </p>
          </div>
          <SchoolPhotoSlider schoolType="primary" />
        </div>
      </section>

      {/* Principal's Desk */}
      <section className="py-12 md:py-16 bg-soft-green">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">From the Principal's Desk</h2>
          </div>
          <PrincipalDesk schoolType="primary" />
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-base md:text-lg mb-12 text-center text-muted-foreground">
            Our Primary School provides a comprehensive, engaging curriculum that builds
            strong academic foundations while nurturing character, creativity, and critical thinking.
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
                <h3 className="text-base md:text-lg font-semibold text-center">Comprehensive Curriculum</h3>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <h3 className="text-base md:text-lg font-semibold text-center">Extracurricular Activities</h3>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Facilities Section */}
      <section className="py-12 md:py-16 bg-soft-green">
        <div className="container mx-auto px-4">
          <SchoolFacilities schoolType="primary" />
        </div>
      </section>

      {/* Assignments Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4">
          <SchoolAssignments schoolType="primary" />
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-4 text-center">Program Features</h2>
              <ul className="space-y-3 max-w-2xl mx-auto">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span className="text-sm md:text-base">Qualified and dedicated teaching staff</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span className="text-sm md:text-base">Modern library and science laboratories</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span className="text-sm md:text-base">Regular assessments and progress reports</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span className="text-sm md:text-base">Character development and values education</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span className="text-sm md:text-base">Sports facilities and inter-house competitions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span className="text-sm md:text-base">Preparation for secondary school entrance exams</span>
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

export default PrimarySchool;
