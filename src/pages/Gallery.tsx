import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Images } from "lucide-react";

interface GalleryImage {
  id: string;
  image_url: string;
  title: string;
  description: string;
}

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    fetchGalleryImages();
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
      <div className="gradient-hero py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Images className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">Media & Gallery</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Explore moments and memories from Salem Group of Schools
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={image.image_url}
                  alt={image.title || "Gallery image"}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              {(image.title || image.description) && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 text-white">
                    {image.title && (
                      <h3 className="text-xl font-bold mb-2">{image.title}</h3>
                    )}
                    {image.description && (
                      <p className="text-sm text-white/90">{image.description}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {images.length === 0 && (
          <div className="text-center py-12">
            <Images className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">No gallery images available at the moment.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Gallery;
