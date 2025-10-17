import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Upload, Edit, X, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<HomepageContent>>({});
  const [uploading, setUploading] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all homepage content
  const { data: content, isLoading } = useQuery({
    queryKey: ["homepage-content"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homepage_content")
        .select("*")
        .order("section, order_index");
      
      if (error) throw error;
      return data as HomepageContent[];
    },
  });

  // Group content by section
  const heroSlides = content?.filter(c => c.section === "hero" && c.is_active) || [];
  const aboutContent = content?.filter(c => c.section === "about" && c.is_active) || [];
  const missionContent = content?.filter(c => c.section === "mission" && c.is_active) || [];
  const valuesContent = content?.filter(c => c.section === "values" && c.is_active) || [];
  const facilitiesContent = content?.filter(c => c.section === "facilities" && c.is_active) || [];
  const contactContent = content?.filter(c => c.section === "contact" && c.is_active) || [];

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
      toast({ title: "Hero slide added successfully" });
      queryClient.invalidateQueries({ queryKey: ["homepage-content"] });
      setNewSlide({ title: "", subtitle: "", image_url: "" });
    },
    onError: () => {
      toast({ title: "Failed to add hero slide", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<HomepageContent> }) => {
      const { error } = await supabase
        .from("homepage_content")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Content updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["homepage-content"] });
      setEditingId(null);
      setEditForm({});
    },
    onError: () => {
      toast({ title: "Failed to update content", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("homepage_content")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Content deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["homepage-content"] });
    },
    onError: () => {
      toast({ title: "Failed to delete content", variant: "destructive" });
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `homepage-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("gallery-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("gallery-images")
        .getPublicUrl(filePath);

      if (isEdit) {
        setEditForm({ ...editForm, image_url: publicUrl });
      } else {
        setNewSlide({ ...newSlide, image_url: publicUrl });
      }
      toast({ title: "Image uploaded successfully" });
    } catch (error) {
      toast({ title: "Failed to upload image", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const startEditing = (item: HomepageContent) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, updates: editForm });
    }
  };

  const renderContentItem = (item: HomepageContent) => {
    const isEditing = editingId === item.id;

    return (
      <Card key={item.id} className="mb-4">
        <CardContent className="pt-6">
          {isEditing ? (
            <div className="space-y-4">
              <Input
                value={editForm.title || ""}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                placeholder="Title"
              />
              <Input
                value={editForm.subtitle || ""}
                onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                placeholder="Subtitle"
              />
              <Textarea
                value={editForm.description || ""}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Description"
              />
              {(item.section === "hero" || item.section === "about" || item.section === "facilities") && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Button type="button" variant="outline" size="sm" disabled={uploading}>
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading ? "Uploading..." : "Change Image"}
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                  {editForm.image_url && (
                    <img
                      src={editForm.image_url}
                      alt="Preview"
                      className="w-32 h-20 object-cover rounded"
                    />
                  )}
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={saveEdit} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button onClick={cancelEditing} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title || "Content image"}
                  className="w-32 h-20 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h4 className="font-semibold">{item.title}</h4>
                {item.subtitle && <p className="text-sm text-muted-foreground">{item.subtitle}</p>}
                {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEditing(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="hero" className="w-full">
      <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
        <TabsTrigger value="hero">Hero Slides</TabsTrigger>
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="mission">Mission</TabsTrigger>
        <TabsTrigger value="values">Values</TabsTrigger>
        <TabsTrigger value="facilities">Facilities</TabsTrigger>
        <TabsTrigger value="contact">Contact</TabsTrigger>
      </TabsList>

      <TabsContent value="hero">
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
                    onChange={(e) => handleImageUpload(e, false)}
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
              {heroSlides.map(renderContentItem)}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="about">
        <Card>
          <CardHeader>
            <CardTitle>About Section Content</CardTitle>
          </CardHeader>
          <CardContent>
            {aboutContent.map(renderContentItem)}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="mission">
        <Card>
          <CardHeader>
            <CardTitle>Mission Statement</CardTitle>
          </CardHeader>
          <CardContent>
            {missionContent.map(renderContentItem)}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="values">
        <Card>
          <CardHeader>
            <CardTitle>Core Values</CardTitle>
          </CardHeader>
          <CardContent>
            {valuesContent.map(renderContentItem)}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="facilities">
        <Card>
          <CardHeader>
            <CardTitle>Facilities Section</CardTitle>
          </CardHeader>
          <CardContent>
            {facilitiesContent.map(renderContentItem)}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="contact">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            {contactContent.map(renderContentItem)}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
