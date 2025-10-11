import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  description: string;
  due_date: string;
  class_id: string;
  classes: { name: string };
}

interface Class {
  id: string;
  name: string;
}

const AssignmentsManager = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classId, setClassId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [assignmentsRes, classesRes] = await Promise.all([
      supabase
        .from("assignments")
        .select("*, classes(name)")
        .order("due_date", { ascending: false }),
      supabase.from("classes").select("id, name").order("name"),
    ]);

    if (assignmentsRes.error) {
      toast({
        title: "Error fetching assignments",
        description: assignmentsRes.error.message,
        variant: "destructive",
      });
    } else {
      setAssignments(assignmentsRes.data as Assignment[] || []);
    }

    if (!classesRes.error) {
      setClasses(classesRes.data || []);
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { data: { session } } = await supabase.auth.getSession();

    const { error } = await supabase.from("assignments").insert({
      title,
      description,
      class_id: classId,
      due_date: dueDate,
      teacher_id: session?.user.id,
    });

    if (error) {
      toast({
        title: "Error creating assignment",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Assignment created successfully",
      });
      setTitle("");
      setDescription("");
      setClassId("");
      setDueDate("");
      fetchData();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("assignments").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting assignment",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Assignment deleted successfully",
      });
      fetchData();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Assignment Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
            <Input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create Assignment"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{assignment.title}</h3>
                  <p className="text-sm text-muted-foreground">{assignment.description}</p>
                  <p className="text-sm mt-2">
                    Class: {assignment.classes.name} | Due:{" "}
                    {new Date(assignment.due_date).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(assignment.id)}
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

export default AssignmentsManager;
