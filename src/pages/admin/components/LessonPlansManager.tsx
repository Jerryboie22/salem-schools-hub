import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface LessonPlan {
  id: string;
  teacher_id: string;
  class_id: string;
  subject: string;
  topic: string;
  objectives: string;
  content: string;
  date: string;
  classes: { name: string };
}

interface Class {
  id: string;
  name: string;
}

const LessonPlansManager = ({ teacherId }: { teacherId: string }) => {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null);
  
  const [formData, setFormData] = useState({
    class_id: "",
    subject: "",
    topic: "",
    objectives: "",
    content: "",
    date: new Date().toISOString().split('T')[0],
  });
  
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [teacherId]);

  const fetchData = async () => {
    const [classesRes, plansRes] = await Promise.all([
      supabase.from("classes").select("*").order("name"),
      supabase
        .from("lesson_plans")
        .select("*, classes(name)")
        .eq("teacher_id", teacherId)
        .order("date", { ascending: false }),
    ]);

    if (classesRes.error) {
      toast({
        title: "Error fetching classes",
        description: classesRes.error.message,
        variant: "destructive",
      });
    } else {
      setClasses(classesRes.data || []);
    }

    if (plansRes.error) {
      toast({
        title: "Error fetching lesson plans",
        description: plansRes.error.message,
        variant: "destructive",
      });
    } else {
      setLessonPlans(plansRes.data || []);
    }
    
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (editingPlan) {
      const { error } = await supabase
        .from("lesson_plans")
        .update(formData)
        .eq("id", editingPlan.id);

      if (error) {
        toast({
          title: "Error updating lesson plan",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Lesson plan updated successfully",
        });
        setEditingPlan(null);
        resetForm();
        fetchData();
      }
    } else {
      const { error } = await supabase.from("lesson_plans").insert({
        ...formData,
        teacher_id: teacherId,
      });

      if (error) {
        toast({
          title: "Error creating lesson plan",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Lesson plan created successfully",
        });
        resetForm();
        fetchData();
      }
    }
    
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("lesson_plans").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting lesson plan",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Lesson plan deleted successfully",
      });
      fetchData();
    }
  };

  const handleEdit = (plan: LessonPlan) => {
    setEditingPlan(plan);
    setFormData({
      class_id: plan.class_id,
      subject: plan.subject,
      topic: plan.topic,
      objectives: plan.objectives,
      content: plan.content,
      date: plan.date,
    });
  };

  const resetForm = () => {
    setFormData({
      class_id: "",
      subject: "",
      topic: "",
      objectives: "",
      content: "",
      date: new Date().toISOString().split('T')[0],
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingPlan ? "Edit Lesson Plan" : "Create Lesson Plan"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              value={formData.class_id}
              onValueChange={(value) => setFormData({ ...formData, class_id: value })}
              required
            >
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
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />

            <Input
              placeholder="Topic"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              required
            />

            <Textarea
              placeholder="Learning Objectives"
              value={formData.objectives}
              onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
            />

            <Textarea
              placeholder="Lesson Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
            />

            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />

            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : editingPlan ? "Update" : "Create"}
              </Button>
              {editingPlan && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingPlan(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Lesson Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lessonPlans.map((plan) => (
              <div key={plan.id} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{plan.topic}</h3>
                    <p className="text-sm text-muted-foreground">
                      {plan.subject} - {plan.classes?.name} - {new Date(plan.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(plan)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(plan.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {plan.objectives && (
                  <div>
                    <p className="text-sm font-medium">Objectives:</p>
                    <p className="text-sm text-muted-foreground">{plan.objectives}</p>
                  </div>
                )}
                {plan.content && (
                  <div>
                    <p className="text-sm font-medium">Content:</p>
                    <p className="text-sm text-muted-foreground">{plan.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonPlansManager;
