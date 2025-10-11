import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface Class {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

const ClassesManager = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .order("name");

    if (error) {
      toast({
        title: "Error fetching classes",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setClasses(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from("classes").insert({
      name,
      description,
    });

    if (error) {
      toast({
        title: "Error creating class",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Class created successfully",
      });
      setName("");
      setDescription("");
      fetchClasses();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("classes").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting class",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Class deleted successfully",
      });
      fetchClasses();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Class</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Class Name (e.g., JSS 2A)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Create Class"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{cls.name}</h3>
                  <p className="text-sm text-muted-foreground">{cls.description}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(cls.id)}
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

export default ClassesManager;
