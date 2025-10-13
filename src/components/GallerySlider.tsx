import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface GalleryImage {
  id: string;
  image_url: string;
  title: string;
  description: string;
}

const GallerySlider = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const imagesPerPage = 8; // 2 rows x 4 columns

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("is_active", true)
      .order("order_index", { ascending: true })
      .limit(20);

    if (error) {
      console.error("Error fetching gallery images:", error);
      return;
    }

    setImages(data || []);
  };

  const totalPages = Math.ceil(images.length / imagesPerPage);
  const startIndex = currentPage * imagesPerPage;
  const currentImages = images.slice(startIndex, startIndex + imagesPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-accent/10 to-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMC0xOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnpNMCAwaDYwdjYwSDB6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii4wMiIvPjwvZz48L3N2Zz4=')] opacity-40"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              Our Moments
            </span>
          </div>
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
            Gallery Showcase
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Capturing moments of excellence, joy, and achievement in our vibrant community
          </p>
        </div>

        <div className="relative max-w-7xl mx-auto px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {currentImages.map((image, idx) => (
              <div 
                key={image.id} 
                className="relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer animate-fade-in border-2 border-transparent hover:border-primary/30"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <img
                  src={image.image_url}
                  alt={image.title || "Gallery image"}
                  className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  {image.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white text-base font-bold drop-shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {image.title}
                      </h3>
                    </div>
                  )}
                </div>
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-primary/20 border-r-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <>
              <Button
                onClick={prevPage}
                size="lg"
                className="absolute left-0 top-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-gradient-to-r from-primary to-accent shadow-2xl hover:shadow-primary/50 hover:scale-110 transition-all duration-300 border-4 border-background z-20"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </Button>

              <Button
                onClick={nextPage}
                size="lg"
                className="absolute right-0 top-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-gradient-to-r from-accent to-primary shadow-2xl hover:shadow-accent/50 hover:scale-110 transition-all duration-300 border-4 border-background z-20"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </Button>

              <div className="flex justify-center gap-3 mt-8">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      index === currentPage
                        ? "bg-gradient-to-r from-primary to-accent w-12 shadow-lg"
                        : "bg-muted-foreground/30 w-3 hover:bg-muted-foreground/60 hover:w-6"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="text-center mt-12 animate-fade-in">
          <Button
            onClick={() => navigate("/gallery")}
            size="lg"
            className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] hover:bg-[position:100%_0] transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-105 text-lg px-8 py-6 rounded-full"
          >
            Explore Full Gallery
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GallerySlider;
