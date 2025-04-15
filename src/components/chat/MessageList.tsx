
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
  users: Record<string, { name: string }>;
}

export function MessageList({ messages, currentUserId, users }: MessageListProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-muted-foreground">No messages yet. Start a conversation!</div>
      ) : (
        messages.map((msg) => {
          const isCurrentUser = msg.sender_id === currentUserId;
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
                <AvatarImage />
                <AvatarFallback>{getInitials(senderName)}</AvatarFallback>
              </Avatar>
              <div 
                className={cn(
                  "max-w-[80%] rounded-lg p-3",
                  isCurrentUser 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary"
                )}
              >
                <div className="text-xs mb-1 flex justify-between items-center">
                  <span>{senderName}</span>
                  <span className="text-xs opacity-70">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                <div className="break-words">
                  {msg.content.split(/((@\w+))/g).map((part, i) => 
                    part.startsWith('@') ? (
                      <span key={i} className="bg-primary/20 rounded px-1">{part}</span>
                    ) : part
                  )}
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
                
                {msg.reference_message_id && (
                  <div className="mt-2 text-xs italic border-l-2 pl-2 border-primary/50">
                    Thread related to customer message
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
