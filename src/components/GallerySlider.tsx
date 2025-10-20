import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogClose } from "./ui/dialog";
import { Skeleton } from "./ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface GalleryImage {
  id: string;
  image_url: string;
  title: string;
  description: string;
}

const GallerySlider = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [dialogApi, setDialogApi] = useState<CarouselApi>();

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });

      if (error) {
        console.error("Error fetching gallery images:", error);
        return;
      }

      setImages(data || []);
    } finally {
      setLoading(false);
    }
  };

  // Auto-slide main carousel every 3 seconds
  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [api]);

  // Set initial slide when dialog opens
  useEffect(() => {
    if (dialogApi && selectedIndex !== null) {
      dialogApi.scrollTo(selectedIndex);
    }
  }, [dialogApi, selectedIndex]);

  if (!loading && images.length === 0) return null;

  return (
    <section className="py-6 md:py-10 bg-gradient-to-br from-[#f9f7f3] via-[#fdfcf8] to-[#f3efe9]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3 text-[#1e2a3a]">
            Photo Gallery
          </h2>
          <p className="text-sm md:text-base text-[#3b4a5a] max-w-2xl mx-auto">
            Moments of excellence and achievement
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-7xl mx-auto">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            setApi={setApi}
            className="w-full max-w-7xl mx-auto"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {images.map((image, index) => (
                <CarouselItem
                  key={image.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/4"
                >
                  <div
                    onClick={() => setSelectedIndex(index)}
                    className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer bg-gradient-to-t from-[#f5e8c7] via-[#fefdf7] to-[#ffffff]"
                  >
                    <img
                      src={image.image_url}
                      alt={image.title || "Gallery image"}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {image.title && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1e2a3a]/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h3 className="text-white text-sm md:text-base font-semibold">
                          {image.title}
                        </h3>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 bg-[#1e2a3a]/70 hover:bg-[#1e2a3a]/90 text-white" />
            <CarouselNext className="hidden md:flex -right-12 bg-[#1e2a3a]/70 hover:bg-[#1e2a3a]/90 text-white" />
          </Carousel>
        )}

        {!loading && images.length > 0 && (
          <div className="text-center mt-6 md:mt-8">
            <Button
              onClick={() => navigate("/gallery")}
              size="lg"
              className="bg-[#1e2a3a] hover:bg-[#25364a] text-white font-semibold"
            >
              View Full Gallery
            </Button>
          </div>
        )}
      </div>

      {/* Dialog (Popup Slider) */}
      <Dialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
        <DialogContent className="max-w-3xl w-full p-0 rounded-2xl bg-gradient-to-br from-[#fefdf8] via-[#faf6ec] to-[#e3e0d9] border-0 shadow-2xl">
          <DialogClose className="absolute right-4 top-4 z-50 rounded-full bg-[#1e2a3a]/10 p-2 hover:bg-[#1e2a3a]/20 transition-colors">
            <X className="h-6 w-6 text-[#1e2a3a]" />
          </DialogClose>

          {selectedIndex !== null && (
            <Carousel 
              opts={{ 
                align: "center", 
                loop: true,
                startIndex: selectedIndex
              }}
              setApi={setDialogApi}
              className="w-full"
            >
              <CarouselContent>
                {images.map((image, idx) => (
                  <CarouselItem key={image.id} className="flex justify-center">
                    <div className="relative w-full h-[80vh] flex items-center justify-center p-4">
                      <img
                        src={image.image_url}
                        alt={image.title || "Gallery image"}
                        className="max-w-full max-h-full object-contain rounded-xl shadow-lg"
                      />
                      {(image.title || image.description) && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1e2a3a]/90 to-transparent p-4 text-center rounded-b-xl">
                          {image.title && (
                            <h3 className="text-white text-xl font-semibold">
                              {image.title}
                            </h3>
                          )}
                          {image.description && (
                            <p className="text-white/90 mt-2">
                              {image.description}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 bg-[#1e2a3a]/70 hover:bg-[#1e2a3a]/90 text-white" />
              <CarouselNext className="absolute right-4 bg-[#1e2a3a]/70 hover:bg-[#1e2a3a]/90 text-white" />
            </Carousel>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GallerySlider;
