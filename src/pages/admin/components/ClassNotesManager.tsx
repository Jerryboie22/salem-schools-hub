import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface ClassNote {
  id: string;
  title: string;
  content: string;
  class_id: string;
  classes: { name: string };
  created_at: string;
}

interface Class {
  id: string;
  name: string;
}

const ClassNotesManager = () => {
  const [classNotes, setClassNotes] = useState<ClassNote[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [classId, setClassId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [notesRes, classesRes] = await Promise.all([
      supabase
        .from("class_notes")
        .select("*, classes(name)")
        .order("created_at", { ascending: false }),
      supabase.from("classes").select("id, name").order("name"),
    ]);

    if (notesRes.error) {
      toast({
        title: "Error fetching class notes",
        description: notesRes.error.message,
        variant: "destructive",
      });
    } else {
      setClassNotes(notesRes.data as ClassNote[] || []);
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

    const { error } = await supabase.from("class_notes").insert({
      title,
      content,
      class_id: classId,
      teacher_id: session?.user.id,
    });

    if (error) {
      toast({
        title: "Error creating class note",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Class note created successfully",
      });
      setTitle("");
      setContent("");
      setClassId("");
      fetchData();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("class_notes").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting class note",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Class note deleted successfully",
      });
      fetchData();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Class Note</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Note Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
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
              {submitting ? "Creating..." : "Create Class Note"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Class Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {classNotes.map((note) => (
              <div
                key={note.id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{note.title}</h3>
                  <p className="text-sm text-muted-foreground">{note.content}</p>
                  <p className="text-sm mt-2">
                    Class: {note.classes.name}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(note.id)}
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

export default ClassNotesManager;
