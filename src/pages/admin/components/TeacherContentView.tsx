import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp, FileDown, Calendar, FileText, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  due_date: string;
  file_url: string;
  classes: { name: string };
}

interface LessonPlan {
  id: string;
  subject: string;
  topic: string;
  objectives: string;
  content: string;
  date: string;
  classes: { name: string };
}

interface Schedule {
  id: string;
  subject: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  classes: { name: string };
}

const TeacherContentView = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAssignments, setExpandedAssignments] = useState(false);
  const [expandedLessonPlans, setExpandedLessonPlans] = useState(false);
  const [expandedSchedules, setExpandedSchedules] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTeacherContent();
  }, []);

  const fetchTeacherContent = async () => {
    const [assignmentsResult, lessonPlansResult, schedulesResult] = await Promise.all([
      supabase
        .from("assignments")
        .select("*, classes(name)")
        .order("due_date", { ascending: false }),
      supabase
        .from("lesson_plans")
        .select("*, classes(name)")
        .order("date", { ascending: false }),
      supabase
        .from("class_schedules")
        .select("*, classes(name)")
        .order("day_of_week", { ascending: true }),
    ]);

    if (assignmentsResult.error) {
      toast({
        title: "Error",
        description: "Failed to load assignments",
        variant: "destructive",
      });
    } else {
      setAssignments(assignmentsResult.data || []);
    }

    if (lessonPlansResult.error) {
      toast({
        title: "Error",
        description: "Failed to load lesson plans",
        variant: "destructive",
      });
    } else {
      setLessonPlans(lessonPlansResult.data || []);
    }

    if (schedulesResult.error) {
      toast({
        title: "Error",
        description: "Failed to load schedules",
        variant: "destructive",
      });
    } else {
      setSchedules(schedulesResult.data || []);
    }

    setLoading(false);
  };

  const getDayName = (day: number) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[day];
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Assignments Section */}
      <Card>
        <CardHeader
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => setExpandedAssignments(!expandedAssignments)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              All Teacher Assignments ({assignments.length})
            </CardTitle>
            {expandedAssignments ? <ChevronUp /> : <ChevronDown />}
          </div>
        </CardHeader>
        {expandedAssignments && (
          <CardContent className="space-y-4">
            {assignments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No assignments found</p>
            ) : (
              assignments.map((assignment) => (
                <div key={assignment.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{assignment.title}</h3>
                    </div>
                    {assignment.file_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(assignment.file_url, "_blank")}
                      >
                        <FileDown className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{assignment.classes.name}</Badge>
                    <Badge variant="outline">{assignment.subject}</Badge>
                    <Badge variant="outline">
                      Due: {new Date(assignment.due_date).toLocaleDateString()}
                    </Badge>
                  </div>
                  <p className="text-sm">{assignment.description}</p>
                </div>
              ))
            )}
          </CardContent>
        )}
      </Card>

      {/* Lesson Plans Section */}
      <Card>
        <CardHeader
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => setExpandedLessonPlans(!expandedLessonPlans)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              All Teacher Lesson Plans ({lessonPlans.length})
            </CardTitle>
            {expandedLessonPlans ? <ChevronUp /> : <ChevronDown />}
          </div>
        </CardHeader>
        {expandedLessonPlans && (
          <CardContent className="space-y-4">
            {lessonPlans.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No lesson plans found</p>
            ) : (
              lessonPlans.map((plan) => (
                <div key={plan.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{plan.topic}</h3>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{plan.classes.name}</Badge>
                    <Badge variant="outline">{plan.subject}</Badge>
                    <Badge variant="outline">
                      {new Date(plan.date).toLocaleDateString()}
                    </Badge>
                  </div>
                  {plan.objectives && (
                    <div>
                      <p className="text-sm font-semibold">Objectives:</p>
                      <p className="text-sm text-muted-foreground">{plan.objectives}</p>
                    </div>
                  )}
                  {plan.content && (
                    <div>
                      <p className="text-sm font-semibold">Content:</p>
                      <p className="text-sm text-muted-foreground">{plan.content}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        )}
      </Card>

      {/* Schedules Section */}
      <Card>
        <CardHeader
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => setExpandedSchedules(!expandedSchedules)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              All Teacher Schedules ({schedules.length})
            </CardTitle>
            {expandedSchedules ? <ChevronUp /> : <ChevronDown />}
          </div>
        </CardHeader>
        {expandedSchedules && (
          <CardContent className="space-y-4">
            {schedules.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No schedules found</p>
            ) : (
              schedules.map((schedule) => (
                <div key={schedule.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{schedule.subject}</h3>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{schedule.classes.name}</Badge>
                    <Badge variant="outline">{getDayName(schedule.day_of_week)}</Badge>
                    <Badge variant="outline">
                      {schedule.start_time} - {schedule.end_time}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default TeacherContentView;
