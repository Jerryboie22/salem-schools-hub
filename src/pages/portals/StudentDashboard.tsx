import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogOut, BookOpen, Calendar, FileText, Award } from "lucide-react";
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
        .select(`id, title, description, due_date, classes (name)`) 
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
        .select(`id, term, academic_year, amount, classes(name)`) 
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
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-bold">{profile.full_name?.[0] || "S"}</span>
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold">{profile.full_name || "Student"}</h1>
                <p className="text-xs text-muted-foreground">{studentClasses.map(sc => sc.classes.name).join(", ") || "No class assigned"}</p>
              </div>
            </div>
          </div>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold">{profile.full_name?.[0] || "S"}</span>
                )}
              </div>
              <div>
                <Label>Profile Picture</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                  className="mt-2"
                />
                {uploading && <p className="text-xs text-muted-foreground mt-1">Uploading...</p>}
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
              <Label>Class</Label>
              <Select 
                value={studentClasses[0]?.class_id || ""} 
                onValueChange={handleClassChange}
              >
                <SelectTrigger>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Academic Calendar</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">View term dates and schedules</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assignments</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Access course materials</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Grades</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Check your results</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Library</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Browse e-books</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              {assignments.length === 0 ? (
                <p className="text-muted-foreground text-sm">No assignments available</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.title}</TableCell>
                        <TableCell>{assignment.classes.name}</TableCell>
                        <TableCell>{new Date(assignment.due_date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Grades</CardTitle>
            </CardHeader>
            <CardContent>
              {grades.length === 0 ? (
                <p className="text-muted-foreground text-sm">No grades available</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Term</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grades.map((grade) => (
                      <TableRow key={grade.id}>
                        <TableCell className="font-medium">{grade.subject}</TableCell>
                        <TableCell>{grade.score}/{grade.max_score}</TableCell>
                        <TableCell>{grade.term || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Class Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {classNotes.length === 0 ? (
                <p className="text-muted-foreground text-sm">No class notes available</p>
              ) : (
                <div className="space-y-4">
                  {classNotes.map((note) => (
                    <div key={note.id} className="border-b pb-3 last:border-0">
                      <h4 className="font-medium">{note.title}</h4>
                      <p className="text-sm text-muted-foreground">{note.classes.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(note.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {schedules.length === 0 ? (
                <p className="text-muted-foreground text-sm">No schedule available</p>
              ) : (
                <div className="space-y-3">
                  {schedules.map((schedule) => {
                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    return (
                      <div key={schedule.id} className="border-b pb-2 last:border-0">
                        <p className="font-medium">{schedule.subject}</p>
                        <p className="text-sm text-muted-foreground">
                          {days[schedule.day_of_week]} • {schedule.start_time} - {schedule.end_time}
                        </p>
                        <p className="text-xs text-muted-foreground">{schedule.classes.name}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>School Fees</CardTitle>
          </CardHeader>
          <CardContent>
            {schoolFees.length === 0 ? (
              <p className="text-muted-foreground text-sm">No fees available for your class</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Academic Year</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schoolFees.map((fee) => (
                    <TableRow key={fee.id}>
                      <TableCell>{fee.classes?.name}</TableCell>
                      <TableCell>{fee.term}</TableCell>
                      <TableCell>{fee.academic_year}</TableCell>
                      <TableCell>{Number(fee.amount).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Welcome to Your Student Portal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your personalized dashboard for accessing academic resources, viewing grades, and staying updated with school activities.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
