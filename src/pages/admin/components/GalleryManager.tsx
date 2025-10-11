import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";

interface GalleryImage {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  order_index: number;
  is_active: boolean;
}

const GalleryManager = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    order_index: 0,
    is_active: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("order_index");

    if (error) {
      toast({ title: "Error fetching images", description: error.message, variant: "destructive" });
      return;
    }
    setImages(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("gallery_images").insert([formData]);

    if (error) {
      toast({ title: "Error adding image", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Success", description: "Image added successfully" });
    setFormData({ title: "", description: "", image_url: "", order_index: 0, is_active: true });
    fetchImages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    const { error } = await supabase.from("gallery_images").delete().eq("id", id);

    if (error) {
      toast({ title: "Error deleting image", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Success", description: "Image deleted successfully" });
    fetchImages();
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("gallery_images")
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (error) {
      toast({ title: "Error updating image", description: error.message, variant: "destructive" });
      return;
    }

    fetchImages();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Image</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Order</Label>
              <Input
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
              />
            </div>
            <Button type="submit">
              <Plus className="w-4 h-4 mr-2" />
              Add Image
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image) => (
          <Card key={image.id}>
            <CardContent className="p-4">
              <img
                src={image.image_url}
                alt={image.title || "Gallery image"}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="font-bold mb-2">{image.title || "Untitled"}</h3>
              <p className="text-sm text-muted-foreground mb-4">{image.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={image.is_active}
                    onCheckedChange={() => toggleActive(image.id, image.is_active)}
                  />
                  <Label className="text-xs">Active</Label>
                </div>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(image.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GalleryManager;
