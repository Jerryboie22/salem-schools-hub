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
      <header className="glass-effect border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-teacher bg-clip-text text-transparent">Teacher Dashboard</h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{userEmail}</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Link to="/">
                <Button size="sm" variant="outline" className="gap-2">
                  <Home className="w-4 h-4" />
                  Home
                </Button>
              </Link>
              <Button onClick={handleSignOut} size="sm" className="gradient-teacher text-white border-0 shadow-lg hover:shadow-xl transition-all">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <div className="overflow-x-auto -mx-4 px-4">
            <TabsList className="inline-flex w-full sm:w-auto min-w-full h-auto p-1 gap-1 bg-white/80 backdrop-blur">
              <TabsTrigger value="profile" className="flex-1 sm:flex-none text-xs sm:text-sm whitespace-nowrap">Profile</TabsTrigger>
              <TabsTrigger value="attendance" className="flex-1 sm:flex-none text-xs sm:text-sm whitespace-nowrap">Attendance</TabsTrigger>
              <TabsTrigger value="lesson-plans" className="flex-1 sm:flex-none text-xs sm:text-sm whitespace-nowrap">Lesson Plans</TabsTrigger>
              <TabsTrigger value="schedules" className="flex-1 sm:flex-none text-xs sm:text-sm whitespace-nowrap">Schedules</TabsTrigger>
              <TabsTrigger value="students" className="flex-1 sm:flex-none text-xs sm:text-sm whitespace-nowrap">Students</TabsTrigger>
              <TabsTrigger value="assignments" className="flex-1 sm:flex-none text-xs sm:text-sm whitespace-nowrap">Assignments</TabsTrigger>
              <TabsTrigger value="grades" className="flex-1 sm:flex-none text-xs sm:text-sm whitespace-nowrap">Grades</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile">
            <div className="space-y-6">
              <Card className="border-0 shadow-xl overflow-hidden">
                <div className="h-2 gradient-teacher"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-violet-500 rounded-full"></div>
                    Admin Announcements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {announcements.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                      <p className="text-muted-foreground">No announcements yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {announcements.map((announcement) => (
                        <div key={announcement.id} className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100 hover:shadow-md transition-all">
                          <h4 className="font-semibold text-purple-900">{announcement.title}</h4>
                          <p className="text-sm text-muted-foreground mt-2">{announcement.content}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="text-purple-600 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                              {announcement.classes?.name || 'All Teachers'}
                            </span>
                            <span className="text-muted-foreground">
                              {new Date(announcement.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>My Profile</CardTitle>
                </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center gap-4 mb-6">
                  <div className="w-32 h-32 rounded-full gradient-teacher flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-white">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl font-bold text-white">{profile.full_name?.[0] || "T"}</span>
                    )}
                  </div>
                  <div className="flex-1 w-full">
                    <Label className="text-sm font-semibold">Profile Picture</Label>
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
                      className="mt-2"
                    />
                    {uploading && <p className="text-xs text-purple-600 mt-1 animate-pulse">Uploading...</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={userEmail} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    placeholder="Enter your address"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={profile.date_of_birth}
                    onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                  />
                </div>
                <Button onClick={handleUpdateProfile}>Update Profile</Button>
              </CardContent>
            </Card>
            </div>
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
