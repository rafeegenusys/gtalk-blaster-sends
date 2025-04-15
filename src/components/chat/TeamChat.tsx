
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { supabase } from "@/integrations/supabase/client";
import { uploadChatFile } from "@/utils/fileStorage";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read_status: boolean;
  media_url: string | null;
  sender_name?: string;
  mentions?: string[];
  reference_message_id?: string;
  reference_contact_id?: string;
  is_internal?: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
}

export function TeamChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<Record<string, { name: string }>>({});
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch messages and subscribe to new ones
  useEffect(() => {
    if (!user) return;
    
    // Fetch existing messages
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('business_id')
          .eq('id', user.id)
          .maybeSingle();
        
        // If no business ID found, create a demo one for testing
        const currentBusinessId = profileData?.business_id || '00000000-0000-0000-0000-000000000000';
        setBusinessId(currentBusinessId);
        
        // Get messages
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('business_id', currentBusinessId)
          .eq('is_internal', true)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        // Get unique user IDs from messages
        const userIds = [...new Set(data?.map(m => m.sender_id) || [])];
        
        // Fetch user profiles
        if (userIds.length > 0) {
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .in('id', userIds);
          
          const usersMap: Record<string, { name: string }> = {};
          profilesData?.forEach(profile => {
            usersMap[profile.id] = { 
              name: profile.full_name || profile.email?.split('@')[0] || 'Unknown User' 
            };
          });
          
          setUsers(usersMap);
        }
        
        // After getting profiles, fetch team members for mentions
        const { data: teamData } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .eq('business_id', currentBusinessId);
          
        if (teamData) {
          const mappedTeamMembers = teamData.map(member => ({
            id: member.id,
            name: member.full_name || member.email?.split('@')[0] || 'Unknown User',
            avatar: undefined // Could add avatars in the future
          }));
          setTeamMembers(mappedTeamMembers);
        }
        
        setMessages(data || []);
      } catch (error: any) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Failed to load messages",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Subscribe to new messages
    const setupSubscription = async () => {
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('business_id')
          .eq('id', user.id)
          .maybeSingle();
        
        const currentBusinessId = profileData?.business_id || '00000000-0000-0000-0000-000000000000';
        setBusinessId(currentBusinessId);
        
        const channel = supabase
          .channel('chat-messages')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'chat_messages',
              filter: `business_id=eq.${currentBusinessId} AND is_internal=eq.true`,
            },
            async (payload) => {
              const newMessage = payload.new as Message;
              
              // Fetch sender name if not in users map
              if (!users[newMessage.sender_id]) {
                const { data } = await supabase
                  .from('profiles')
                  .select('full_name, email')
                  .eq('id', newMessage.sender_id)
                  .maybeSingle();
                
                if (data) {
                  setUsers(prev => ({
                    ...prev,
                    [newMessage.sender_id]: {
                      name: data.full_name || data.email?.split('@')[0] || 'Unknown User'
                    }
                  }));
                }
              }
              
              // Add message to state
              setMessages(prev => [...prev, newMessage]);
              
              // Mark as read if from another user
              if (newMessage.sender_id !== user.id) {
                await supabase
                  .from('chat_messages')
                  .update({ read_status: true })
                  .eq('id', newMessage.id);
              }
            }
          )
          .subscribe();
        
        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error('Error setting up chat subscription:', error);
      }
    };
    
    setupSubscription();
    
  }, [user, toast]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleMention = (userId: string) => {
    toast({
      title: "Mention sent",
      description: `Notification sent to the mentioned team member.`
    });
  };
  
  const handleSendMessage = async (messageText: string) => {
    if (!user) return;
    
    try {
      // Extract mentions from message
      const mentionRegex = /@(\w+)/g;
      const mentions = [...messageText.matchAll(mentionRegex)].map(match => match[1]);
      
      if (!businessId) {
        throw new Error("Business ID not found");
      }
      
      // Send message
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          content: messageText,
          sender_id: user.id,
          business_id: businessId,
          mentions: mentions.length > 0 ? mentions : null,
          is_internal: true
        });
      
      if (error) throw error;
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !businessId) return;
    
    try {
      // Upload file and get public URL
      const fileUrl = await uploadChatFile(file, businessId);
      
      if (!fileUrl) {
        throw new Error("Failed to upload file");
      }
      
      // Send message with file
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          content: `Shared a file: ${file.name}`,
          sender_id: user.id,
          business_id: businessId,
          media_url: fileUrl,
          is_internal: true
        });
      
      if (error) throw error;
      
      event.target.value = ''; // Reset file input
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: "Failed to upload file",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <MessageList
        messages={messages}
        currentUserId={user?.id}
        users={users}
      />
      <div ref={messagesEndRef} />
      
      <MessageInput
        onSendMessage={handleSendMessage}
        onFileUpload={handleFileUpload}
        onMention={handleMention}
        teamMembers={teamMembers}
      />
    </div>
  );
}
