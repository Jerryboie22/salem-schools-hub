import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";
import BlogPostsManager from "./components/BlogPostsManager";
import GalleryManager from "./components/GalleryManager";
import LeadershipManager from "./components/LeadershipManager";
import TestimonialsManager from "./components/TestimonialsManager";
import ContactMessagesManager from "./components/ContactMessagesManager";
import { UserManagementManager } from "./components/UserManagementManager";
import ClassesManager from "./components/ClassesManager";
import AssignmentsManager from "./components/AssignmentsManager";
import GradesManager from "./components/GradesManager";
import ClassNotesManager from "./components/ClassNotesManager";
import StudentClassesManager from "./components/StudentClassesManager";

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/portal/admin");
      return;
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (error || !data) {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setIsAdmin(true);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="classes" className="w-full">
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Portal Management</h2>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 mb-4 h-auto flex-wrap">
              <TabsTrigger value="classes">Classes</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="grades">Grades</TabsTrigger>
              <TabsTrigger value="classnotes">Class Notes</TabsTrigger>
              <TabsTrigger value="studentclasses">Student Classes</TabsTrigger>
            </TabsList>
            
            <h2 className="text-lg font-semibold mb-4 mt-6">Website Content</h2>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 mb-4 h-auto flex-wrap">
              <TabsTrigger value="blog">Blog</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="leadership">Leadership</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>
            
            <h2 className="text-lg font-semibold mb-4 mt-6">System Management</h2>
            <TabsList className="grid w-full grid-cols-1 lg:grid-cols-5 mb-4 h-auto">
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="classes">
            <ClassesManager />
          </TabsContent>

          <TabsContent value="assignments">
            <AssignmentsManager />
          </TabsContent>

          <TabsContent value="grades">
            <GradesManager />
          </TabsContent>

          <TabsContent value="classnotes">
            <ClassNotesManager />
          </TabsContent>

          <TabsContent value="studentclasses">
            <StudentClassesManager />
          </TabsContent>

          <TabsContent value="blog">
            <BlogPostsManager />
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryManager />
          </TabsContent>

          <TabsContent value="leadership">
            <LeadershipManager />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialsManager />
          </TabsContent>

          <TabsContent value="messages">
            <ContactMessagesManager />
          </TabsContent>

          <TabsContent value="users">
            <UserManagementManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
