import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Database, Settings, FileEdit } from "lucide-react";

const AdminPortal = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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

    // Check if user has admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges.",
        variant: "destructive",
      });
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    toast({
      title: "Welcome Admin!",
      description: "Login successful.",
    });
    navigate("/admin/dashboard");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar />
      <div className="gradient-admin py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Shield className="w-12 h-12" />
          </div>
          <h1 className="text-5xl font-bold mb-4">Admin Portal</h1>
          <p className="text-xl opacity-90">Manage school operations and content</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Login Form */}
            <Card className="border-0 shadow-2xl overflow-hidden animate-scale-in">
              <div className="h-2 gradient-admin"></div>
              <CardHeader>
                <CardTitle className="text-2xl">Admin Login</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Admin Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your admin email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="focus:ring-2 focus:ring-orange-500"
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
                      className="focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <Button type="submit" className="w-full gradient-admin text-white border-0 shadow-lg hover:shadow-xl transition-all" disabled={loading}>
                    {loading ? "Logging in..." : "Access Admin Portal"}
                  </Button>
                  <p className="text-sm text-center text-muted-foreground">
                    Authorized personnel only
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Portal Features */}
            <div className="space-y-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <h2 className="text-2xl font-bold mb-6">Admin Features</h2>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center flex-shrink-0 shadow-md">
                    <FileEdit className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Content Management</h3>
                    <p className="text-sm text-muted-foreground">Manage website content, news, and gallery</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Student Records</h3>
                    <p className="text-sm text-muted-foreground">Access and manage student database</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">System Settings</h3>
                    <p className="text-sm text-muted-foreground">Configure school settings and preferences</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">User Management</h3>
                    <p className="text-sm text-muted-foreground">Manage user accounts and permissions</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Security Notice */}
          <Card className="mt-8 border-0 shadow-xl bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-l-orange-500 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <CardContent className="p-8">
              <h3 className="font-bold text-xl mb-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                Security Notice
              </h3>
              <p className="text-muted-foreground">
                This portal is restricted to authorized administrators only. All activities are logged and monitored for security purposes. Unauthorized access attempts will be reported.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPortal;
