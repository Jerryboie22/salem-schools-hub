import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  message: string;
  image_url: string | null;
  is_active: boolean;
}

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    message: "",
    image_url: "",
    is_active: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error fetching testimonials", description: error.message, variant: "destructive" });
      return;
    }
    setTestimonials(data || []);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `testimonials/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(fileName);

      setFormData({ ...formData, image_url: publicUrl });
      toast({ title: "Success", description: "Image uploaded successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from("testimonials")
        .update(formData)
        .eq("id", editingId);

      if (error) {
        toast({ title: "Error updating testimonial", description: error.message, variant: "destructive" });
        return;
      }

      toast({ title: "Success", description: "Testimonial updated successfully" });
    } else {
      const { error } = await supabase.from("testimonials").insert([formData]);

      if (error) {
        toast({ title: "Error adding testimonial", description: error.message, variant: "destructive" });
        return;
      }

      toast({ title: "Success", description: "Testimonial added successfully" });
    }

    setFormData({ name: "", role: "", message: "", image_url: "", is_active: true });
    setEditingId(null);
    fetchTestimonials();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    const { error } = await supabase.from("testimonials").delete().eq("id", id);

    if (error) {
      toast({ title: "Error deleting testimonial", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Success", description: "Testimonial deleted successfully" });
    fetchTestimonials();
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("testimonials")
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (error) {
      toast({ title: "Error updating testimonial", description: error.message, variant: "destructive" });
      return;
    }

    fetchTestimonials();
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      message: testimonial.message,
      image_url: testimonial.image_url || "",
      is_active: testimonial.is_active,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", role: "", message: "", image_url: "", is_active: true });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit Testimonial" : "Add New Testimonial"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                  placeholder="e.g., Parent, Teacher, Student"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Upload Image or Enter URL (Optional)</Label>
              <Input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="Or enter image URL: https://example.com/image.jpg"
              />
              {formData.image_url && (
                <img src={formData.image_url} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded-full" />
              )}
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">
                <Plus className="w-4 h-4 mr-2" />
                {editingId ? "Update Testimonial" : "Add Testimonial"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex gap-4 flex-1">
                  {testimonial.image_url && (
                    <img
                      src={testimonial.image_url}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{testimonial.role}</p>
                    <p className="text-sm">{testimonial.message}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-start">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={testimonial.is_active}
                      onCheckedChange={() => toggleActive(testimonial.id, testimonial.is_active)}
                    />
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(testimonial)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(testimonial.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsManager;
