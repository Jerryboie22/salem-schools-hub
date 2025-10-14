import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogOut, BookOpen, Calendar, FileText, Award, Users, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  file_url: string;
  classes: { name: string };
}

interface Grade {
  id: string;
  subject: string;
  score: number;
  max_score: number;
  term: string;
}

interface ClassNote {
  id: string;
  title: string;
  content: string;
  created_at: string;
  classes: { name: string };
}

interface Schedule {
  id: string;
  subject: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  classes: { name: string };
}

interface SchoolFee {
  id: string;
  term: string;
  academic_year: string;
  amount: number;
  description: string;
  classes: { name: string };
}

interface Profile {
  full_name: string;
  address: string;
  date_of_birth: string;
  avatar_url: string;
}

interface StudentClass {
  class_id: string;
  classes: { name: string };
}

interface Class {
  id: string;
  name: string;
}

interface Attendance {
  id: string;
  date: string;
  status: string;
  classes: { name: string };
}

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    address: "",
    date_of_birth: "",
    avatar_url: "",
  });
  const [studentClasses, setStudentClasses] = useState<StudentClass[]>([]);
  const [uploading, setUploading] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [classNotes, setClassNotes] = useState<ClassNote[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [schoolFees, setSchoolFees] = useState<SchoolFee[]>([]);
  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAccess();
    fetchAllClasses();
  }, []);

  const fetchAllClasses = async () => {
    const { data } = await supabase.from("classes").select("*").order("name");
    if (data) setAllClasses(data);
  };

  const fetchStudentData = async (studentId: string) => {
    // 1) Get student's classes
    const { data: scData } = await supabase
      .from("student_classes")
      .select("class_id, classes(name)")
      .eq("student_id", studentId);

    if (scData) setStudentClasses(scData as StudentClass[]);
    const classIds = (scData || []).map((sc) => sc.class_id);

    // 2) Load profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("full_name, address, date_of_birth, avatar_url")
      .eq("id", studentId)
      .maybeSingle();

    if (profileData) {
      setProfile({
        full_name: profileData.full_name || "",
        address: profileData.address || "",
        date_of_birth: profileData.date_of_birth || "",
        avatar_url: profileData.avatar_url || "",
      });
    }

    // 3) Fetch assignments for student's classes
    if (classIds.length > 0) {
      const { data: assignmentsData } = await supabase
        .from("assignments")
        .select(`id, title, description, due_date, file_url, classes (name)`) 
        .in("class_id", classIds)
        .order("due_date", { ascending: true })
        .limit(5);
      if (assignmentsData) setAssignments(assignmentsData as Assignment[]);

      // 4) Class notes for student's classes
      const { data: notesData } = await supabase
        .from("class_notes")
        .select(`id, title, content, created_at, classes (name)`) 
        .in("class_id", classIds)
        .order("created_at", { ascending: false })
        .limit(5);
      if (notesData) setClassNotes(notesData as ClassNote[]);

      // 5) Weekly schedule for student's classes
      const { data: scheduleData } = await supabase
        .from("class_schedules")
        .select(`id, subject, day_of_week, start_time, end_time, classes (name)`) 
        .in("class_id", classIds)
        .order("day_of_week", { ascending: true });
      if (scheduleData) setSchedules(scheduleData as Schedule[]);

      // 6) School fees for student's classes
      const { data: feesData } = await supabase
        .from("school_fees")
        .select(`id, term, academic_year, amount, description, classes(name)`) 
        .in("class_id", classIds)
        .order("term", { ascending: true });
      if (feesData) setSchoolFees(feesData as SchoolFee[]);
    } else {
      setAssignments([]);
      setClassNotes([]);
      setSchedules([]);
      setSchoolFees([]);
    }

    // 7) Fetch grades (always by student id)
    const { data: gradesData } = await supabase
      .from("grades")
      .select("id, subject, score, max_score, term")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false })
      .limit(5);
    if (gradesData) setGrades(gradesData);

    // 8) Fetch attendance records
    const { data: attendanceData } = await supabase
      .from("attendance")
      .select("id, date, status, classes(name)")
      .eq("student_id", studentId)
      .order("date", { ascending: false })
      .limit(10);
    if (attendanceData) setAttendance(attendanceData as Attendance[]);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `${studentId}/${Date.now()}.${fileExt}`;

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
  };

  const handleClassChange = async (classId: string) => {
    // First, remove existing class assignments
    await supabase
      .from("student_classes")
      .delete()
      .eq("student_id", studentId);

    // Then add the new class assignment
    const { error } = await supabase
      .from("student_classes")
      .insert({ student_id: studentId, class_id: classId });

    if (error) {
      toast({ title: "Error", description: "Failed to update class", variant: "destructive" });
      return;
    }

    toast({ title: "Success", description: "Class updated successfully" });
    await fetchStudentData(studentId);
  };

  const handleUpdateProfile = async () => {
    const { error } = await supabase.from("profiles").upsert({
      id: studentId,
      ...profile,
      email: userEmail,
    });

    if (error) {
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Profile updated successfully" });
      await fetchStudentData(studentId);
    }
  };

  const checkAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/portal/student");
      return;
    }

    // Check if user has student or admin role
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .in("role", ["student", "admin"]);

    if (error || !data || data.length === 0) {
      toast({
        title: "Access Denied",
        description: "You don't have student or admin access.",
        variant: "destructive",
      });
      navigate("/portal/student");
      return;
    }

    setUserEmail(session.user.email || "");
    setStudentId(session.user.id);
    await fetchStudentData(session.user.id);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/portal/student");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <header className="glass-effect border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl gradient-student flex items-center justify-center overflow-hidden shadow-lg flex-shrink-0">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl sm:text-2xl font-bold text-white">{profile.full_name?.[0] || "S"}</span>
                )}
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-cyan-600 truncate">{profile.full_name || "Student Portal"}</h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{studentClasses.map(sc => sc.classes.name).join(", ") || "No class"}</p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Link to="/">
                <Button size="sm" variant="outline" className="gap-2">
                  <Home className="w-4 h-4" />
                  Home
                </Button>
              </Link>
              <Button onClick={handleSignOut} size="sm" className="gradient-student text-white">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Profile Section */}
        <Card className="gradient-card border-0 shadow-lg animate-slide-up overflow-hidden">
          <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 gradient-student opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <CardHeader className="relative p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-2xl flex items-center gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg gradient-student flex-shrink-0"></div>
              My Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 relative p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl gradient-student flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-white flex-shrink-0">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-bold text-white">{profile.full_name?.[0] || "S"}</span>
                )}
              </div>
              <div className="flex-1">
                <Label className="text-sm font-semibold text-muted-foreground">Profile Picture</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                  className="mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:gradient-student file:text-white hover:file:opacity-90"
                />
                {uploading && <p className="text-xs text-cyan-600 mt-1 animate-pulse">Uploading...</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Email</Label>
                <Input value={userEmail} disabled className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Full Name</Label>
                <Input
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  placeholder="Enter your full name"
                  className="focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Class</Label>
                <Select 
                  value={studentClasses[0]?.class_id || ""} 
                  onValueChange={handleClassChange}
                >
                  <SelectTrigger className="focus:ring-2 focus:ring-cyan-500">
                    <SelectValue placeholder="Select your class" />
                  </SelectTrigger>
                  <SelectContent>
                    {allClasses.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Date of Birth</Label>
                <Input
                  type="date"
                  value={profile.date_of_birth}
                  onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                  className="focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-sm font-semibold">Address</Label>
                <Input
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  placeholder="Enter your address"
                  className="focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>
            <Button onClick={handleUpdateProfile} className="gradient-student text-white border-0 shadow-lg hover:shadow-xl transition-all w-full md:w-auto">
              Update Profile
            </Button>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up" style={{animationDelay: '0.1s'}}>
          <Card className="stat-card border-0 shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Academic Calendar</CardTitle>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-md">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Active</div>
              <p className="text-xs text-muted-foreground mt-1">View term dates</p>
            </CardContent>
          </Card>

          <Card className="stat-card border-0 shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-400 to-emerald-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Assignments</CardTitle>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-md">
                <FileText className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">{assignments.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active tasks</p>
            </CardContent>
          </Card>

          <Card className="stat-card border-0 shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-400 to-purple-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Grades</CardTitle>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-md">
                <Award className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">{grades.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Recent scores</p>
            </CardContent>
          </Card>

          <Card className="stat-card border-0 shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-400 to-pink-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Attendance</CardTitle>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-md">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                {attendance.filter(a => a.status === 'present').length}/{attendance.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Days present</p>
            </CardContent>
          </Card>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="h-2 gradient-student"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
                Recent Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignments.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                  <p className="text-muted-foreground">No assignments available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="p-4 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-cyan-900">{assignment.title}</h4>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="text-cyan-600 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                              {assignment.classes.name}
                            </span>
                            <span className="text-muted-foreground">
                              Due: {new Date(assignment.due_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {assignment.file_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="shrink-0"
                            onClick={() => window.open(assignment.file_url, "_blank")}
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="h-2 gradient-student"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-8 bg-gradient-to-b from-violet-400 to-purple-500 rounded-full"></div>
                Recent Grades
              </CardTitle>
            </CardHeader>
            <CardContent>
              {grades.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                  <p className="text-muted-foreground">No grades available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {grades.map((grade) => (
                    <div key={grade.id} className="p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 hover:shadow-md transition-all">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-violet-900">{grade.subject}</h4>
                        <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                          {grade.score}/{grade.max_score}
                        </span>
                      </div>
                      <p className="text-sm text-violet-600 mt-1">{grade.term || 'N/A'}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 animate-slide-up" style={{animationDelay: '0.3s'}}>
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-teal-400 to-emerald-500"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-8 bg-gradient-to-b from-teal-400 to-emerald-500 rounded-full"></div>
                Class Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {classNotes.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                  <p className="text-muted-foreground">No class notes available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {classNotes.map((note) => (
                    <div key={note.id} className="p-4 rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 hover:shadow-md transition-all">
                      <h4 className="font-semibold text-teal-900">{note.title}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-teal-600 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                          {note.classes.name}
                        </span>
                        <span className="text-muted-foreground">
                          {new Date(note.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-amber-400 to-orange-500"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-8 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></div>
                Weekly Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              {schedules.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                  <p className="text-muted-foreground">No schedule available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {schedules.map((schedule) => {
                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    return (
                      <div key={schedule.id} className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 hover:shadow-md transition-all">
                        <h4 className="font-semibold text-amber-900">{schedule.subject}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="text-amber-600 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            {days[schedule.day_of_week]}
                          </span>
                          <span className="text-muted-foreground">
                            {schedule.start_time} - {schedule.end_time}
                          </span>
                        </div>
                        <p className="text-xs text-amber-600 mt-1">{schedule.classes.name}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 animate-slide-up" style={{animationDelay: '0.4s'}}>
          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-rose-400 to-pink-500"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-8 bg-gradient-to-b from-rose-400 to-pink-500 rounded-full"></div>
                Attendance Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              {attendance.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                  <p className="text-muted-foreground">No attendance records yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-rose-100">
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold">Class</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendance.map((record) => (
                        <TableRow key={record.id} className="hover:bg-rose-50/50 transition-colors">
                          <TableCell className="font-medium">{new Date(record.date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-muted-foreground">{record.classes?.name || 'N/A'}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                record.status === 'present' ? 'default' : 
                                record.status === 'absent' ? 'destructive' : 
                                record.status === 'late' ? 'secondary' : 
                                'outline'
                              }
                              className="font-semibold"
                            >
                              {record.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-indigo-400 to-blue-500"></div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-8 bg-gradient-to-b from-indigo-400 to-blue-500 rounded-full"></div>
                School Fees
              </CardTitle>
            </CardHeader>
            <CardContent>
              {schoolFees.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                  <p className="text-muted-foreground">No fees available for your class</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-indigo-100">
                        <TableHead className="font-semibold">Class</TableHead>
                        <TableHead className="font-semibold">Term</TableHead>
                        <TableHead className="font-semibold">Academic Year</TableHead>
                        <TableHead className="font-semibold">Amount</TableHead>
                        <TableHead className="font-semibold">Breakdown</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schoolFees.map((fee) => (
                        <TableRow key={fee.id} className="hover:bg-indigo-50/50 transition-colors">
                          <TableCell className="font-medium">{fee.classes?.name}</TableCell>
                          <TableCell className="text-muted-foreground">{fee.term}</TableCell>
                          <TableCell className="text-muted-foreground">{fee.academic_year}</TableCell>
                          <TableCell className="font-bold text-indigo-600">₦{Number(fee.amount).toLocaleString()}</TableCell>
                          <TableCell className="text-sm text-muted-foreground whitespace-pre-line max-w-xs">
                            {fee.description || 'No breakdown available'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-xl overflow-hidden gradient-card animate-scale-in" style={{animationDelay: '0.5s'}}>
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full gradient-student mx-auto mb-4 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2 bg-gradient-student bg-clip-text text-transparent">
              Welcome to Your Student Portal
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your personalized dashboard for accessing academic resources, viewing grades, and staying updated with school activities.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
