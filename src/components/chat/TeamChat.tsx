import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Image, CheckCheck, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeamMentions } from "./TeamMentions";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read_status: boolean;
  media_url: string | null;
  sender_name?: string;
}

interface TeamMember {
  id: string;
  name: string;
}

export function TeamChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<Record<string, { name: string }>>({});
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [mentionSearch, setMentionSearch] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const mentionTriggerRef = useRef<HTMLDivElement>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch team members when component mounts
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const { data: profilesData, error } = await supabase
          .from('profiles')
          .select('id, full_name')
          .not('full_name', 'is', null);

        if (error) throw error;

        setTeamMembers(profilesData.map(profile => ({
          id: profile.id,
          name: profile.full_name || 'Unknown User'
        })));
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };

    fetchTeamMembers();
  }, []);

  // Handle message input including @mentions
  const handleMessageInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    
    // Check for @ mentions
    const lastAtSymbol = value.lastIndexOf('@', e.target.selectionStart);
    if (lastAtSymbol !== -1) {
      const textAfterAt = value.slice(lastAtSymbol + 1, e.target.selectionStart);
      if (textAfterAt.length > 0 && !textAfterAt.includes(' ')) {
        setMentionSearch(textAfterAt);
        setShowMentions(true);
        setCursorPosition(e.target.selectionStart);
        return;
      }
    }
    
    setShowMentions(false);
  };

  // Handle selecting a team member from mentions
  const handleSelectMention = (member: TeamMember) => {
    if (!textareaRef.current) return;
    
    const beforeMention = message.slice(0, message.lastIndexOf('@', cursorPosition));
    const afterMention = message.slice(cursorPosition);
    const newMessage = `${beforeMention}@${member.name} ${afterMention}`;
    
    setMessage(newMessage);
    setShowMentions(false);
    textareaRef.current.focus();
  };

  // Check for thread context when component mounts
  useEffect(() => {
    const threadContext = sessionStorage.getItem('threadContext');
    if (threadContext) {
      const context = JSON.parse(threadContext);
      // Add context message to the chat - FIX: removing argument since handleSend doesn't accept it directly
      handleSend();
      // Instead, set the message first and then call handleSend
      setMessage(`Referenced message from ${context.sender}:\n"${context.content}"`);
      sessionStorage.removeItem('threadContext');
    }
  }, []);

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
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = async () => {
    if (!user || !message.trim()) return;
    
    try {
      // Get business ID
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('business_id')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      if (!profileData?.business_id) {
        throw new Error('Business ID not found');
      }
      
      // Send message
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          content: message.trim(),
          sender_id: user.id,
          receiver_id: profileData.business_id, // Using business_id as the receiver for team chat
          business_id: profileData.business_id,
          read_status: false
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
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    
    try {
      // Get business ID
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('business_id')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      if (!profileData?.business_id) {
        throw new Error('Business ID not found');
      }
      
      // Upload file to storage
      const fileName = `${Date.now()}_${file.name}`;
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(`${profileData.business_id}/${fileName}`, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from('chat-files')
        .getPublicUrl(`${profileData.business_id}/${fileName}`);
      
      // Send message with file
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          content: `Shared a file: ${file.name}`,
          sender_id: user.id,
          receiver_id: profileData.business_id,
          business_id: profileData.business_id,
          media_url: publicUrl.publicUrl,
          read_status: false
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
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Team Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {loading ? (
            <div className="text-center text-gray-500">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500">No messages yet. Start a conversation!</div>
          ) : (
            messages.map((msg) => {
              const isCurrentUser = msg.sender_id === user?.id;
              const senderName = users[msg.sender_id]?.name || 'Unknown User';
              
              return (
                <div 
                  key={msg.id} 
                  className={cn(
                    "flex items-start gap-2",
                    isCurrentUser ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(senderName)}</AvatarFallback>
                  </Avatar>
                  <div 
                    className={cn(
                      "max-w-[80%] rounded-lg p-3",
                      isCurrentUser 
                        ? "bg-gtalk-primary text-white" 
                        : "bg-gray-100 text-gray-800"
                    )}
                  >
                    <div className="text-xs mb-1">
                      {isCurrentUser ? 'You' : senderName}
                    </div>
                    
                    <div>{msg.content}</div>
                    
                    {msg.media_url && (
                      <div className="mt-2">
                        <a 
                          href={msg.media_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-500 hover:underline flex items-center gap-1"
                        >
                          <Paperclip size={14} />
                          Download file
                        </a>
                      </div>
                    )}
                    
                    <div className="text-xs mt-1 flex justify-end items-center gap-1">
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {isCurrentUser && (
                        msg.read_status ? (
                          <CheckCheck size={14} className="text-blue-500" />
                        ) : (
                          <Check size={14} />
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="flex gap-2 relative">
          <TeamMentions
            isOpen={showMentions}
            onSelect={handleSelectMention}
            onOpenChange={setShowMentions}
            searchTerm={mentionSearch}
            teamMembers={teamMembers}
            triggerRef={mentionTriggerRef}
          />
          
          <label htmlFor="file-upload" className="cursor-pointer">
            <Button variant="outline" size="icon" type="button" className="h-10">
              <Paperclip size={18} />
            </Button>
            <input 
              id="file-upload" 
              type="file" 
              className="hidden" 
              onChange={handleFileUpload} 
            />
          </label>
          
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleMessageInput}
            placeholder="Type your message... Use @ to mention team members"
            className="min-h-10 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !showMentions) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          
          <Button 
            onClick={() => handleSend()} 
            className="bg-gtalk-primary hover:bg-gtalk-primary/90"
            disabled={!message.trim()}
          >
            <Send size={18} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
