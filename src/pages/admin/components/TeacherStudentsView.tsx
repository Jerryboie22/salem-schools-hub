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

    // Get classes taught by this teacher
    const { data } = await supabase
      .from("class_schedules")
      .select("class_id, classes(id, name)")
      .eq("teacher_id", session.user.id);

    if (data) {
      const uniqueClasses = Array.from(
        new Map(data.map((item: any) => [item.classes.id, item.classes])).values()
      );
      setClasses(uniqueClasses as Class[]);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Students</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
            <div className="mt-6">
              {loading ? (
                <p className="text-muted-foreground">Loading students...</p>
              ) : students.length === 0 ? (
                <p className="text-muted-foreground">No students found in this class</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.full_name || "N/A"}</TableCell>
                        <TableCell>{student.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherStudentsView;