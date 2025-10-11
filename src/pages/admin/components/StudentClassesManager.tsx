import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface StudentClass {
  id: string;
  student_id: string;
  class_id: string;
  classes: { name: string };
}

interface Class {
  id: string;
  name: string;
}

const StudentClassesManager = () => {
  const [studentClasses, setStudentClasses] = useState<StudentClass[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState("");
  const [classId, setClassId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [studentClassesRes, classesRes] = await Promise.all([
      supabase
        .from("student_classes")
        .select("*, classes(name)")
        .order("enrolled_at", { ascending: false }),
      supabase.from("classes").select("id, name").order("name"),
    ]);

    if (studentClassesRes.error) {
      toast({
        title: "Error fetching student classes",
        description: studentClassesRes.error.message,
        variant: "destructive",
      });
    } else {
      setStudentClasses(studentClassesRes.data as StudentClass[] || []);
    }

    if (!classesRes.error) {
      setClasses(classesRes.data || []);
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from("student_classes").insert({
      student_id: studentId,
      class_id: classId,
    });

    if (error) {
      toast({
        title: "Error assigning student to class",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Student assigned to class successfully",
      });
      setStudentId("");
      setClassId("");
      fetchData();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("student_classes").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error removing student from class",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Student removed from class successfully",
      });
      fetchData();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assign Student to Class</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Student User ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
            <Select value={classId} onValueChange={setClassId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Assigning..." : "Assign to Class"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student Class Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentClasses.map((sc) => (
              <div
                key={sc.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-semibold">Student ID: {sc.student_id}</p>
                  <p className="text-sm text-muted-foreground">
                    Class: {sc.classes.name}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(sc.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentClassesManager;
