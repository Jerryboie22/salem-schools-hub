import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Upload, FileText, FileSpreadsheet, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Papa from "papaparse";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Result {
  id: string;
  student_id: string;
  class_id: string;
  term: string;
  academic_year: string;
  file_url: string;
  created_at: string;
  feedback?: string;
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

interface BulkUploadRow {
  student_email: string;
  class_name: string;
  term: string;
  academic_year: string;
  pdf_filename: string;
  feedback?: string;
  status?: 'pending' | 'success' | 'error';
  error?: string;
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
  const [feedback, setFeedback] = useState("");
  
  // Bulk upload states
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [pdfFiles, setPdfFiles] = useState<FileList | null>(null);
  const [bulkData, setBulkData] = useState<BulkUploadRow[]>([]);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  
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
          feedback: feedback || null,
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
      setFeedback("");
      
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

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setCsvFile(file);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as BulkUploadRow[];
        
        // Validate CSV structure (feedback is optional)
        const requiredFields = ['student_email', 'class_name', 'term', 'academic_year', 'pdf_filename'];
        const firstRow = data[0];
        const missingFields = requiredFields.filter(field => !(field in firstRow));
        
        if (missingFields.length > 0) {
          toast({
            title: "Invalid CSV format",
            description: `Missing required columns: ${missingFields.join(', ')}`,
            variant: "destructive",
          });
          return;
        }

        setBulkData(data.map(row => ({ ...row, status: 'pending' })));
        setShowPreview(true);
        
        toast({
          title: "CSV loaded",
          description: `Found ${data.length} records`,
        });
      },
      error: (error) => {
        toast({
          title: "Error parsing CSV",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const handlePdfFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setPdfFiles(files);
    
    toast({
      title: "PDF files selected",
      description: `${files.length} PDF files ready to upload`,
    });
  };

  const handleBulkUpload = async () => {
    if (!csvFile || !pdfFiles || bulkData.length === 0) {
      toast({
        title: "Missing files",
        description: "Please upload both CSV and PDF files",
        variant: "destructive",
      });
      return;
    }

    setBulkUploading(true);
    setUploadProgress(0);

    const { data: { session } } = await supabase.auth.getSession();
    let successCount = 0;
    let errorCount = 0;

    // Create a map of PDF files by filename
    const pdfMap = new Map<string, File>();
    Array.from(pdfFiles).forEach(file => {
      pdfMap.set(file.name, file);
    });

    // Process each row
    for (let i = 0; i < bulkData.length; i++) {
      const row = bulkData[i];
      
      try {
        // Find student by email
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", row.student_email)
          .maybeSingle();

        if (profileError || !profileData) {
          throw new Error(`Student not found: ${row.student_email}`);
        }

        // Find class by name
        const { data: classData, error: classError } = await supabase
          .from("classes")
          .select("id")
          .eq("name", row.class_name)
          .maybeSingle();

        if (classError || !classData) {
          throw new Error(`Class not found: ${row.class_name}`);
        }

        // Find corresponding PDF file
        const pdfFile = pdfMap.get(row.pdf_filename);
        if (!pdfFile) {
          throw new Error(`PDF file not found: ${row.pdf_filename}`);
        }

        // Upload PDF to storage
        const fileName = `${profileData.id}/${Date.now()}_${pdfFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("results")
          .upload(fileName, pdfFile);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("results")
          .getPublicUrl(fileName);

        // Save result record
        const { error: insertError } = await supabase
          .from("student_results")
          .insert({
            student_id: profileData.id,
            class_id: classData.id,
            term: row.term,
            academic_year: row.academic_year,
            file_url: urlData.publicUrl,
            uploaded_by: session?.user.id,
            feedback: row.feedback || null,
          });

        if (insertError) throw insertError;

        // Update status
        bulkData[i].status = 'success';
        successCount++;
      } catch (error: any) {
        bulkData[i].status = 'error';
        bulkData[i].error = error.message;
        errorCount++;
      }

      // Update progress
      setUploadProgress(Math.round(((i + 1) / bulkData.length) * 100));
      setBulkData([...bulkData]); // Trigger re-render
    }

    setBulkUploading(false);

    toast({
      title: "Bulk upload complete",
      description: `Successfully uploaded ${successCount} results. ${errorCount} errors.`,
      variant: errorCount > 0 ? "destructive" : "default",
    });

    if (successCount > 0) {
      fetchResults();
    }
  };

  const downloadSampleCsv = () => {
    const sampleData = `student_email,class_name,term,academic_year,pdf_filename,feedback
john.doe@example.com,JSS1,First Term,2024/2025,john_doe_result.pdf,Excellent performance
jane.smith@example.com,JSS2,First Term,2024/2025,jane_smith_result.pdf,Good work keep it up`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_results_upload.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="single">Single Upload</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="single">
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

            <div className="space-y-2">
              <Label htmlFor="feedback">Teacher Comments/Feedback (Optional)</Label>
              <Textarea
                id="feedback"
                placeholder="Enter your comments or feedback about the student's performance..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <Button type="submit" disabled={uploading}>
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? "Uploading..." : "Upload Result"}
            </Button>
          </form>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Upload Student Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <FileSpreadsheet className="h-4 w-4" />
                <AlertDescription>
                  Upload a CSV file with student information and multiple PDF files. The CSV must contain columns: 
                  <strong> student_email, class_name, term, academic_year, pdf_filename</strong> (required), 
                  <strong> feedback</strong> (optional)
                  <Button
                    variant="link"
                    size="sm"
                    onClick={downloadSampleCsv}
                    className="ml-2 p-0 h-auto"
                  >
                    Download Sample CSV
                  </Button>
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="csv-file">Upload CSV File</Label>
                  <Input
                    id="csv-file"
                    type="file"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    disabled={bulkUploading}
                  />
                  {csvFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {csvFile.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pdf-files">Upload PDF Files (Multiple)</Label>
                  <Input
                    id="pdf-files"
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handlePdfFilesUpload}
                    disabled={bulkUploading}
                  />
                  {pdfFiles && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {pdfFiles.length} PDF files
                    </p>
                  )}
                </div>

                {showPreview && bulkData.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Preview ({bulkData.length} records)</h3>
                      <Button
                        onClick={handleBulkUpload}
                        disabled={bulkUploading || !pdfFiles}
                      >
                        {bulkUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Start Upload
                          </>
                        )}
                      </Button>
                    </div>

                    {bulkUploading && (
                      <div className="space-y-2">
                        <Progress value={uploadProgress} className="w-full" />
                        <p className="text-sm text-center text-muted-foreground">
                          {uploadProgress}% complete
                        </p>
                      </div>
                    )}

                    <div className="border rounded-lg max-h-[400px] overflow-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-muted sticky top-0">
                          <tr>
                            <th className="text-left p-2">Status</th>
                            <th className="text-left p-2">Student Email</th>
                            <th className="text-left p-2">Class</th>
                            <th className="text-left p-2">Term</th>
                            <th className="text-left p-2">Year</th>
                            <th className="text-left p-2">PDF File</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bulkData.map((row, index) => (
                            <tr key={index} className="border-t">
                              <td className="p-2">
                                {row.status === 'success' && (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                                {row.status === 'error' && (
                                  <XCircle className="w-4 h-4 text-red-500" />
                                )}
                                {row.status === 'pending' && (
                                  <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                                )}
                              </td>
                              <td className="p-2">{row.student_email}</td>
                              <td className="p-2">{row.class_name}</td>
                              <td className="p-2">{row.term}</td>
                              <td className="p-2">{row.academic_year}</td>
                              <td className="p-2">
                                {row.pdf_filename}
                                {row.error && (
                                  <p className="text-xs text-red-500 mt-1">{row.error}</p>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
