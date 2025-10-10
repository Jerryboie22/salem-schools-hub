import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface GalleryImage {
  id: string;
  image_url: string;
  title: string;
  description: string;
}

const GallerySlider = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("is_active", true)
      .order("order_index", { ascending: true })
      .limit(10);

    if (error) {
      console.error("Error fetching gallery images:", error);
      return;
    }

    setImages(data || []);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Gallery</h2>
          <p className="text-lg text-muted-foreground">
            A glimpse into life at Salem Group of Schools
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="relative h-[500px] overflow-hidden rounded-lg">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={image.image_url}
                  alt={image.title || "Gallery image"}
                  className="w-full h-full object-cover"
                />
                {image.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <h3 className="text-white text-2xl font-bold">{image.title}</h3>
                    {image.description && (
                      <p className="text-white/90 mt-2">{image.description}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link to="/gallery">View Full Gallery</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GallerySlider;
