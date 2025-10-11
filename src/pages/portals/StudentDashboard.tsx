import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogOut, BookOpen, Calendar, FileText, Award } from "lucide-react";

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

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [classNotes, setClassNotes] = useState<ClassNote[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAccess();
  }, []);

  const fetchStudentData = async (studentId: string) => {
    // Fetch assignments for student's classes
    const { data: assignmentsData } = await supabase
      .from("assignments")
      .select(`
        id,
        title,
        description,
        due_date,
        classes (name)
      `)
      .order("due_date", { ascending: true })
      .limit(5);

    if (assignmentsData) setAssignments(assignmentsData as Assignment[]);

    // Fetch grades
    const { data: gradesData } = await supabase
      .from("grades")
      .select("id, subject, score, max_score, term")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false })
      .limit(5);

    if (gradesData) setGrades(gradesData);

    // Fetch class notes
    const { data: notesData } = await supabase
      .from("class_notes")
      .select(`
        id,
        title,
        content,
        created_at,
        classes (name)
      `)
      .order("created_at", { ascending: false })
      .limit(5);

    if (notesData) setClassNotes(notesData as ClassNote[]);

    // Fetch schedule
    const { data: scheduleData } = await supabase
      .from("class_schedules")
      .select(`
        id,
        subject,
        day_of_week,
        start_time,
        end_time,
        classes (name)
      `)
      .order("day_of_week", { ascending: true });

    if (scheduleData) setSchedules(scheduleData as Schedule[]);
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
          <div>
            <h1 className="text-2xl font-bold">Student Dashboard</h1>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          </div>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
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
