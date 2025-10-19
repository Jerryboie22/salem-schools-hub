import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Images, X } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import galleryHero from "@/assets/gallery-hero.jpg";

interface GalleryImage {
  id: string;
  image_url: string;
  title: string;
  description: string;
}

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetchGalleryImages();

    // Auto-slide effect (every 5 seconds)
    const interval = setInterval(() => {
      const nextBtn = document.querySelector("[data-carousel-next]");
      if (nextBtn) (nextBtn as HTMLButtonElement).click();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchGalleryImages = async () => {
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
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <img src={galleryHero} alt="Gallery" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-accent/70" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-primary-foreground">
          <div className="container mx-auto px-4">
            <Images className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-5xl font-bold mb-4">Media & Gallery</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Explore moments and memories from Salem Group of Schools
            </p>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="container mx-auto px-4 py-16">
        {images.length > 0 ? (
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent>
              {images.map((image) => (
                <CarouselItem key={image.id} className="basis-full">
                  <div
                    onClick={() => setSelectedImage(image)}
                    className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer bg-card"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={image.image_url}
                        alt={image.title || "Gallery image"}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    </div>
                    {(image.title || image.description) && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end">
                        <div className="p-6 md:p-8 text-white w-full">
                          {image.title && (
                            <h3 className="text-xl md:text-3xl font-bold mb-2 md:mb-3 drop-shadow-lg">
                              {image.title}
                            </h3>
                          )}
                          {image.description && (
                            <p className="text-sm md:text-lg text-white/95 drop-shadow-md">
                              {image.description}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Controls */}
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>
        ) : (
          <div className="text-center py-12">
            <Images className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              No gallery images available at the moment.
            </p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-7xl w-full p-0 bg-black/95 border-0">
          <DialogClose className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors">
            <X className="h-6 w-6 text-white" />
          </DialogClose>

          {selectedImage && (
            <div className="relative w-full h-[90vh] flex items-center justify-center p-4">
              <img
                src={selectedImage.image_url}
                alt={selectedImage.title || "Gallery image"}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              {selectedImage.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h3 className="text-white text-2xl font-bold">{selectedImage.title}</h3>
                  {selectedImage.description && (
                    <p className="text-white/80 mt-2">{selectedImage.description}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Gallery;
