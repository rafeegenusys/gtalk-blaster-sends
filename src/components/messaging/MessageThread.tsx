import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Send, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { OpenInternalThread } from './OpenInternalThread';

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  type: "incoming" | "outgoing";
  status?: "sent" | "delivered" | "read" | "scheduled";
  scheduledTime?: string;
  scheduled?: boolean;
  cancelIfResponse?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  lastMessageTime: string;
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
  onOpenInternalThread?: (messageId: string) => void;
}

export function MessageThread({ 
  activeContact, 
  messages, 
  onSendMessage,
  onOpenInternalThread,
  showBackButton 
}: MessageThreadProps) {
  const [messageText, setMessageText] = useState("");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [scheduleCancelIfResponse, setScheduleCancelIfResponse] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSchedule = () => {
    if (selectedDate) {
      onSendMessage(messageText, selectedDate, scheduleCancelIfResponse);
      setMessageText("");
      setSelectedDate(undefined);
      setIsPickerOpen(false);
      setScheduleCancelIfResponse(false);
    }
  };

  const handleSend = () => {
    onSendMessage(messageText);
    setMessageText("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        {showBackButton && (
          <Button variant="ghost" size="sm" onClick={onBackClick} className="absolute top-2 left-2">
            Back
          </Button>
        )}
        <h2 className="text-lg font-semibold text-center">
          {activeContact ? (activeContact.name || activeContact.phone) : "New Message"}
        </h2>
        {activeContact && activeContact.company && (
          <p className="text-center text-muted-foreground text-sm">{activeContact.company}</p>
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
            <Avatar className="h-8 w-8">
              <AvatarFallback>{activeContact?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div
                className={cn(
                  "rounded-lg px-3 py-2",
                  message.type === "outgoing" ? "bg-primary text-primary-foreground" : "bg-secondary"
                )}
              >
                <p className="text-sm break-words">{message.content}</p>
              </div>
              <div className="text-xs text-muted-foreground mt-1 text-right">
                {message.scheduledTime || message.timestamp}
                {message.status && (
                  <>
                    {" "}
                    ({message.status})
                  </>
                )}
              </div>
            </div>
            
            {message.type === "incoming" && onOpenInternalThread && (
              <OpenInternalThread
                messageId={message.id}
                onOpenThread={onOpenInternalThread}
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="grid gap-6 p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
                {selectedDate && (
                  <div className="space-y-2">
                    <p>
                      Schedule message for:{" "}
                      {format(selectedDate, "PPP p")}
                    </p>
                    <label
                      htmlFor="cancelIfResponse"
                      className="inline-flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        id="cancelIfResponse"
                        className="rounded-sm border-gray-200 text-primary focus:ring-primary"
                        checked={scheduleCancelIfResponse}
                        onChange={(e) => setScheduleCancelIfResponse(e.target.checked)}
                      />
                      <span>Cancel if they respond before this time</span>
                    </label>
                    <Button size="sm" onClick={handleSchedule}>
                      Schedule Message
                    </Button>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
          <Button onClick={handleSend} disabled={!messageText.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
