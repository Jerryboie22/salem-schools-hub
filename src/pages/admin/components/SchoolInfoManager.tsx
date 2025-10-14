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
import { Save, Plus, X } from "lucide-react";

type SchoolType = 'children' | 'primary' | 'covenant';

interface SchoolInfo {
  id: string;
  school_type: SchoolType;
  principal_name: string | null;
  principal_position: string | null;
  principal_image_url: string | null;
  principal_message: string | null;
  facilities: string[] | null;
}

const SchoolInfoManager = () => {
  const [selectedSchool, setSelectedSchool] = useState<SchoolType>('children');
  const [newFacility, setNewFacility] = useState('');
  const [formData, setFormData] = useState({
    principal_name: '',
    principal_position: '',
    principal_message: ''
  });
  const queryClient = useQueryClient();

  const { data: schoolInfo, isLoading } = useQuery({
    queryKey: ['school-info', selectedSchool],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('school_info')
        .select('*')
        .eq('school_type', selectedSchool)
        .single();
      
      if (error) throw error;
      
      // Update form data when school info is fetched
      if (data) {
        setFormData({
          principal_name: data.principal_name || '',
          principal_position: data.principal_position || '',
          principal_message: data.principal_message || ''
        });
      }
      
      return data as SchoolInfo;
    },
  });

  const updateInfoMutation = useMutation({
    mutationFn: async (updates: Partial<SchoolInfo>) => {
      const { error } = await supabase
        .from('school_info')
        .update(updates)
        .eq('school_type', selectedSchool);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school-info'] });
      toast.success('School info updated successfully');
    },
    onError: () => toast.error('Failed to update school info'),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `principals/${selectedSchool}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(fileName);

      updateInfoMutation.mutate({ principal_image_url: publicUrl });
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const handleSavePrincipalInfo = () => {
    if (!schoolInfo) return;
    updateInfoMutation.mutate({
      principal_name: formData.principal_name,
      principal_position: formData.principal_position,
      principal_message: formData.principal_message
    });
  };

  const addFacility = () => {
    if (!newFacility.trim() || !schoolInfo) return;
    const updatedFacilities = [...(schoolInfo.facilities || []), newFacility];
    updateInfoMutation.mutate({ facilities: updatedFacilities });
    setNewFacility('');
  };

  const removeFacility = (index: number) => {
    if (!schoolInfo) return;
    const updatedFacilities = schoolInfo.facilities?.filter((_, i) => i !== index);
    updateInfoMutation.mutate({ facilities: updatedFacilities });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage School Information</CardTitle>
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

          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Principal/Head Teacher Information</h3>
              <Button onClick={handleSavePrincipalInfo} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Update Info
              </Button>
            </div>
            
            <div>
              <Label>Section Title (Editable)</Label>
              <Input
                value={schoolInfo?.principal_position || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, principal_position: e.target.value }))}
                placeholder="e.g., Principal's Desk, Head Teacher's Message"
              />
            </div>

            <div>
              <Label>Name</Label>
              <Input
                value={schoolInfo?.principal_name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, principal_name: e.target.value }))}
                placeholder="Principal name"
              />
            </div>

            <div>
              <Label>Upload Photo</Label>
              <Input type="file" accept="image/*" onChange={handleImageUpload} />
              {schoolInfo?.principal_image_url && (
                <img 
                  src={schoolInfo.principal_image_url} 
                  alt="Principal" 
                  className="mt-2 w-32 h-32 object-cover rounded-lg"
                />
              )}
            </div>

            <div>
              <Label>Message from Desk</Label>
              <Textarea
                value={schoolInfo?.principal_message || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, principal_message: e.target.value }))}
                placeholder="Principal's welcome message"
                rows={5}
              />
            </div>
          </div>

          <div className="border-t pt-4 space-y-4">
            <h3 className="font-semibold">Facilities</h3>
            
            <div className="flex gap-2">
              <Input
                value={newFacility}
                onChange={(e) => setNewFacility(e.target.value)}
                placeholder="Add new facility"
                onKeyPress={(e) => e.key === 'Enter' && addFacility()}
              />
              <Button onClick={addFacility}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {schoolInfo?.facilities?.map((facility, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span>{facility}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFacility(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolInfoManager;