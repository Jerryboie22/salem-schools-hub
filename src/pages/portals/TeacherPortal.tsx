import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Class {
  id: string;
  name: string;
}

const TeacherPortal = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const { data } = await supabase.from("classes").select("*").order("name");
    if (data) setClasses(data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Check teacher role via secure DB function (bypasses RLS edge cases)
    const { data: hasTeacherRole, error: roleCheckError } = await supabase.rpc('has_role', {
      _user_id: data.user.id,
      _role: 'teacher' as any,
    });

    if (roleCheckError) {
      toast({
        title: "Access Denied",
        description: "Unable to verify teacher access. Please try again.",
        variant: "destructive",
      });
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    if (!hasTeacherRole) {
      toast({
        title: "Access Denied",
        description: "You don't have teacher access.",
        variant: "destructive",
      });
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    toast({
      title: "Welcome!",
      description: "Login successful.",
    });
    navigate("/portal/teacher/dashboard");
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/portal/teacher/dashboard`,
      },
    });

    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (data.user) {
      // Assign teacher role and create profile
      const [roleRes, profileRes] = await Promise.all([
        supabase.from("user_roles").insert({ user_id: data.user.id, role: "teacher" }),
        supabase.from("profiles").upsert({ id: data.user.id, email, full_name: fullName })
      ]);

      if (roleRes.error || profileRes.error) {
        toast({
          title: "Setup failed",
          description: "Please contact support.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      toast({
        title: "Account created!",
        description: "You can now login with your credentials.",
      });
      
      setEmail("");
      setFullName("");
      setPassword("");
      setConfirmPassword("");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="gradient-hero py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Users className="w-12 h-12" />
          </div>
          <h1 className="text-5xl font-bold mb-4">Teacher Portal</h1>
          <p className="text-xl opacity-90">Manage your classes and student records</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-2xl overflow-hidden animate-scale-in">
            <div className="h-2 gradient-hero"></div>
            <CardHeader>
              <CardTitle className="text-2xl">Teacher Portal Access</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Logging in..." : "Login to Portal"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="full-name">Full Name</Label>
                      <Input
                        id="full-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Select Classes You'll Teach</Label>
                      <div className="max-h-40 overflow-y-auto border rounded-lg p-2 space-y-2">
                        {classes.map((cls) => (
                          <label key={cls.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={selectedClasses.includes(cls.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedClasses([...selectedClasses, cls.id]);
                                } else {
                                  setSelectedClasses(selectedClasses.filter(id => id !== cls.id));
                                }
                              }}
                              className="rounded"
                            />
                            <span className="text-sm">{cls.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="mt-8 border-0 shadow-xl bg-gradient-to-r from-primary/5 to-accent/5 border-l-4 border-l-primary animate-fade-in">
            <CardContent className="p-8">
              <h3 className="font-bold text-xl mb-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                Need Help?
              </h3>
              <p className="text-muted-foreground mb-2">
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
