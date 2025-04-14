
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeamMentions } from "./TeamMentions";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read_status: boolean;
  media_url?: string;
  sender_name?: string;
  mentions?: string[];
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

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
          .single();
        
        if (!profileData?.business_id) return;
        
        // Get messages
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('business_id', profileData.business_id)
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
          .eq('business_id', profileData.business_id);
          
        if (teamData) {
          const mappedTeamMembers: TeamMember[] = teamData.map(member => ({
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
    let businessId: string | null = null;
    
    const fetchBusinessId = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('business_id')
        .eq('id', user.id)
        .single();
      
      businessId = data?.business_id || null;
      
      if (!businessId) return;
      
      const channel = supabase
        .channel('chat-messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `business_id=eq.${businessId}`,
          },
          async (payload) => {
            const newMessage = payload.new as Message;
            
            // Fetch sender name if not in users map
            if (!users[newMessage.sender_id]) {
              const { data } = await supabase
                .from('profiles')
                .select('full_name, email')
                .eq('id', newMessage.sender_id)
                .single();
              
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
    };
    
    fetchBusinessId();
    
    return () => {
      // Cleanup is handled by the returned function from fetchBusinessId
    };
  }, [user, toast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMention = (userId: string) => {
    toast({
      title: "Mention sent",
      description: `Notification sent to the mentioned team member.`,
    });
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage(prev => prev + emoji.native);
  };

  const handleSend = async () => {
    if (!user || !message.trim()) return;
    
    try {
      // Extract mentions from message
      const mentionRegex = /@(\w+)/g;
      const mentions = [...message.matchAll(mentionRegex)].map(match => match[1]);
      
      // Get business ID
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('business_id')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      
      // Send message with mentions
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          content: message.trim(),
          sender_id: user.id,
          business_id: profileData?.business_id,
          mentions: mentions
        });
      
      if (error) throw error;
      
      // Reset input
      setMessage("");
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="text-center text-muted-foreground">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-muted-foreground">No messages yet</div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={cn(
                  "flex items-start gap-2",
                  msg.sender_id === user?.id ? "flex-row-reverse" : "flex-row"
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={msg.sender_name ? undefined : undefined} />
                  <AvatarFallback>
                    {(users[msg.sender_id]?.name || 'U').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div 
                  className={cn(
                    "max-w-[80%] rounded-lg p-3",
                    msg.sender_id === user?.id 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary"
                  )}
                >
                  <div className="text-xs mb-1 flex justify-between items-center">
                    <span>{users[msg.sender_id]?.name || 'Unknown User'}</span>
                    <span className="text-xs opacity-70">
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="break-words">
                    {msg.content.split(/((@\w+))/g).map((part, i) => (
                      part.startsWith('@') ? (
                        <span key={i} className="bg-primary/20 rounded px-1">{part}</span>
                      ) : part
                    ))}
                  </div>
                  {msg.media_url && (
                    <a 
                      href={msg.media_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-500 hover:underline flex items-center gap-1 mt-2"
                    >
                      <Paperclip className="h-4 w-4" />
                      View attachment
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t p-4 space-y-4">
          <TeamMentions
            value={message}
            onChange={setMessage}
            onMention={handleMention}
            teamMembers={teamMembers}
          />
          
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Smile className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Picker
                  data={data}
                  onEmojiSelect={handleEmojiSelect}
                  theme="light"
                />
              </PopoverContent>
            </Popover>
            
            <Button
              onClick={handleSend}
              disabled={!message.trim()}
              className="ml-auto"
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
