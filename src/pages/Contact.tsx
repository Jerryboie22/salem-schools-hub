import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.from("contact_messages").insert([formData]);
    
    if (error) {
      toast.error("Failed to send message. Please try again.");
    } else {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="gradient-hero py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold">Contact Us</h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            <Input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            <Input placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            <Textarea placeholder="Your Message" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required rows={6} />
            <Button type="submit" disabled={loading} className="w-full">{loading ? "Sending..." : "Send Message"}</Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
