
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface OpenInternalThreadProps {
  messageId: string;
  messageContent: string;
  contactId: string;
  contactName: string;
}

export function OpenInternalThread({ 
  messageId, 
  messageContent, 
  contactId, 
  contactName 
}: OpenInternalThreadProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenThread = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to open an internal thread.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Get user's business ID
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('business_id')
        .eq('id', user.id)
        .maybeSingle(); 
        
      if (profileError) throw profileError;
      
      if (!profileData || !profileData.business_id) {
        toast({
          title: "Profile setup required",
          description: "Your user profile or business ID is missing. Please contact support.",
          variant: "destructive"
        });
        return;
      }
      
      // Create internal thread message
      const { error: messageError } = await supabase
        .from('chat_messages')
        .insert({
          content: `Thread started about customer message: "${messageContent}"`,
          sender_id: user.id,
          business_id: profileData.business_id,
          reference_message_id: messageId,
          reference_contact_id: contactId,
          is_internal: true
        });
        
      if (messageError) throw messageError;
      
      toast({
        title: "Internal thread created",
        description: `A new thread about ${contactName}'s message has been started.`,
      });
      
    } catch (error: any) {
      console.error('Error creating internal thread:', error);
      toast({
        title: "Failed to create thread",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-muted-foreground hover:text-foreground" 
            onClick={handleOpenThread}
            disabled={isLoading}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Open internal thread with this message</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
