import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

type SchoolType = 'children' | 'primary' | 'covenant';

interface SchoolFacilitiesProps {
  schoolType: SchoolType;
}

const SchoolFacilities = ({ schoolType }: SchoolFacilitiesProps) => {
  const { data: schoolInfo, isLoading } = useQuery({
    queryKey: ['school-facilities', schoolType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('school_info')
        .select('facilities')
        .eq('school_type', schoolType)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="h-48 bg-muted animate-pulse rounded-lg"></div>;
  }

  if (!schoolInfo?.facilities || schoolInfo.facilities.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <h3 className="text-xl md:text-2xl font-bold mb-4">Our Facilities</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {schoolInfo.facilities.map((facility, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <span className="text-xs md:text-sm">{facility}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SchoolFacilities;