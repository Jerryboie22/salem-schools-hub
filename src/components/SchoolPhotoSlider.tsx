import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";

type SchoolType = 'children' | 'primary' | 'covenant';

interface SchoolPhotoSliderProps {
  schoolType: SchoolType;
}

const SchoolPhotoSlider = ({ schoolType }: SchoolPhotoSliderProps) => {
  const { data: photos, isLoading } = useQuery({
    queryKey: ['school-photos-public', schoolType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('school_photos')
        .select('*')
        .eq('school_type', schoolType)
        .eq('is_active', true)
        .order('order_index');
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="h-64 md:h-96 bg-muted animate-pulse rounded-lg"></div>;
  }

  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <div className="w-full px-4 md:px-12">
      <Carousel className="w-full">
        <CarouselContent>
          {photos.map((photo) => (
            <CarouselItem key={photo.id}>
              <Card className="overflow-hidden">
                <div className="relative h-64 md:h-96 lg:h-[500px]">
                  <img
                    src={photo.image_url}
                    alt={photo.title || 'School photo'}
                    className="w-full h-full object-cover"
                  />
                  {(photo.title || photo.description) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6 text-white">
                      {photo.title && (
                        <h3 className="text-lg md:text-2xl font-bold mb-1">{photo.title}</h3>
                      )}
                      {photo.description && (
                        <p className="text-sm md:text-base opacity-90">{photo.description}</p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
};

export default SchoolPhotoSlider;