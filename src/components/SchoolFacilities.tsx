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
      <CardContent className="p-6 md:p-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-6">Our Facilities</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {schoolInfo.facilities.map((facility, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm md:text-base">{facility}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SchoolFacilities;