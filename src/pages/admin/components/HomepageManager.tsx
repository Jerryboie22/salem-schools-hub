import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";

interface HomepageContent {
  id: string;
  section: string;
  content_key: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  order_index: number;
  is_active: boolean;
}

export default function HomepageManager() {
  const [newSlide, setNewSlide] = useState({
    title: "",
    subtitle: "",
    image_url: "",
  });
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  const { data: heroSlides, isLoading } = useQuery({
    queryKey: ["homepage-hero-slides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homepage_content")
        .select("*")
        .eq("section", "hero")
        .eq("is_active", true)
        .order("order_index");
      
      if (error) throw error;
      return data as HomepageContent[];
    },
  });

  const addSlideMutation = useMutation({
    mutationFn: async (slide: typeof newSlide) => {
      const maxOrder = heroSlides?.length || 0;
      const { error } = await supabase.from("homepage_content").insert({
        section: "hero",
        content_key: `slide${maxOrder + 1}`,
        title: slide.title,
        subtitle: slide.subtitle,
        image_url: slide.image_url,
        order_index: maxOrder + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Hero slide added successfully");
      queryClient.invalidateQueries({ queryKey: ["homepage-hero-slides"] });
      setNewSlide({ title: "", subtitle: "", image_url: "" });
    },
    onError: () => {
      toast.error("Failed to add hero slide");
    },
  });

  const deleteSlideMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("homepage_content")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Hero slide deleted");
      queryClient.invalidateQueries({ queryKey: ["homepage-hero-slides"] });
    },
    onError: () => {
      toast.error("Failed to delete hero slide");
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `hero-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("gallery-images")
        .getPublicUrl(filePath);

      setNewSlide({ ...newSlide, image_url: publicUrl });
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hero Section Slides</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <h3 className="font-semibold">Add New Slide</h3>
            <Input
              placeholder="Title"
              value={newSlide.title}
              onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
            />
            <Textarea
              placeholder="Subtitle"
              value={newSlide.subtitle}
              onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
            />
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Button type="button" variant="outline" size="sm" disabled={uploading}>
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? "Uploading..." : "Upload Image"}
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {newSlide.image_url && (
                <img
                  src={newSlide.image_url}
                  alt="Preview"
                  className="w-32 h-20 object-cover rounded"
                />
              )}
            </div>
            <Button
              onClick={() => addSlideMutation.mutate(newSlide)}
              disabled={!newSlide.title || !newSlide.image_url || addSlideMutation.isPending}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Slide
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Current Slides</h3>
            {heroSlides?.map((slide) => (
              <Card key={slide.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {slide.image_url && (
                      <img
                        src={slide.image_url}
                        alt={slide.title || "Hero slide"}
                        className="w-32 h-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold">{slide.title}</h4>
                      <p className="text-sm text-muted-foreground">{slide.subtitle}</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteSlideMutation.mutate(slide.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
