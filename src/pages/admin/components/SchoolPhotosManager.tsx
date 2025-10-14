import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trash2, Plus, Upload } from "lucide-react";

type SchoolType = 'children' | 'primary' | 'covenant';

interface SchoolPhoto {
  id: string;
  school_type: SchoolType;
  image_url: string;
  title: string | null;
  description: string | null;
  order_index: number;
  is_active: boolean;
}

const SchoolPhotosManager = () => {
  const [selectedSchool, setSelectedSchool] = useState<SchoolType>('children');
  const [newPhoto, setNewPhoto] = useState({ title: '', description: '', image_url: '' });
  const queryClient = useQueryClient();

  const { data: photos, isLoading } = useQuery({
    queryKey: ['school-photos', selectedSchool],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('school_photos')
        .select('*')
        .eq('school_type', selectedSchool)
        .order('order_index');
      
      if (error) throw error;
      return data as SchoolPhoto[];
    },
  });

  const addPhotoMutation = useMutation({
    mutationFn: async (photo: typeof newPhoto) => {
      const { error } = await supabase
        .from('school_photos')
        .insert({
          school_type: selectedSchool,
          title: photo.title,
          description: photo.description,
          image_url: photo.image_url,
          order_index: (photos?.length || 0) + 1,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school-photos'] });
      setNewPhoto({ title: '', description: '', image_url: '' });
      toast.success('Photo added successfully');
    },
    onError: () => toast.error('Failed to add photo'),
  });

  const deletePhotoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('school_photos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school-photos'] });
      toast.success('Photo deleted successfully');
    },
    onError: () => toast.error('Failed to delete photo'),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${selectedSchool}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('gallery-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(fileName);

      setNewPhoto({ ...newPhoto, image_url: publicUrl });
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage School Photos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Select School</Label>
            <Select value={selectedSchool} onValueChange={(value) => setSelectedSchool(value as SchoolType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="children">Children School</SelectItem>
                <SelectItem value="primary">Primary School</SelectItem>
                <SelectItem value="covenant">Covenant College</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-4">Add New Photo</h3>
            <div className="space-y-4">
              <div>
                <Label>Upload Image</Label>
                <Input type="file" accept="image/*" onChange={handleImageUpload} />
              </div>
              {newPhoto.image_url && (
                <img src={newPhoto.image_url} alt="Preview" className="w-32 h-32 object-cover rounded" />
              )}
              <div>
                <Label>Title</Label>
                <Input
                  value={newPhoto.title}
                  onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                  placeholder="Photo title"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={newPhoto.description}
                  onChange={(e) => setNewPhoto({ ...newPhoto, description: e.target.value })}
                  placeholder="Photo description"
                />
              </div>
              <Button
                onClick={() => addPhotoMutation.mutate(newPhoto)}
                disabled={!newPhoto.image_url || addPhotoMutation.isPending}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Photo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Photos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos?.map((photo) => (
                <div key={photo.id} className="border rounded-lg p-4 space-y-2">
                  <img src={photo.image_url} alt={photo.title || ''} className="w-full h-40 object-cover rounded" />
                  <h4 className="font-semibold">{photo.title}</h4>
                  <p className="text-sm text-muted-foreground">{photo.description}</p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deletePhotoMutation.mutate(photo.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolPhotosManager;