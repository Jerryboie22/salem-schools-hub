import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Calendar, FileText, ClipboardCheck } from "lucide-react";

const TeacherPortal = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Authentication will be implemented
    console.log("Teacher login", email);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="gradient-hero py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Users className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">Teacher Portal</h1>
          <p className="text-xl opacity-90">Manage your classes and student records</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Login Form */}
            <Card className="border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle className="text-2xl">Teacher Login</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email or Staff ID</Label>
                    <Input
                      id="email"
                      type="text"
                      placeholder="Enter your email or staff ID"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Login to Portal</Button>
                  <p className="text-sm text-center text-muted-foreground">
                    <a href="#" className="text-accent hover:underline">Forgot password?</a>
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Portal Features */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-6">Portal Features</h2>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Class Management</h3>
                    <p className="text-sm text-muted-foreground">Manage your classes and student attendance</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ClipboardCheck className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Grades & Assessment</h3>
                    <p className="text-sm text-muted-foreground">Input and manage student grades and assessments</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Lesson Plans</h3>
                    <p className="text-sm text-muted-foreground">Create and manage your lesson plans and schemes</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Timetable & Schedule</h3>
                    <p className="text-sm text-muted-foreground">View your teaching schedule and school calendar</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Help Section */}
          <Card className="mt-8 bg-muted">
            <CardContent className="p-6 text-center">
              <h3 className="font-bold text-lg mb-2">Need Help?</h3>
              <p className="text-muted-foreground mb-4">
                Contact the academic office for assistance with the portal
              </p>
              <p className="text-sm text-accent font-semibold">academics@salemschools.edu.ng</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TeacherPortal;
