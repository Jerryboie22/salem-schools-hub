import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface Grade {
  id: string;
  subject: string;
  score: number;
  max_score: number;
  term: string;
  student_id: string;
  remarks: string;
}

const GradesManager = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState("");
  const [subject, setSubject] = useState("");
  const [score, setScore] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [term, setTerm] = useState("");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    const { data, error } = await supabase
      .from("grades")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching grades",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setGrades(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { data: { session } } = await supabase.auth.getSession();

    const { error } = await supabase.from("grades").insert({
      student_id: studentId,
      subject,
      score: parseFloat(score),
      max_score: parseFloat(maxScore),
      term,
      remarks,
      teacher_id: session?.user.id,
      class_id: "00000000-0000-0000-0000-000000000000", // Placeholder
    });

    if (error) {
      toast({
        title: "Error creating grade",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Grade created successfully",
      });
      setStudentId("");
      setSubject("");
      setScore("");
      setMaxScore("");
      setTerm("");
      setRemarks("");
      fetchGrades();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("grades").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting grade",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Grade deleted successfully",
      });
      fetchGrades();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Grade</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Student User ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
            <Input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Score"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                required
              />
              <Input
                type="number"
                placeholder="Max Score"
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
                required
              />
            </div>
            <Input
              placeholder="Term (e.g., First Term 2024)"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              required
            />
            <Textarea
              placeholder="Remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Add Grade"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Grades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {grades.map((grade) => (
              <div
                key={grade.id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{grade.subject}</h3>
                  <p className="text-sm text-muted-foreground">
                    Score: {grade.score}/{grade.max_score} | Term: {grade.term}
                  </p>
                  {grade.remarks && (
                    <p className="text-sm mt-1">{grade.remarks}</p>
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(grade.id)}
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

export default GradesManager;
