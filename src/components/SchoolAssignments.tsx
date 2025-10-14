import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Calendar } from "lucide-react";
import { format } from "date-fns";

type SchoolType = 'children' | 'primary' | 'covenant';

interface SchoolAssignmentsProps {
  schoolType: SchoolType;
}

const SchoolAssignments = ({ schoolType }: SchoolAssignmentsProps) => {
  const { data: assignments, isLoading } = useQuery({
    queryKey: ['school-assignments-public', schoolType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('school_type', schoolType)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  const handleDownload = (fileUrl: string, title: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `${title}.docx`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <div className="h-64 bg-muted animate-pulse rounded-lg"></div>;
  }

  if (!assignments || assignments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 md:p-8 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No assignments available at the moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 md:p-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-6">Recent Assignments</h3>
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-base md:text-lg">{assignment.title}</h4>
                    {assignment.subject && (
                      <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                    )}
                    {assignment.due_date && (
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>Due: {format(new Date(assignment.due_date), 'MMM dd, yyyy')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {assignment.file_url && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(assignment.file_url!, assignment.title)}
                  className="w-full sm:w-auto"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SchoolAssignments;