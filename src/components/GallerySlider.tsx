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

  // Handle next/previous in fullscreen
  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! + 1) % images.length);
  };

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! - 1 + images.length) % images.length);
  };

  // Autoplay carousel (every 3 seconds)
  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setSelectedIndex((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % images.length;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

  if (!loading && images.length === 0) return null;

  return (
    <section className="py-6 md:py-10 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3">Photo Gallery</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Moments of excellence and achievement
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-4xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-video rounded-lg" />
            ))}
          </div>
        ) : (
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {images.map((image, index) => (
                <CarouselItem key={image.id} className="pl-2 md:pl-4 basis-full">
                  <div
                    onClick={() => setSelectedIndex(index)}
                    className="relative aspect-video rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  >
                    <img
                      src={image.image_url}
                      alt={image.title || "Gallery image"}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {image.title && (
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="text-white text-base md:text-lg font-semibold">
                            {image.title}
                          </h3>
                        </div>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>
        )}

        {!loading && images.length > 0 && (
          <div className="text-center mt-6 md:mt-8">
            <Button onClick={() => navigate("/gallery")} size="lg" className="touch-target">
              View Full Gallery
            </Button>
          </div>
        )}
      </div>

      {/* Fullscreen Viewer */}
      <Dialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
        <DialogContent className="max-w-5xl w-full p-0 bg-white border-0 relative rounded-lg shadow-2xl overflow-hidden">
          <DialogClose className="absolute right-3 top-3 z-50 rounded-full bg-black/10 p-2 hover:bg-black/20 transition-colors">
            <X className="h-5 w-5 text-black" />
          </DialogClose>

          {selectedIndex !== null && (
            <div className="relative w-full flex flex-col items-center justify-center p-4">
              <div className="relative w-full flex items-center justify-center">
                <button
                  onClick={handlePrev}
                  className="absolute left-2 md:left-4 text-black bg-white/70 hover:bg-white/90 rounded-full p-2 z-50 shadow-md"
                >
                  ‹
                </button>

                <img
                  src={images[selectedIndex].image_url}
                  alt={images[selectedIndex].title || "Gallery image"}
                  className="max-w-full max-h-[80vh] object-contain rounded-md transition-all duration-500"
                />

                <button
                  onClick={handleNext}
                  className="absolute right-2 md:right-4 text-black bg-white/70 hover:bg-white/90 rounded-full p-2 z-50 shadow-md"
                >
                  ›
                </button>
              </div>

              {images[selectedIndex].title && (
                <div className="mt-3 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {images[selectedIndex].title}
                  </h3>
                  {images[selectedIndex].description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {images[selectedIndex].description}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default GallerySlider;
