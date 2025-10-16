import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Home, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LessonPlansManager from "@/pages/admin/components/LessonPlansManager";
import SchedulesManager from "@/pages/admin/components/SchedulesManager";
import StudentClassesManager from "@/pages/admin/components/StudentClassesManager";
import TeacherStudentsView from "@/pages/admin/components/TeacherStudentsView";
import GradesManager from "@/pages/admin/components/GradesManager";
import AssignmentsManager from "@/pages/admin/components/AssignmentsManager";
import AttendanceManager from "@/pages/admin/components/AttendanceManager";

interface Profile {
  full_name: string;
  phone: string;
  address: string;
  date_of_birth: string;
  avatar_url: string;
}

const TeacherDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    phone: "",
    address: "",
    date_of_birth: "",
    avatar_url: "",
  });
  const [uploading, setUploading] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAccess();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (data) {
      setProfile({
        full_name: data.full_name || "",
        phone: data.phone || "",
        address: data.address || "",
        date_of_birth: data.date_of_birth || "",
        avatar_url: data.avatar_url || "",
      });
    }
  };

  const fetchAnnouncements = async () => {
    const { data } = await supabase
      .from("class_notes")
      .select("*, classes(name)")
      .order("created_at", { ascending: false })
      .limit(10);
    
    if (data) setAnnouncements(data);
  };

  const handleUpdateProfile = async () => {
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: teacherId,
        ...profile,
        email: userEmail,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    }
  };

  const checkAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/portal/teacher");
      return;
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .in("role", ["teacher", "admin"]);

    if (error || !data || data.length === 0) {
      toast({
        title: "Access Denied",
        description: "You don't have teacher or admin access.",
        variant: "destructive",
      });
      navigate("/portal/teacher");
      return;
    }

    setUserEmail(session.user.email || "");
    setTeacherId(session.user.id);
    await fetchProfile(session.user.id);
    await fetchAnnouncements();
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/portal/teacher");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50">
      <header className="glass-effect border-b sticky top-0 z-10 bg-white/95 backdrop-blur">
        <div className="container mx-auto px-3 sm:px-6 py-2.5 sm:py-4">
          <div className="flex justify-between items-center gap-2">
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-xl font-bold bg-gradient-teacher bg-clip-text text-transparent">Dashboard</h1>
              <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
            </div>
            <div className="flex gap-1.5 sm:gap-2">
              <Link to="/">
                <Button size="sm" variant="outline" className="h-8 w-8 sm:w-auto sm:h-9 sm:gap-2 p-0 sm:px-3">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">Home</span>
                </Button>
              </Link>
              <Button onClick={handleSignOut} size="sm" className="gradient-teacher text-white border-0 h-8 w-8 sm:w-auto sm:h-9 p-0 sm:px-3">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-xs sm:ml-2">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-6 max-w-7xl">
        <Tabs defaultValue="profile" className="space-y-3 sm:space-y-4">
          <TabsList className="grid grid-cols-4 sm:grid-cols-7 w-full h-auto gap-1 bg-white/90 backdrop-blur p-1 rounded-lg shadow-sm">
            <TabsTrigger value="profile" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-gradient-teacher data-[state=active]:text-white">Profile</TabsTrigger>
            <TabsTrigger value="attendance" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-gradient-teacher data-[state=active]:text-white">Attend</TabsTrigger>
            <TabsTrigger value="lesson-plans" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-gradient-teacher data-[state=active]:text-white">Lessons</TabsTrigger>
            <TabsTrigger value="schedules" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-gradient-teacher data-[state=active]:text-white">Schedule</TabsTrigger>
            <TabsTrigger value="students" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-gradient-teacher data-[state=active]:text-white">Students</TabsTrigger>
            <TabsTrigger value="assignments" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-gradient-teacher data-[state=active]:text-white">Tasks</TabsTrigger>
            <TabsTrigger value="grades" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-gradient-teacher data-[state=active]:text-white">Grades</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-3">
            {announcements.length > 0 && (
              <Card className="border shadow-md">
                <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    Announcements
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0 space-y-2">
                  {announcements.slice(0, 3).map((announcement) => (
                    <div key={announcement.id} className="p-3 rounded-lg bg-purple-50/50 border border-purple-100">
                      <h4 className="font-medium text-sm text-purple-900">{announcement.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{announcement.content}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-purple-600">
                        <span>{announcement.classes?.name || 'All'}</span>
                        <span>•</span>
                        <span>{new Date(announcement.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="text-base sm:text-lg">My Profile</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0 space-y-3">
                <div className="flex items-start gap-3 pb-3 border-b">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full gradient-teacher flex items-center justify-center overflow-hidden shadow-md ring-2 ring-white flex-shrink-0">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl sm:text-3xl font-bold text-white">{profile.full_name?.[0] || "T"}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Label className="text-xs font-semibold">Profile Picture</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploading(true);
                        const fileExt = file.name.split('.').pop();
                        const filePath = `${teacherId}/${Date.now()}.${fileExt}`;
                        const { error: uploadError } = await supabase.storage
                          .from('avatars')
                          .upload(filePath, file);
                        if (uploadError) {
                          toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
                          setUploading(false);
                          return;
                        }
                        const { data: { publicUrl } } = supabase.storage
                          .from('avatars')
                          .getPublicUrl(filePath);
                        setProfile({ ...profile, avatar_url: publicUrl });
                        setUploading(false);
                      }}
                      disabled={uploading}
                      className="mt-1 text-xs h-8"
                    />
                    {uploading && <p className="text-xs text-purple-600 mt-0.5 animate-pulse">Uploading...</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Email</Label>
                    <Input value={userEmail} disabled className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Full Name</Label>
                    <Input
                      value={profile.full_name}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      placeholder="Full name"
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Phone</Label>
                    <Input
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="Phone number"
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Date of Birth</Label>
                    <Input
                      type="date"
                      value={profile.date_of_birth}
                      onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs">Address</Label>
                    <Input
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      placeholder="Address"
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
                
                <Button onClick={handleUpdateProfile} className="w-full h-9 text-sm">Update Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceManager />
          </TabsContent>

          <TabsContent value="lesson-plans">
            <LessonPlansManager teacherId={teacherId} />
          </TabsContent>

          <TabsContent value="schedules">
            <SchedulesManager teacherId={teacherId} />
          </TabsContent>

          <TabsContent value="students">
            <TeacherStudentsView />
          </TabsContent>

          <TabsContent value="assignments">
            <AssignmentsManager />
          </TabsContent>

          <TabsContent value="grades">
            <GradesManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherDashboard;
