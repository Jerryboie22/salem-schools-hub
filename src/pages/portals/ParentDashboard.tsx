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

interface SchoolFee {
  id: string;
  term: string;
  academic_year: string;
  amount: number;
  classes: { name: string };
}

const ParentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [schoolFees, setSchoolFees] = useState<SchoolFee[]>([]);
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

        // Fetch school fees for these classes
        const { data: feesData } = await supabase
          .from("school_fees")
          .select(`id, term, academic_year, amount, classes(name)`)
          .in("class_id", classIds)
          .order("term", { ascending: true });
        if (feesData) setSchoolFees(feesData as SchoolFee[]);
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

    // Check if user has parent or admin role
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .in("role", ["parent", "admin"]);

    if (error || !data || data.length === 0) {
      toast({
        title: "Access Denied",
        description: "You don't have parent or admin access.",
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
      <header className="glass-effect border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-parent bg-clip-text text-transparent">Parent Dashboard</h1>
              <p className="text-sm text-muted-foreground">{userEmail}</p>
            </div>
            <Button onClick={handleSignOut} className="gradient-parent text-white border-0 shadow-lg hover:shadow-xl transition-all">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
              <Card className="stat-card border-0 shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-rose-400 to-pink-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Linked Students</CardTitle>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-md">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">{students.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Children enrolled</p>
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
                  <p className="text-xs text-muted-foreground mt-1">Active assignments</p>
                </CardContent>
              </Card>

              <Card className="stat-card border-0 shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-400 to-purple-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Grades</CardTitle>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-md">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">{grades.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Recent grades</p>
                </CardContent>
              </Card>

              <Card className="stat-card border-0 shadow-lg overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Calendar</CardTitle>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Active</div>
                  <p className="text-xs text-muted-foreground mt-1">School events</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
              <Card className="border-0 shadow-xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-rose-400 to-pink-500"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-8 bg-gradient-to-b from-rose-400 to-pink-500 rounded-full"></div>
                    Child's Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {assignments.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                      <p className="text-muted-foreground">No assignments available</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-rose-100">
                            <TableHead className="font-semibold">Title</TableHead>
                            <TableHead className="font-semibold">Class</TableHead>
                            <TableHead className="font-semibold">Due Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {assignments.map((assignment) => (
                            <TableRow key={assignment.id} className="hover:bg-rose-50/50 transition-colors">
                              <TableCell className="font-medium">{assignment.title}</TableCell>
                              <TableCell className="text-muted-foreground">{assignment.classes.name}</TableCell>
                              <TableCell className="text-muted-foreground">{new Date(assignment.due_date).toLocaleDateString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-violet-400 to-purple-500"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-8 bg-gradient-to-b from-violet-400 to-purple-500 rounded-full"></div>
                    Child's Grades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {grades.length === 0 ? (
                    <div className="text-center py-12">
                      <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                      <p className="text-muted-foreground">No grades available</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-violet-100">
                            <TableHead className="font-semibold">Subject</TableHead>
                            <TableHead className="font-semibold">Score</TableHead>
                            <TableHead className="font-semibold">Term</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {grades.map((grade) => (
                            <TableRow key={grade.id} className="hover:bg-violet-50/50 transition-colors">
                              <TableCell className="font-medium">{grade.subject}</TableCell>
                              <TableCell className="font-bold text-violet-600">{grade.score}/{grade.max_score}</TableCell>
                              <TableCell className="text-muted-foreground">{grade.term}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6 border-0 shadow-xl overflow-hidden animate-slide-up" style={{animationDelay: '0.3s'}}>
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
                    <p className="text-muted-foreground">No fees available for your child's class</p>
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
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {schoolFees.map((fee) => (
                          <TableRow key={fee.id} className="hover:bg-indigo-50/50 transition-colors">
                            <TableCell className="font-medium">{fee.classes?.name}</TableCell>
                            <TableCell className="text-muted-foreground">{fee.term}</TableCell>
                            <TableCell className="text-muted-foreground">{fee.academic_year}</TableCell>
                            <TableCell className="font-bold text-indigo-600">₦{Number(fee.amount).toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
