import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

type SchoolType = 'children' | 'primary' | 'covenant';

interface PrincipalDeskProps {
  schoolType: SchoolType;
}

const PrincipalDesk = ({ schoolType }: PrincipalDeskProps) => {
  const { data: schoolInfo, isLoading } = useQuery({
    queryKey: ['school-info-public', schoolType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('school_info')
        .select('*')
        .eq('school_type', schoolType)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="h-64 bg-muted animate-pulse rounded-lg"></div>;
  }

  if (!schoolInfo) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {schoolInfo.principal_image_url && (
            <div className="lg:col-span-1">
              <img
                src={schoolInfo.principal_image_url}
                alt={schoolInfo.principal_name || 'Principal'}
                className="w-full h-64 lg:h-full object-cover"
              />
            </div>
          )}
          <div className={`p-6 md:p-8 ${schoolInfo.principal_image_url ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <div className="flex items-start gap-4 mb-4">
              <Quote className="text-primary flex-shrink-0 w-8 h-8 md:w-12 md:h-12" />
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-1">
                  {schoolInfo.principal_position || "Principal's Desk"}
                </h3>
                {schoolInfo.principal_name && (
                  <p className="text-base md:text-lg text-muted-foreground">
                    {schoolInfo.principal_name}
                  </p>
                )}
              </div>
            </div>
            {schoolInfo.principal_message && (
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed italic">
                "{schoolInfo.principal_message}"
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrincipalDesk;