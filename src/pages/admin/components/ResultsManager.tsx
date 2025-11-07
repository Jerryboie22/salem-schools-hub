import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Upload, FileText } from "lucide-react";
import { Label } from "@/components/ui/label";

interface Result {
  id: string;
  student_id: string;
  class_id: string;
  term: string;
  academic_year: string;
  file_url: string;
  created_at: string;
  profiles: { full_name: string };
  classes: { name: string };
}

interface Student {
  id: string;
  full_name: string;
  email: string;
}

interface Class {
  id: string;
  name: string;
}

const ResultsManager = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [term, setTerm] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchResults(), fetchStudents(), fetchClasses()]);
    setLoading(false);
  };

  const fetchResults = async () => {
    const { data, error } = await supabase
      .from("student_results")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching results",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Fetch related data
    const resultsWithDetails = await Promise.all(
      (data || []).map(async (result) => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", result.student_id)
          .single();

        const { data: classData } = await supabase
          .from("classes")
          .select("name")
          .eq("id", result.class_id)
          .single();

        return {
          ...result,
          profiles: profile || { full_name: "Unknown" },
          classes: classData || { name: "Unknown" },
        };
      })
    );

    setResults(resultsWithDetails);
  };

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email");

    if (error) {
      console.error("Error fetching students:", error);
    } else {
      setStudents(data || []);
    }
  };

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from("classes")
      .select("id, name")
      .order("name");

    if (error) {
      console.error("Error fetching classes:", error);
    } else {
      setClasses(data || []);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !selectedStudent || !selectedClass || !term || !academicYear) {
      toast({
        title: "Missing information",
        description: "Please fill all fields and select a file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Upload file to storage
      const fileName = `${selectedStudent}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("results")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("results")
        .getPublicUrl(fileName);

      // Save result record
      const { error: insertError } = await supabase
        .from("student_results")
        .insert({
          student_id: selectedStudent,
          class_id: selectedClass,
          term,
          academic_year: academicYear,
          file_url: urlData.publicUrl,
          uploaded_by: session?.user.id,
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Result uploaded successfully",
      });

      // Reset form
      setSelectedStudent("");
      setSelectedClass("");
      setTerm("");
      setAcademicYear("");
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById("result-file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      fetchResults();
    } catch (error: any) {
      toast({
        title: "Error uploading result",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, fileUrl: string) => {
    try {
      // Extract file path from URL
      const filePath = fileUrl.split("/results/")[1];
      
      // Delete from storage
      if (filePath) {
        await supabase.storage.from("results").remove([filePath]);
      }

      // Delete record
      const { error } = await supabase
        .from("student_results")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Result deleted successfully",
      });

      fetchResults();
    } catch (error: any) {
      toast({
        title: "Error deleting result",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Student Result</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="student">Student</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger id="student">
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.full_name} ({student.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="class">
                  <SelectValue placeholder="Select class" />
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="term">Term</Label>
                <Input
                  id="term"
                  placeholder="e.g., First Term"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Academic Year</Label>
                <Input
                  id="year"
                  placeholder="e.g., 2024/2025"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="result-file">Result PDF</Label>
              <Input
                id="result-file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                required
              />
              {file && (
                <p className="text-sm text-muted-foreground">
                  Selected: {file.name}
                </p>
              )}
            </div>

            <Button type="submit" disabled={uploading}>
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? "Uploading..." : "Upload Result"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No results uploaded yet
              </p>
            ) : (
              results.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold">
                        {result.profiles?.full_name || "Unknown Student"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {result.classes?.name || "Unknown Class"} | {result.term} | {result.academic_year}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Uploaded: {new Date(result.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(result.file_url, "_blank")}
                    >
                      View PDF
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(result.id, result.file_url)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsManager;
