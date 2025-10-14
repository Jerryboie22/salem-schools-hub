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
        <div className="max-w-md mx-auto">
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

          {/* Security Notice */}
          <Card className="mt-8 border-0 shadow-xl bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-l-orange-500 animate-fade-in" style={{animationDelay: '0.2s'}}>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                Security Notice
              </h3>
              <p className="text-sm text-muted-foreground">
                This portal is restricted to authorized administrators only. All activities are logged and monitored for security purposes.
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
