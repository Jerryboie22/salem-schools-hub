import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogClose } from "./ui/dialog";
import { Skeleton } from "./ui/skeleton";

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
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  useEffect(() => {
    // Auto slide every 3 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        images.length > 0 ? (prev + 1) % images.length : 0
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [images]);

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

  if (!loading && images.length === 0) {
    return null;
  }

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! + 1) % images.length);
  };

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(
      (prev) => (prev! - 1 + images.length) % images.length
    );
  };

  return (
    <section className="py-6 md:py-10 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3">Photo Gallery</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
