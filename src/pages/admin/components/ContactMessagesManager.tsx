import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

const ContactMessagesManager = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error fetching messages", description: error.message, variant: "destructive" });
      return;
    }
    setMessages(data || []);
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      toast({ title: "Error updating message", description: error.message, variant: "destructive" });
      return;
    }

    fetchMessages();
  };

  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No messages yet
          </CardContent>
        </Card>
      ) : (
        messages.map((message) => (
          <Card key={message.id} className={message.is_read ? "opacity-60" : ""}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{message.name}</h3>
                  <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {message.email}
                    </div>
                    {message.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {message.phone}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {message.is_read ? (
                    <Badge variant="secondary">Read</Badge>
                  ) : (
                    <Badge variant="default">New</Badge>
                  )}
                </div>
              </div>
              <p className="text-sm mb-4 whitespace-pre-wrap">{message.message}</p>
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  {new Date(message.created_at).toLocaleString()}
                </p>
                {!message.is_read && (
                  <Button size="sm" variant="outline" onClick={() => markAsRead(message.id)}>
                    Mark as Read
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ContactMessagesManager;
