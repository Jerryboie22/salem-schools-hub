import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Leader {
  id: string;
  name: string;
  position: string;
  bio: string | null;
  image_url: string | null;
  order_index: number;
  is_active: boolean;
}

interface SortableLeaderItemProps {
  leader: Leader;
  onEdit: (leader: Leader) => void;
  onDelete: (id: string) => void;
}

const SortableLeaderItem = ({ leader, onEdit, onDelete }: SortableLeaderItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: leader.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-accent rounded-md transition-colors"
          >
            <GripVertical className="w-5 h-5 text-muted-foreground" />
          </div>
          
          {/* Leader Image */}
          {leader.image_url && (
            <img
              src={leader.image_url}
              alt={leader.name}
              className="w-16 h-16 rounded-full object-cover flex-shrink-0"
            />
          )}
          
          {/* Leader Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg truncate">{leader.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{leader.position}</p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{leader.bio}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs px-2 py-0.5 rounded ${leader.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {leader.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onEdit(leader)}
              className="whitespace-nowrap"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={() => onDelete(leader.id)}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const LeadershipManager = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    bio: "",
    image_url: "",
    order_index: 0,
    is_active: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    const { data, error } = await supabase
      .from("leadership_team")
      .select("*")
      .order("order_index");

    if (error) {
      toast({ title: "Error fetching leaders", description: error.message, variant: "destructive" });
      return;
    }
    setLeaders(data || []);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `leadership/${Date.now()}.${fileExt}`;
      
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

    if (editingLeader) {
      const { error } = await supabase
        .from("leadership_team")
        .update(formData)
        .eq("id", editingLeader.id);

      if (error) {
        toast({ title: "Error updating leader", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Success", description: "Leader updated successfully" });
    } else {
      const { error } = await supabase.from("leadership_team").insert([formData]);

      if (error) {
        toast({ title: "Error creating leader", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Success", description: "Leader added successfully" });
    }

    resetForm();
    fetchLeaders();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this leader?")) return;

    const { error } = await supabase.from("leadership_team").delete().eq("id", id);

    if (error) {
      toast({ title: "Error deleting leader", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Success", description: "Leader deleted successfully" });
    fetchLeaders();
  };

  const handleEdit = (leader: Leader) => {
    setEditingLeader(leader);
    setFormData({
      name: leader.name,
      position: leader.position,
      bio: leader.bio || "",
      image_url: leader.image_url || "",
      order_index: leader.order_index,
      is_active: leader.is_active,
    });
  };

  const resetForm = () => {
    setEditingLeader(null);
    setFormData({
      name: "",
      position: "",
      bio: "",
      image_url: "",
      order_index: 0,
      is_active: true,
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = leaders.findIndex((l) => l.id === active.id);
    const newIndex = leaders.findIndex((l) => l.id === over.id);

    const newLeaders = arrayMove(leaders, oldIndex, newIndex);
    
    // Update state immediately for better UX
    setLeaders(newLeaders);

    // Update order_index for all affected items
    try {
      const updates = newLeaders.map((leader, index) => 
        supabase
          .from('leadership_team')
          .update({ order_index: index })
          .eq('id', leader.id)
      );

      await Promise.all(updates);
      
      toast({ 
        title: "Success", 
        description: "Leadership order updated successfully" 
      });
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to update order", 
        variant: "destructive" 
      });
      // Revert on error
      fetchLeaders();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingLeader ? "Edit Leader" : "Add New Leader"}</CardTitle>
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
                <Label>Position</Label>
                <Input
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Upload Image or Enter URL</Label>
              <Input type="file" accept="image/*" onChange={handleImageUpload} className="mb-2" />
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="Or enter image URL: https://example.com/image.jpg"
              />
              {formData.image_url && (
                <img src={formData.image_url} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />
              )}
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label>Active</Label>
            </div>
            <div className="flex gap-2">
              <Button type="submit">
                {editingLeader ? "Update" : "Add"} Leader
              </Button>
              {editingLeader && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leadership Team Members (Drag to Reorder)</CardTitle>
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={leaders.map(l => l.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {leaders.map((leader) => (
                  <SortableLeaderItem
                    key={leader.id}
                    leader={leader}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
            
          {leaders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No leadership team members yet. Add one above to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadershipManager;
