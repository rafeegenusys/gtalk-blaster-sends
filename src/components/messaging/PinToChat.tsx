
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "./MessageThread";
import { PinIcon, MessageSquareText } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

interface PinToChatProps {
  message: Message;
  contactName?: string;
  contactPhone: string;
}

export function PinToChat({ message, contactName, contactPhone }: PinToChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handlePinToChat = async () => {
    setIsSubmitting(true);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) {
        throw new Error("User not authenticated");
      }
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('business_id')
        .eq('id', userData.user.id)
        .single();
        
      if (!profileData?.business_id) {
        throw new Error("Business not found");
      }
      
      // Create a chat message that references this SMS
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          business_id: profileData.business_id,
          sender_id: userData.user.id,
          content: `📌 Pinned SMS from ${contactName || contactPhone}:\n"${message.content}"\n\n${notes}`,
        });
      
      if (error) throw error;
      
      setIsOpen(false);
      toast({
        title: "Message pinned to team chat",
        description: "The message has been pinned to the team chat for discussion",
      });
    } catch (error: any) {
      toast({
        title: "Failed to pin message",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <PinIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pin Message to Team Chat</DialogTitle>
          <DialogDescription>
            This will create a thread in the team chat for discussion about this message.
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4 p-3 border rounded-md bg-muted/30">
          <p className="text-sm mb-2 font-medium text-muted-foreground">
            From: {contactName || contactPhone}
          </p>
          <p className="text-sm">{message.content}</p>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium">
            Add notes (optional)
          </label>
          <Textarea
            id="notes"
            placeholder="Add context or questions for the team..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handlePinToChat} 
            disabled={isSubmitting}
            className="gap-2"
          >
            <MessageSquareText className="h-4 w-4" />
            Pin to Team Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
