import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Book, Award, Trophy } from "lucide-react";
import primarySchoolImg from "@/assets/primary-school.jpg";

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
            <Book className="w-20 h-20 mx-auto mb-4" />
            <h1 className="text-5xl font-bold mb-4">Primary School</h1>
            <p className="text-xl">Building Strong Foundations (Grades 1-6)</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg mb-12 text-center text-muted-foreground">
            Our Primary School provides a comprehensive, engaging curriculum that builds
            strong academic foundations while nurturing character, creativity, and critical thinking.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="border-t-4 border-t-primary hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3">Comprehensive Curriculum</h3>
                <p className="text-muted-foreground">
                  Aligned with national standards, covering Mathematics, English Language, Science,
                  Social Studies, and more with engaging teaching methods.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-accent hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-xl mb-3">Extracurricular Activities</h3>
                <p className="text-muted-foreground">
                  Sports, arts, music, drama, and club activities that develop talents,
                  teamwork, and leadership skills beyond the classroom.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3">Academic Excellence</h3>
                <p className="text-muted-foreground">
                  Experienced teachers using innovative teaching methods to ensure every
                  student reaches their full potential and develops a love for learning.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-accent hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Book className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-xl mb-3">ICT Integration</h3>
                <p className="text-muted-foreground">
                  Modern computer labs and smart classrooms equipped with technology
                  to prepare students for the digital age.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-center">Program Features</h2>
              <ul className="space-y-3 max-w-2xl mx-auto">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span>Qualified and dedicated teaching staff</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span>Modern library and science laboratories</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span>Regular assessments and progress reports</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span>Character development and values education</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span>Sports facilities and inter-house competitions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span>Preparation for secondary school entrance exams</span>
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
