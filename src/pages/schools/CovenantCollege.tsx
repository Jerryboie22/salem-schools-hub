import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users, Globe, Award } from "lucide-react";
import covenantCollegeImg from "@/assets/covenant-college.jpg";

const CovenantCollege = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="relative h-[400px]">
        <img
          src={covenantCollegeImg}
          alt="Covenant College"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div>
            <GraduationCap className="w-20 h-20 mx-auto mb-4" />
            <h1 className="text-5xl font-bold mb-4">Covenant College</h1>
            <p className="text-xl">Excellence in Secondary Education (Grades 7-12)</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg mb-12 text-center text-muted-foreground">
            Covenant College prepares students for university and beyond with rigorous academics,
            character development, and a commitment to excellence in all endeavors.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="border-t-4 border-t-primary hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3">WAEC & NECO Excellence</h3>
                <p className="text-muted-foreground">
                  Outstanding track record in West African Examinations Council (WAEC) and
                  National Examinations Council (NECO) with consistent excellent results.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-accent hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-xl mb-3">Specialized Streams</h3>
                <p className="text-muted-foreground">
                  Science, Commercial, and Arts streams with specialized laboratories,
                  equipment, and experienced subject teachers.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-primary hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-xl mb-3">University Preparation</h3>
                <p className="text-muted-foreground">
                  Comprehensive guidance and support for JAMB preparation and university
                  entrance exams with dedicated counseling services.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-accent hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-xl mb-3">Leadership Development</h3>
                <p className="text-muted-foreground">
                  Student government, prefectorial system, and leadership training programs
                  that build responsible, confident future leaders.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-center">College Advantages</h2>
              <ul className="space-y-3 max-w-2xl mx-auto">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span>State-of-the-art science and computer laboratories</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span>Well-stocked library with digital resources</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span>Highly qualified and experienced teaching staff</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span>Vibrant clubs and societies (Debate, Science, Literary, etc.)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span>Active participation in inter-school competitions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span>Career counseling and mentorship programs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <span>Alumni network and support system</span>
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

export default CovenantCollege;
