import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit } from "lucide-react";

interface SchoolFee {
  id: string;
  class_id: string;
  academic_year: string;
  term: string;
  amount: number;
  description: string;
  classes: {
    name: string;
  };
}

interface Class {
  id: string;
  name: string;
}

const SchoolFeesManager = () => {
  const [fees, setFees] = useState<SchoolFee[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [classId, setClassId] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [term, setTerm] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [feesResult, classesResult] = await Promise.all([
      supabase
        .from("school_fees")
        .select("*, classes(name)")
        .order("academic_year", { ascending: false }),
      supabase.from("classes").select("*").order("name"),
    ]);

    if (feesResult.error) {
      toast({
        title: "Error fetching fees",
        description: feesResult.error.message,
        variant: "destructive",
      });
    } else {
      setFees(feesResult.data || []);
    }

    if (classesResult.error) {
      toast({
        title: "Error fetching classes",
        description: classesResult.error.message,
        variant: "destructive",
      });
    } else {
      setClasses(classesResult.data || []);
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const feeData = {
      class_id: classId,
      academic_year: academicYear,
      term,
      amount: parseFloat(amount),
      description,
    };

    if (editingId) {
      const { error } = await supabase
        .from("school_fees")
        .update(feeData)
        .eq("id", editingId);

      if (error) {
        toast({
          title: "Error updating fee",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "School fee updated successfully",
        });
        resetForm();
        fetchData();
      }
    } else {
      const { error } = await supabase.from("school_fees").insert(feeData);

      if (error) {
        toast({
          title: "Error creating fee",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "School fee created successfully",
        });
        resetForm();
        fetchData();
      }
    }
    setSubmitting(false);
  };

  const handleEdit = (fee: SchoolFee) => {
    setClassId(fee.class_id);
    setAcademicYear(fee.academic_year);
    setTerm(fee.term);
    setAmount(fee.amount.toString());
    setDescription(fee.description || "");
    setEditingId(fee.id);
  };

  const resetForm = () => {
    setClassId("");
    setAcademicYear("");
    setTerm("");
    setAmount("");
    setDescription("");
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("school_fees").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting fee",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "School fee deleted successfully",
      });
      fetchData();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Edit School Fee" : "Set School Fee"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select value={classId} onValueChange={setClassId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Academic Year (e.g., 2024/2025)"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              required
            />
            <Select value={term} onValueChange={setTerm} required>
              <SelectTrigger>
                <SelectValue placeholder="Select Term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="First Term">First Term</SelectItem>
                <SelectItem value="Second Term">Second Term</SelectItem>
                <SelectItem value="Third Term">Third Term</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Amount (₦)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0"
              step="0.01"
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Fee Breakdown (Optional)</label>
              <Textarea
                placeholder="Use template: Tuition: ₦50,000&#10;Books: ₦10,000&#10;Uniform: ₦15,000&#10;Activities: ₦5,000&#10;Total: ₦80,000"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
              />
              <p className="text-xs text-muted-foreground">Enter fee breakdown for student dashboard</p>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : editingId ? "Update Fee" : "Set Fee"}
              </Button>
              {editingId && (
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
          <CardTitle>All School Fees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fees.map((fee) => (
              <div
                key={fee.id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{fee.classes.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {fee.academic_year} - {fee.term}
                  </p>
                  <p className="text-lg font-bold mt-1">₦{fee.amount.toLocaleString()}</p>
                  {fee.description && (
                    <p className="text-sm text-muted-foreground mt-1">{fee.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(fee)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(fee.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolFeesManager;