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
import SubjectsManager from "./components/SubjectsManager";
import SchoolFeesManager from "./components/SchoolFeesManager";

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
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-10 backdrop-blur-sm bg-opacity-95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage your school system</p>
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm" className="w-full sm:w-auto">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="classes" className="w-full">
          <div className="mb-6 animate-fade-in space-y-6">
            {/* Portal Management */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-primary"></div>
                Portal Management
              </h2>
              <TabsList className="w-full h-auto bg-muted/50 p-1 flex flex-wrap gap-1">
                <TabsTrigger value="classes" className="flex-1 min-w-[120px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">Classes</TabsTrigger>
                <TabsTrigger value="subjects" className="flex-1 min-w-[120px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">Subjects</TabsTrigger>
                <TabsTrigger value="assignments" className="flex-1 min-w-[120px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">Assignments</TabsTrigger>
                <TabsTrigger value="grades" className="flex-1 min-w-[120px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">Grades</TabsTrigger>
                <TabsTrigger value="classnotes" className="flex-1 min-w-[120px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">Class Notes</TabsTrigger>
                <TabsTrigger value="studentclasses" className="flex-1 min-w-[120px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">Student Classes</TabsTrigger>
                <TabsTrigger value="schoolfees" className="flex-1 min-w-[120px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm">School Fees</TabsTrigger>
              </TabsList>
            </div>
            
            {/* Website Content */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-accent"></div>
                Website Content
              </h2>
              <TabsList className="w-full h-auto bg-muted/50 p-1 flex flex-wrap gap-1">
                <TabsTrigger value="blog" className="flex-1 min-w-[100px] data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-xs sm:text-sm">Blog</TabsTrigger>
                <TabsTrigger value="gallery" className="flex-1 min-w-[100px] data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-xs sm:text-sm">Gallery</TabsTrigger>
                <TabsTrigger value="leadership" className="flex-1 min-w-[100px] data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-xs sm:text-sm">Leadership</TabsTrigger>
                <TabsTrigger value="testimonials" className="flex-1 min-w-[100px] data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-xs sm:text-sm">Testimonials</TabsTrigger>
                <TabsTrigger value="messages" className="flex-1 min-w-[100px] data-[state=active]:bg-accent data-[state=active]:text-accent-foreground text-xs sm:text-sm">Messages</TabsTrigger>
              </TabsList>
            </div>
            
            {/* System Management */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-secondary"></div>
                System Management
              </h2>
              <TabsList className="w-full h-auto bg-muted/50 p-1">
                <TabsTrigger value="users" className="flex-1 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground text-xs sm:text-sm">User Management</TabsTrigger>
              </TabsList>
            </div>
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

          <TabsContent value="subjects">
            <SubjectsManager />
          </TabsContent>

          <TabsContent value="schoolfees">
            <SchoolFeesManager />
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
