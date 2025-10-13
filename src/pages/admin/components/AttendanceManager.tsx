import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Student {
  id: string;
  full_name: string;
  email: string;
  attendance_status?: string;
}

interface Class {
  id: string;
  name: string;
}

const AttendanceManager = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(false);
  const [teacherId, setTeacherId] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchTeacherInfo();
  }, []);

  useEffect(() => {
    if (selectedClass && date) {
      fetchStudents();
    }
  }, [selectedClass, date]);

  const fetchTeacherInfo = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setTeacherId(session.user.id);
      fetchClasses(session.user.id);
    }
  };

  const fetchClasses = async (teacherId: string) => {
    // Get classes taught by this teacher (from class_schedules)
    const { data } = await supabase
      .from("class_schedules")
      .select("class_id, classes(id, name)")
      .eq("teacher_id", teacherId);

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

    // Get attendance for selected date
    const { data: attendance } = await supabase
      .from("attendance")
      .select("student_id, status")
      .eq("class_id", selectedClass)
      .eq("date", date.toISOString().split('T')[0]);

    const attendanceMap = new Map(attendance?.map(a => [a.student_id, a.status]) || []);

    const studentsWithAttendance = profiles?.map(p => ({
      ...p,
      attendance_status: attendanceMap.get(p.id)
    })) || [];

    setStudents(studentsWithAttendance as Student[]);
    setLoading(false);
  };

  const markAttendance = async (studentId: string, status: string) => {
    const { error } = await supabase
      .from("attendance")
      .upsert({
        student_id: studentId,
        class_id: selectedClass,
        teacher_id: teacherId,
        date: date.toISOString().split('T')[0],
        status
      }, {
        onConflict: 'student_id,class_id,date'
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to mark attendance",
        variant: "destructive"
      });
    } else {
      toast({ title: "Success", description: "Attendance marked successfully" });
      fetchStudents();
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="outline">Not Marked</Badge>;
    
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      present: "default",
      absent: "destructive",
      late: "secondary",
      excused: "outline"
    };

    return <Badge variant={variants[status] || "outline"}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Attendance Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
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
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Select Date</label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="rounded-md border"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedClass && (
        <Card>
          <CardHeader>
            <CardTitle>Students - {date.toLocaleDateString()}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading students...</p>
            ) : students.length === 0 ? (
              <p className="text-muted-foreground">No students found in this class</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.full_name || "N/A"}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{getStatusBadge(student.attendance_status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={student.attendance_status === 'present' ? 'default' : 'outline'}
                            onClick={() => markAttendance(student.id, 'present')}
                          >
                            Present
                          </Button>
                          <Button
                            size="sm"
                            variant={student.attendance_status === 'absent' ? 'destructive' : 'outline'}
                            onClick={() => markAttendance(student.id, 'absent')}
                          >
                            Absent
                          </Button>
                          <Button
                            size="sm"
                            variant={student.attendance_status === 'late' ? 'secondary' : 'outline'}
                            onClick={() => markAttendance(student.id, 'late')}
                          >
                            Late
                          </Button>
                          <Button
                            size="sm"
                            variant={student.attendance_status === 'excused' ? 'outline' : 'outline'}
                            onClick={() => markAttendance(student.id, 'excused')}
                          >
                            Excused
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AttendanceManager;