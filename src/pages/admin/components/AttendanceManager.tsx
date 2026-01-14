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
import { CalendarCheck, Users } from "lucide-react";

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
    // First try to get classes from class_schedules
    const { data: scheduleData } = await supabase
      .from("class_schedules")
      .select("class_id, classes(id, name)")
      .eq("teacher_id", teacherId);

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
        description: "Failed to mark attendance: " + error.message,
        variant: "destructive"
      });
    } else {
      toast({ title: "Success", description: "Attendance marked successfully" });
      fetchStudents();
    }
  };

  const markAllPresent = async () => {
    const promises = students.map(student => 
      supabase
        .from("attendance")
        .upsert({
          student_id: student.id,
          class_id: selectedClass,
          teacher_id: teacherId,
          date: date.toISOString().split('T')[0],
          status: 'present'
        }, {
          onConflict: 'student_id,class_id,date'
        })
    );

    await Promise.all(promises);
    toast({ title: "Success", description: "All students marked present" });
    fetchStudents();
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="outline" className="text-gray-500">Not Marked</Badge>;
    
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
      present: "default",
      absent: "destructive",
      late: "secondary",
      excused: "outline"
    };

    const colors: Record<string, string> = {
      present: "bg-green-500 hover:bg-green-600",
      absent: "",
      late: "bg-amber-500 hover:bg-amber-600",
      excused: "border-blue-500 text-blue-600"
    };

    return (
      <Badge 
        variant={variants[status] || "outline"} 
        className={colors[status] || ""}
      >
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-purple-600" />
            Attendance Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
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
              {classes.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No classes available. Please contact admin to assign classes.
                </p>
              )}
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
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="text-base">
                Students - {date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </CardTitle>
              {students.length > 0 && (
                <Button size="sm" variant="outline" onClick={markAllPresent}>
                  Mark All Present
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead className="hidden sm:table-cell">Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.full_name || "N/A"}</TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">{student.email}</TableCell>
                        <TableCell>{getStatusBadge(student.attendance_status)}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            <Button
                              size="sm"
                              variant={student.attendance_status === 'present' ? 'default' : 'outline'}
                              className={student.attendance_status === 'present' ? 'bg-green-500 hover:bg-green-600' : ''}
                              onClick={() => markAttendance(student.id, 'present')}
                            >
                              P
                            </Button>
                            <Button
                              size="sm"
                              variant={student.attendance_status === 'absent' ? 'destructive' : 'outline'}
                              onClick={() => markAttendance(student.id, 'absent')}
                            >
                              A
                            </Button>
                            <Button
                              size="sm"
                              variant={student.attendance_status === 'late' ? 'secondary' : 'outline'}
                              className={student.attendance_status === 'late' ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}
                              onClick={() => markAttendance(student.id, 'late')}
                            >
                              L
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className={student.attendance_status === 'excused' ? 'border-blue-500 text-blue-600' : ''}
                              onClick={() => markAttendance(student.id, 'excused')}
                            >
                              E
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AttendanceManager;