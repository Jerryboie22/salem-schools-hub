import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface Schedule {
  id: string;
  class_id: string;
  subject: string;
  teacher_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  classes: { name: string };
}

interface Class {
  id: string;
  name: string;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const SchedulesManager = ({ teacherId }: { teacherId: string }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  
  const [formData, setFormData] = useState({
    class_id: "",
    subject: "",
    day_of_week: "1",
    start_time: "08:00",
    end_time: "09:00",
  });
  
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [teacherId]);

  const fetchData = async () => {
    const [classesRes, schedulesRes] = await Promise.all([
      supabase.from("classes").select("*").order("name"),
      supabase
        .from("class_schedules")
        .select("*, classes(name)")
        .eq("teacher_id", teacherId)
        .order("day_of_week")
        .order("start_time"),
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

    if (schedulesRes.error) {
      toast({
        title: "Error fetching schedules",
        description: schedulesRes.error.message,
        variant: "destructive",
      });
    } else {
      setSchedules(schedulesRes.data || []);
    }
    
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const scheduleData = {
      ...formData,
      day_of_week: parseInt(formData.day_of_week),
      teacher_id: teacherId,
    };

    if (editingSchedule) {
      const { error } = await supabase
        .from("class_schedules")
        .update(scheduleData)
        .eq("id", editingSchedule.id);

      if (error) {
        toast({
          title: "Error updating schedule",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Schedule updated successfully",
        });
        setEditingSchedule(null);
        resetForm();
        fetchData();
      }
    } else {
      const { error } = await supabase.from("class_schedules").insert(scheduleData);

      if (error) {
        toast({
          title: "Error creating schedule",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Schedule created successfully",
        });
        resetForm();
        fetchData();
      }
    }
    
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("class_schedules").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting schedule",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Schedule deleted successfully",
      });
      fetchData();
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      class_id: schedule.class_id,
      subject: schedule.subject,
      day_of_week: schedule.day_of_week.toString(),
      start_time: schedule.start_time,
      end_time: schedule.end_time,
    });
  };

  const resetForm = () => {
    setFormData({
      class_id: "",
      subject: "",
      day_of_week: "1",
      start_time: "08:00",
      end_time: "09:00",
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingSchedule ? "Edit Schedule" : "Add to Schedule"}</CardTitle>
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

            <Select
              value={formData.day_of_week}
              onValueChange={(value) => setFormData({ ...formData, day_of_week: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Day" />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map((day, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Time</label>
                <Input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">End Time</label>
                <Input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : editingSchedule ? "Update" : "Add"}
              </Button>
              {editingSchedule && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingSchedule(null);
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
          <CardTitle>My Class Schedules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">
                    {schedule.subject} - {schedule.classes?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {DAYS[schedule.day_of_week]} | {schedule.start_time} - {schedule.end_time}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(schedule)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(schedule.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulesManager;
