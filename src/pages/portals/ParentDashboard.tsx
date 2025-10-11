import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Users, FileText, GraduationCap, Calendar } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Student {
  student_id: string;
}

interface Assignment {
  id: string;
  title: string;
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

const ParentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAccess();
  }, []);

  const fetchParentData = async (parentId: string) => {
    // Fetch linked students
    const { data: studentsData } = await supabase
      .from("parent_students")
      .select("student_id")
      .eq("parent_id", parentId);

    if (studentsData && studentsData.length > 0) {
      setStudents(studentsData);
      const studentIds = studentsData.map((s) => s.student_id);

      // Fetch assignments for students' classes
      const { data: studentClassesData } = await supabase
        .from("student_classes")
        .select("class_id")
        .in("student_id", studentIds);

      if (studentClassesData) {
        const classIds = studentClassesData.map((sc) => sc.class_id);
        const { data: assignmentsData } = await supabase
          .from("assignments")
          .select(`
            id,
            title,
            due_date,
            classes (name)
          `)
          .in("class_id", classIds)
          .order("due_date", { ascending: true })
          .limit(10);

        if (assignmentsData) setAssignments(assignmentsData as Assignment[]);
      }

      // Fetch grades for students
      const { data: gradesData } = await supabase
        .from("grades")
        .select("id, subject, score, max_score, term")
        .in("student_id", studentIds)
        .order("created_at", { ascending: false })
        .limit(10);

      if (gradesData) setGrades(gradesData);
    }
  };

  const checkAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/portal/parent");
      return;
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "parent")
      .maybeSingle();

    if (error || !data) {
      toast({
        title: "Access Denied",
        description: "You don't have parent access.",
        variant: "destructive",
      });
      navigate("/portal/parent");
      return;
    }

    setUserEmail(session.user.email || "");
    await fetchParentData(session.user.id);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/portal/parent");
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
            <h1 className="text-2xl font-bold">Parent Dashboard</h1>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          </div>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {students.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Students Linked</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You haven't linked any students to your account yet. Please contact the school administrator to link your child's account.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Linked Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{students.length}</div>
                  <p className="text-xs text-muted-foreground">Children enrolled</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Assignments</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{assignments.length}</div>
                  <p className="text-xs text-muted-foreground">Active assignments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Grades</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{grades.length}</div>
                  <p className="text-xs text-muted-foreground">Recent grades</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Calendar</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">School events</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Child's Assignments</CardTitle>
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
                  <CardTitle>Child's Grades</CardTitle>
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
                            <TableCell>{grade.term}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
