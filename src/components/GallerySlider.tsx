import { useEffect, useState, useRef } from "react";
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

  // refs for intervals so we can clear them
  const mainAutoRef = useRef<number | null>(null);
  const dialogAutoRef = useRef<number | null>(null);

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

  // MAIN carousel autoplay (clicks the carousel next button every 3s)
  useEffect(() => {
    // clear any existing interval
    if (mainAutoRef.current) {
      clearInterval(mainAutoRef.current);
      mainAutoRef.current = null;
    }

    if (images.length === 0) return;

    mainAutoRef.current = window.setInterval(() => {
      // if dialog is open, pause main autoplay
      if (selectedIndex !== null) return;

      const nextBtn = document.querySelector('[data-carousel-next]') as HTMLElement | null;
      if (nextBtn) {
        nextBtn.click();
      }
    }, 3000);

    return () => {
      if (mainAutoRef.current) {
        clearInterval(mainAutoRef.current);
        mainAutoRef.current = null;
      }
    };
  }, [images, selectedIndex]);

  // DIALOG autoplay while open
  useEffect(() => {
    // Clear any existing dialog interval
    if (dialogAutoRef.current) {
      clearInterval(dialogAutoRef.current);
      dialogAutoRef.current = null;
    }

    if (selectedIndex === null) return;

    dialogAutoRef.current = window.setInterval(() => {
      setSelectedIndex((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % images.length;
      });
    }, 3000);

    return () => {
      if (dialogAutoRef.current) {
        clearInterval(dialogAutoRef.current);
        dialogAutoRef.current = null;
      }
    };
  }, [selectedIndex, images.length]);

  const handleNextDialog = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((s) => (s! + 1) % images.length);
  };

  const handlePrevDialog = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((s) => (s! - 1 + images.length) % images.length);
  };

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
          // Main Carousel showing ONE slide per view
          <Carousel
            opts={{
              align: "center", // center single slide
              loop: true,
            }}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={image.id} className="basis-full flex items-center justify-center">
                  {/* Maintain fixed height & width (responsive) while keeping object-cover */}
                  <div
                    onClick={() => setSelectedIndex(index)}
                    className="w-full h-[420px] md:h-[520px] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
                  >
                    <img
                      src={image.image_url}
                      alt={image.title || "Gallery image"}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {image.title && (
                      <div className="absolute bottom-4 left-4 bg-black/40 py-1 px-3 rounded text-white text-sm backdrop-blur-sm">
                        {image.title}
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* visible nav on md+ */}
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

      {/* Fullscreen Dialog / Viewer with next/prev and its own autoplay */}
      <Dialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
        <DialogContent className="max-w-5xl w-full p-0 bg-white border-0 relative rounded-lg shadow-2xl overflow-hidden">
          <DialogClose className="absolute right-3 top-3 z-50 rounded-full bg-black/10 p-2 hover:bg-black/20 transition-colors">
            <X className="h-5 w-5 text-black" />
          </DialogClose>

          {selectedIndex !== null && (
            <div className="relative w-full flex flex-col items-center justify-center p-4">
              <div className="relative w-full flex items-center justify-center">
                <button
                  onClick={handlePrevDialog}
                  className="absolute left-2 md:left-4 text-black bg-white/80 hover:bg-white/95 rounded-full p-2 z-50 shadow-md"
                  aria-label="Previous"
                >
                  ‹
                </button>

                <img
                  src={images[selectedIndex].image_url}
                  alt={images[selectedIndex].title || "Gallery image"}
                  className="max-w-full max-h-[80vh] object-contain rounded-md transition-all duration-500"
                />

                <button
                  onClick={handleNextDialog}
                  className="absolute right-2 md:right-4 text-black bg-white/80 hover:bg-white/95 rounded-full p-2 z-50 shadow-md"
                  aria-label="Next"
                >
                  ›
                </button>
              </div>

              {images[selectedIndex].title && (
                <div className="mt-3 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">{images[selectedIndex].title}</h3>
                  {images[selectedIndex].description && (
                    <p className="text-sm text-gray-600 mt-1">{images[selectedIndex].description}</p>
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
