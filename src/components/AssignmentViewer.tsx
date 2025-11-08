import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AssignmentViewerProps {
  assignment: {
    id: string;
    title: string;
    description: string;
    file_url: string;
    due_date: string;
  } | null;
  open: boolean;
  onClose: () => void;
}

const AssignmentViewer = ({ assignment, open, onClose }: AssignmentViewerProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  if (!assignment) return null;

  const getFileExtension = (url: string) => {
    return url.split('.').pop()?.toLowerCase() || '';
  };

  const fileExtension = getFileExtension(assignment.file_url);
  const isPdf = fileExtension === 'pdf';
  const isWord = ['doc', 'docx'].includes(fileExtension);
  const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch(assignment.file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${assignment.title}.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: "Assignment downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download assignment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{assignment.title}</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Description:</strong> {assignment.description || "No description provided"}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Due Date:</strong> {new Date(assignment.due_date).toLocaleDateString()}
            </p>
          </div>

          <div className="border rounded-lg p-4 bg-muted/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span className="font-medium">Assignment File</span>
              </div>
              <Button onClick={handleDownload} disabled={loading}>
                <Download className="h-4 w-4 mr-2" />
                {loading ? "Downloading..." : "Download"}
              </Button>
            </div>

            {/* File Preview */}
            <div className="border rounded bg-background p-4 min-h-[400px]">
              {isPdf && (
                <iframe
                  src={assignment.file_url}
                  className="w-full h-[500px] rounded"
                  title="Assignment PDF"
                />
              )}
              
              {isImage && (
                <img
                  src={assignment.file_url}
                  alt={assignment.title}
                  className="w-full h-auto rounded"
                />
              )}
              
              {isWord && (
                <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
                  <FileText className="h-16 w-16 text-muted-foreground" />
                  <p className="text-center text-muted-foreground">
                    Preview not available for Word documents.
                    <br />
                    Please download to view.
                  </p>
                  <Button onClick={handleDownload} disabled={loading}>
                    <Download className="h-4 w-4 mr-2" />
                    Download to View
                  </Button>
                </div>
              )}
              
              {!isPdf && !isWord && !isImage && (
                <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
                  <FileText className="h-16 w-16 text-muted-foreground" />
                  <p className="text-center text-muted-foreground">
                    Preview not available for this file type.
                    <br />
                    Please download to view.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentViewer;
