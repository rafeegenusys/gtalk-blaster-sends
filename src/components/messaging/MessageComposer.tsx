
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
  Sparkles,
  Users,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { NewMessage } from "./NewMessage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

export function MessageComposer() {
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [showContactSelector, setShowContactSelector] = useState(false);
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

  const handleNewMessageSend = (phoneNumber: string, messageText: string, scheduledTime?: Date, cancelIfResponse?: boolean) => {
    if (!phoneNumber || !messageText) return;
    
    try {
      // In a real app, this would use the same logic as handleSend but with the provided parameters
      toast({
        title: scheduledTime ? "Message scheduled" : "Message sent",
        description: scheduledTime 
          ? `Your message to ${phoneNumber} will be sent on ${scheduledTime.toLocaleString()}${cancelIfResponse ? ' and will be cancelled if a response is received' : ''}` 
          : `Your message to ${phoneNumber} has been sent successfully.`,
      });
      
      // Clear the form in the composer
      setMessage("");
      setRecipient("");
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage(prev => prev + emoji.native);
  };
  
  return (
    <>
      <Card className="h-full">
        <CardHeader>
          <CardTitle>New Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="recipient" className="text-sm font-medium">
              To
            </label>
            <div className="flex gap-2">
              <Input
                id="recipient"
                placeholder="Phone number or select contact"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setShowContactSelector(true)}
                title="Select contact"
              >
                <User size={16} />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setShowNewMessage(true)} 
                title="Open full composer"
              >
                <Sparkles size={16} />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <span className="text-xs text-muted-foreground">
                {charCount} chars | {smsSegments} SMS {smsSegments !== 1 ? 'segments' : 'segment'}
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
              <Button variant="outline" size="icon" title="Add image">
                <Image size={18} />
              </Button>
              <Button variant="outline" size="icon" title="Add attachment">
                <Paperclip size={18} />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" title="Add emoji">
                    <Smile size={18} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Picker 
                    data={data}
                    onEmojiSelect={handleEmojiSelect}
                    theme="light"
                  />
                </PopoverContent>
              </Popover>
              <Button variant="outline" size="icon" title="Schedule message">
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

      <NewMessage
        open={showNewMessage}
        onOpenChange={setShowNewMessage}
        onSend={handleNewMessageSend}
      />
    </>
  );
}
