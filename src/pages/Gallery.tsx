import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Images, X } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {images.map((image) => (
            <div
              key={image.id}
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
                  <div className="p-8 text-white w-full">
                    {image.title && (
                      <h3 className="text-2xl md:text-3xl font-bold mb-3 drop-shadow-lg">{image.title}</h3>
                    )}
                    {image.description && (
                      <p className="text-base md:text-lg text-white/95 drop-shadow-md">{image.description}</p>
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
