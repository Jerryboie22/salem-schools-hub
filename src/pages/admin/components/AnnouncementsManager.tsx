import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface Announcement {
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

const AnnouncementsManager = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
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
    const [announcementsResult, classesResult] = await Promise.all([
      supabase
        .from("class_notes")
        .select("*, classes(name)")
        .order("created_at", { ascending: false }),
      supabase.from("classes").select("*").order("name"),
    ]);

    if (announcementsResult.error) {
      toast({
        title: "Error fetching announcements",
        description: announcementsResult.error.message,
        variant: "destructive",
      });
    } else {
      setAnnouncements(announcementsResult.data || []);
    }

    if (classesResult.error) {
      toast({
        title: "Error fetching classes",
        description: classesResult.error.message,
        variant: "destructive",
      });
    } else {
      setClasses(classesResult.data || []);
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { data: { session } } = await supabase.auth.getSession();

    const noteData = {
      title,
      content,
      class_id: classId,
      teacher_id: session?.user.id,
    };

    const { error } = await supabase.from("class_notes").insert(noteData);

    if (error) {
      toast({
        title: "Error creating announcement",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Announcement created successfully for all teachers",
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
        title: "Error deleting announcement",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Announcement deleted successfully",
      });
      fetchData();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Announcement for Teachers</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Announcement Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              placeholder="Announcement Content"
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
              {submitting ? "Creating..." : "Create Announcement"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{announcement.title}</h3>
                  <p className="text-sm text-muted-foreground">{announcement.classes.name}</p>
                  <p className="text-sm mt-2">{announcement.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Created: {new Date(announcement.created_at).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(announcement.id)}
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

export default AnnouncementsManager;
