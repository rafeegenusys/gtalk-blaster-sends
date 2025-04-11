
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  Image, 
  Paperclip, 
  Send, 
  Smile, 
  Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export function MessageComposer() {
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Character count and SMS segments
  const charCount = message.length;
  const smsSegments = Math.ceil(charCount / 160) || 1;
  
  const handleSend = async () => {
    if (!user || !message || !recipient) return;
    
    setIsSending(true);
    
    try {
      // Get the business ID for the current user
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('business_id')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      if (!profileData || !profileData.business_id) {
        throw new Error('Business ID not found for user');
      }

      // Create a placeholder recipient ID
      // In a real app, you'd validate the phone number and find a real contact
      const recipientId = "placeholder-" + Date.now().toString();
      
      // Insert the message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          type: 'SMS',
          content: message,
          sender_id: user.id,
          recipient_type: 'contact',
          recipient_id: recipientId,
          business_id: profileData.business_id,
          status: 'sent', // In a real app, this would be 'draft' until actually sent
          credits_used: smsSegments
        });

      if (messageError) throw messageError;
      
      // Call the deduct_credits function with the correct parameter names
      const { error: updateError } = await supabase.rpc('deduct_credits', { 
        p_business_id: profileData.business_id, 
        p_amount: smsSegments 
      });
      
      if (updateError) {
        console.error('Failed to deduct credits, but message was sent:', updateError);
      }
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
      
      // Reset form
      setMessage("");
      setRecipient("");
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>New Message</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="recipient" className="text-sm font-medium">
            To
          </label>
          <Input
            id="recipient"
            placeholder="Phone number or select contact"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <span className="text-xs text-muted-foreground">
              {charCount} chars | {smsSegments} SMS
            </span>
          </div>
          
          <Textarea
            id="message"
            placeholder="Type your message here..."
            className="min-h-32 resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="icon">
              <Image size={18} />
            </Button>
            <Button variant="outline" size="icon">
              <Paperclip size={18} />
            </Button>
            <Button variant="outline" size="icon">
              <Smile size={18} />
            </Button>
            <Button variant="outline" size="icon">
              <Sparkles size={18} className="text-gtalk-primary" />
            </Button>
            <Button variant="outline" size="icon">
              <Calendar size={18} />
            </Button>
          </div>
          
          <Button 
            className={cn(
              "bg-gtalk-primary hover:bg-gtalk-primary/90", 
              (!message || !recipient || isSending) && "opacity-50 cursor-not-allowed"
            )}
            disabled={!message || !recipient || isSending}
            onClick={handleSend}
          >
            <Send size={16} className="mr-2" />
            {isSending ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
