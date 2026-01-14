import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Student {
  id: string;
  full_name: string;
  email: string;
}

interface Class {
  id: string;
  name: string;
}

const TeacherStudentsView = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTeacherClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass]);

  const fetchTeacherClasses = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // First try to get classes from class_schedules
    const { data: scheduleData } = await supabase
      .from("class_schedules")
      .select("class_id, classes(id, name)")
      .eq("teacher_id", session.user.id);

    if (scheduleData && scheduleData.length > 0) {
      const uniqueClasses = Array.from(
        new Map(scheduleData.map((item: any) => [item.classes.id, item.classes])).values()
      );
      setClasses(uniqueClasses as Class[]);
    } else {
      // Fallback: get all classes if no schedules exist (for admins or when schedules aren't set)
      const { data: allClasses } = await supabase
        .from("classes")
        .select("id, name")
        .order("name");
      
      if (allClasses) {
        setClasses(allClasses);
      }
    }
  };

  const fetchStudents = async () => {
    setLoading(true);

    // Get students in the selected class
    const { data: studentClasses } = await supabase
      .from("student_classes")
      .select("student_id")
      .eq("class_id", selectedClass);

    if (!studentClasses || studentClasses.length === 0) {
      setStudents([]);
      setLoading(false);
      return;
    }

    const studentIds = studentClasses.map((sc) => sc.student_id);

    // Get student profiles
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", studentIds);

    setStudents(profiles || []);
    setLoading(false);
  };

  const filteredStudents = students.filter(student => 
    student.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          My Students
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedClass && (
              <div>
                <label className="text-sm font-medium mb-2 block">Search Students</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            )}
          </div>

          {selectedClass && (
            <div className="mt-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-3" />
                  <p className="text-muted-foreground">No students enrolled in this class</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="text-sm">
                      {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">Name</TableHead>
                          <TableHead className="font-semibold">Email</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudents.map((student) => (
                          <TableRow key={student.id} className="hover:bg-muted/30">
                            <TableCell className="font-medium">{student.full_name || "N/A"}</TableCell>
                            <TableCell className="text-muted-foreground">{student.email}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherStudentsView;