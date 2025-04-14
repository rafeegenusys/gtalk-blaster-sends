import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { 
  MoreHorizontal, 
  Paperclip, 
  Redo, 
  Reply, 
  ThumbsDown, 
  ThumbsUp,
  Clock,
  Check,
  CheckCheck
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PinToChat } from "@/components/messaging/PinToChat";
import { OpenInternalThread } from "./OpenInternalThread";

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  type: "incoming" | "outgoing";
  status?: "sent" | "delivered" | "read" | "scheduled" | "failed";
  scheduledTime?: string;
  cancelIfResponse?: boolean;
}

// Update Contact interface to align with ContactList.tsx
export interface Contact {
  id: string;
  name: string;
  phone: string;
  lastMessage?: string; // Make this optional to match ContactList
  lastMessageTime?: string; // Make this optional to match ContactList
  unread?: boolean;
  status?: "online" | "offline" | "away";
  missedCall?: boolean;
  company?: string;
  email?: string;
  notes?: string;
}

interface MessageThreadProps {
  activeContact: Contact | null;
  messages: Message[];
  onSendMessage: (text: string, scheduledTime?: Date, cancelIfResponse?: boolean) => void;
  onBackClick?: () => void;
  showBackButton?: boolean;
}

export function MessageThread({ 
  activeContact, 
  messages, 
  onSendMessage, 
  onBackClick,
  showBackButton
}: MessageThreadProps) {
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to the bottom of the message thread when messages change
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (text.trim()) {
        onSendMessage(text);
        setText("");
      }
    }
  };

  const handleSchedule = (cancelIfResponse: boolean) => {
    // Open a modal or date picker to select the date and time
    // For simplicity, let's use a prompt
    const scheduledTimeStr = prompt("Enter scheduled time (YYYY-MM-DD HH:MM):");
    
    if (scheduledTimeStr) {
      const scheduledTime = new Date(scheduledTimeStr);
      if (isNaN(scheduledTime.getTime())) {
        toast({
          title: "Invalid date",
          description: "Please enter a valid date and time in YYYY-MM-DD HH:MM format.",
          variant: "destructive",
        });
        return;
      }
      
      onSendMessage(text, scheduledTime, cancelIfResponse);
      setText("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="border-b p-4 flex items-center">
        {showBackButton && (
          <Button variant="ghost" size="sm" onClick={onBackClick} className="mr-2">
            ← Back
          </Button>
        )}
        {activeContact ? (
          <>
            <Avatar className="mr-2 h-8 w-8">
              <AvatarImage src={`https://avatar.vercel.sh/${activeContact.name}.png`} />
              <AvatarFallback>{activeContact.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{activeContact.name || activeContact.phone}</div>
              <div className="text-sm text-muted-foreground">
                {activeContact.status === "online" && <span className="mr-1">Online</span>}
                {activeContact.status === "away" && <span className="mr-1">Away</span>}
                {activeContact.status === "offline" && <span className="mr-1">Offline</span>}
                {activeContact.company && <span>{activeContact.company}</span>}
              </div>
            </div>
          </>
        ) : (
          <div className="font-semibold">No Contact Selected</div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-start gap-2",
              message.type === "outgoing" ? "flex-row-reverse" : "flex-row"
            )}
          >
            {/* Avatar */}
            {message.type === "incoming" && (
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://avatar.vercel.sh/${activeContact?.name}.png`} />
                <AvatarFallback>{activeContact?.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
            )}
            
            {/* Message Content */}
            <div className="flex flex-col">
              <div
                className={cn(
                  "rounded-lg p-3 text-sm w-fit max-w-[calc(100%-2rem)]",
                  message.type === "outgoing"
                    ? "bg-gtalk-primary text-white"
                    : "bg-gray-100 text-gray-800"
                )}
              >
                {message.content}
                {message.scheduledTime && (
                  <div className="mt-1 text-xs text-gray-400">
                    Scheduled for {message.scheduledTime}
                  </div>
                )}
              </div>
              
              {/* Message Actions */}
              <div className="mt-1 flex items-center text-xs text-gray-500">
                {message.type === "outgoing" && message.status && (
                  <span className="mr-2">
                    {message.status === "sent" && "Sent"}
                    {message.status === "delivered" && "Delivered"}
                    {message.status === "read" && "Read"}
                    {message.status === "scheduled" && "Scheduled"}
                    {message.status === "failed" && "Failed"}
                  </span>
                )}
                
                {message.status === "scheduled" && (
                  <Clock className="h-3 w-3 mr-1" />
                )}
                
                {message.status === "delivered" && (
                  <CheckCheck className="h-3 w-3 mr-1" />
                )}
                
                {message.status === "read" && (
                  <CheckCheck className="h-3 w-3 mr-1 text-blue-500" />
                )}
                
                {message.status !== "scheduled" && (
                  <span>{message.timestamp}</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {message.type === "incoming" && (
                <OpenInternalThread 
                  message={message} 
                  contactName={activeContact?.name}
                />
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Reply className="h-4 w-4 mr-2" /> Reply
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Redo className="h-4 w-4 mr-2" /> Forward
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <ThumbsUp className="h-4 w-4 mr-2" /> Thumbs Up
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ThumbsDown className="h-4 w-4 mr-2" /> Thumbs Down
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <PinToChat message={message} contactName={activeContact?.name} contactPhone={activeContact?.phone} />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      
      {/* Message Composer */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Type your message here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button onClick={() => {
              if (text.trim()) {
                onSendMessage(text);
                setText("");
              }
            }}
            disabled={!text.trim()}
          >
            Send
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Schedule</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSchedule(false)}>
                Schedule Message
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSchedule(true)}>
                Schedule & Cancel on Reply
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
