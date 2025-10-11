import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, UserPlus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  created_at: string;
}

export const UserManagementManager = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUserId, setNewUserId] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'teacher' | 'student' | 'parent'>('teacher');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const fetchUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserRoles(data || []);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch user roles',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUserId || !newUserRole) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please provide both user ID and role',
      });
      return;
    }

    setSubmitting(true);

    try {
      // Insert role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert([{
          user_id: newUserId,
          role: newUserRole,
        }]);

      if (insertError) {
        if (insertError.message.includes('duplicate')) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'User already has this role',
          });
        } else {
          throw insertError;
        }
        return;
      }

      toast({
        title: 'Success',
        description: `Role ${newUserRole} assigned successfully`,
      });

      setNewUserId('');
      setNewUserRole('teacher');
      fetchUserRoles();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to add user role',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Role removed successfully',
      });

      fetchUserRoles();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to remove role',
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Add User Role</h2>
        <form onSubmit={handleAddUser} className="space-y-4">
          <div>
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              type="text"
              placeholder="User UUID from backend"
              value={newUserId}
              onChange={(e) => setNewUserId(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Get user ID from backend: Cloud → Auth → Users
            </p>
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={newUserRole} onValueChange={(value: any) => setNewUserRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={submitting}>
            <UserPlus className="mr-2 h-4 w-4" />
            {submitting ? 'Adding...' : 'Add User Role'}
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Current User Roles</h2>
        <div className="space-y-2">
          {userRoles.length === 0 ? (
            <p className="text-muted-foreground">No user roles found</p>
          ) : (
            userRoles.map((userRole) => (
              <div
                key={userRole.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">User ID: {userRole.user_id.slice(0, 8)}...</p>
                  <p className="text-sm text-muted-foreground">Role: {userRole.role}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteRole(userRole.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
