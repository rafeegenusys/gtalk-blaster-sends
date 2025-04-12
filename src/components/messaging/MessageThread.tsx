
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Contact } from "./ContactList";
import {
  Archive,
  Calendar,
  ChevronLeft,
  Clock,
  Copy,
  Flag,
  Image,
  Info,
  MessageSquare,
  MoreVertical,
  Paperclip,
  Phone,
  Send,
  Smile,
  Sparkles,
  Star,
  Trash,
  UserPlus
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export type Message = {
  id: string;
  content: string;
  timestamp: string;
  type: "incoming" | "outgoing";
  status?: "sent" | "delivered" | "read" | "failed" | "scheduled";
  scheduledTime?: string;
};

interface MessageThreadProps {
  activeContact: Contact | null;
  messages: Message[];
  onSendMessage: (text: string, scheduledTime?: Date) => void;
  onBackClick?: () => void;
  showBackButton?: boolean;
}

export function MessageThread({
  activeContact,
  messages,
  onSendMessage,
  onBackClick,
  showBackButton = false,
}: MessageThreadProps) {
  const [messageText, setMessageText] = useState("");
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [scheduledTime, setScheduledTime] = useState<string>("08:00");
  const [timezone, setTimezone] = useState("America/New_York");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Calculate character count and SMS segments
  const charCount = messageText.length;
  const smsSegments = Math.ceil(charCount / 160) || 1;

  // AI suggestion templates
  const aiSuggestions = [
    "Thanks for reaching out! I'll get back to you shortly.",
    "I appreciate your message. Let me check and respond as soon as possible.",
    "Thanks for your inquiry. Would you like to schedule a call to discuss further?",
    "Got it! I'll take care of this right away.",
  ];

  // Message templates
  const messageTemplates = [
    "Hi there! How can I help you today?",
    "Thank you for your interest in our services.",
    "We've received your message and will respond shortly.",
    "Please let me know if you have any further questions.",
  ];

  // Handle archive conversation
  const handleArchiveConversation = () => {
    toast({
      title: "Conversation archived",
      description: activeContact?.name 
        ? `Conversation with ${activeContact.name} has been archived` 
        : "Conversation has been archived"
    });
  };

  // Handle flag as important
  const handleFlagAsImportant = () => {
    toast({
      title: "Conversation flagged",
      description: "This conversation has been marked as important"
    });
  };

  // Handle add to group
  const handleAddToGroup = () => {
    toast({
      title: "Add to group",
      description: "Group selection feature will be available soon"
    });
  };

  // Handle delete conversation
  const handleDeleteConversation = () => {
    toast({
      title: "Conversation deleted",
      description: activeContact?.name 
        ? `Conversation with ${activeContact.name} has been deleted` 
        : "Conversation has been deleted"
    });
  };

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    if (showScheduler && scheduledDate) {
      // Combine date and time for scheduled message
      const [hours, minutes] = scheduledTime.split(':').map(Number);
      const scheduledDateTime = new Date(scheduledDate);
      scheduledDateTime.setHours(hours, minutes);
      
      onSendMessage(messageText, scheduledDateTime);
      toast({
        title: "Message scheduled",
        description: `Your message will be sent on ${scheduledDateTime.toLocaleString()}`,
      });
    } else {
      onSendMessage(messageText);
    }
    
    setMessageText("");
    setShowScheduler(false);
    setScheduledDate(undefined);
  };

  const handleCopyPhoneNumber = () => {
    if (activeContact?.phone) {
      navigator.clipboard.writeText(activeContact.phone);
      toast({
        title: "Phone number copied",
        description: `${activeContact.phone} has been copied to clipboard`,
      });
    }
  };

  const getStatusIcon = (message: Message) => {
    switch(message.status) {
      case "sent": return <Clock className="h-3 w-3 text-muted-foreground" />;
      case "delivered": return <MessageSquare className="h-3 w-3 text-muted-foreground" />;
      case "read": return <MessageSquare className="h-3 w-3 text-blue-500" />;
      case "failed": return <MessageSquare className="h-3 w-3 text-red-500" />;
      case "scheduled": return <Calendar className="h-3 w-3 text-yellow-500" />;
      default: return null;
    }
  };

  // Properly handle dialog closing
  const handleSelectAISuggestion = (suggestion: string) => {
    setMessageText(suggestion);
    const dialogElement = document.querySelector('[role="dialog"]');
    const closeButton = dialogElement?.querySelector('button[data-dismiss]') as HTMLButtonElement | undefined;
    if (closeButton) closeButton.click();
  };

  // Properly handle dialog closing for templates
  const handleSelectTemplate = (template: string) => {
    setMessageText(template);
    const dialogElement = document.querySelector('[role="dialog"]');
    const closeButton = dialogElement?.querySelector('button[data-dismiss]') as HTMLButtonElement | undefined;
    if (closeButton) closeButton.click();
  };

  const handleInsertEmoji = (emoji: string) => {
    setMessageText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleAttachmentClick = () => {
    toast({
      title: "Attachment feature",
      description: "This feature will be available soon",
    });
  };

  if (!activeContact) {
    return (
      <div className="flex-1 flex items-center justify-center text-center p-8">
        <div>
          <MessageSquare className="h-12 w-12 mb-4 mx-auto text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
          <p className="text-muted-foreground">
            Select a contact from the list to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-3 border-b flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={onBackClick}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {activeContact.name ? activeContact.name.charAt(0).toUpperCase() : <MessageSquare size={16} />}
          </div>
          
          <div>
            <h3 className="font-medium">
              {activeContact.name || "Unknown"}
            </h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer" onClick={handleCopyPhoneNumber}>
              {activeContact.phone}
              <Copy className="h-3 w-3" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" title="Call">
            <Phone className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" title="More">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleAddToGroup}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add to group
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleFlagAsImportant}>
                <Star className="h-4 w-4 mr-2" />
                Flag as important
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleArchiveConversation}>
                <Archive className="h-4 w-4 mr-2" />
                Archive conversation
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDeleteConversation} className="text-red-500">
                <Trash className="h-4 w-4 mr-2" />
                Delete conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4 bg-muted/10">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`mb-4 flex ${message.type === 'outgoing' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${message.type === 'outgoing' ? 'order-2' : 'order-1'}`}>
              <div className={`p-3 rounded-2xl ${
                message.type === 'outgoing' 
                  ? 'bg-primary text-primary-foreground rounded-tr-none' 
                  : 'bg-muted rounded-tl-none'
              }`}>
                <p>{message.content}</p>
              </div>
              
              <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                message.type === 'outgoing' ? 'justify-end' : 'justify-start'
              }`}>
                {message.status === "scheduled" && message.scheduledTime && (
                  <span className="text-yellow-500 mr-1">Scheduled for {message.scheduledTime}</span>
                )}
                <span>{message.timestamp}</span>
                {message.type === 'outgoing' && getStatusIcon(message)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>
      
      <div className="p-3 border-t">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs h-8">
                <Sparkles className="mr-1 h-3 w-3 text-primary" />
                AI Assist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>AI Response Suggestions</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 mt-2">
                {aiSuggestions.map((suggestion, index) => (
                  <div 
                    key={index} 
                    className="p-2 border rounded-md cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => handleSelectAISuggestion(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
              <DialogClose data-dismiss />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs h-8">
                Templates
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Message Templates</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 mt-2">
                {messageTemplates.map((template, index) => (
                  <div 
                    key={index} 
                    className="p-2 border rounded-md cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    {template}
                  </div>
                ))}
              </div>
              <DialogClose data-dismiss />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground"
            onClick={handleAttachmentClick}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground"
            onClick={handleAttachmentClick}
          >
            <Image className="h-4 w-4" />
          </Button>
          
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Smile className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" side="top">
              <div className="grid grid-cols-8 gap-1">
                {["😀", "😊", "😂", "🥰", "😍", "😎", "👍", "🙏", 
                "🎉", "💯", "⭐", "❤️", "🔥", "👏", "✅", "🤔",
                "👋", "👀", "💪", "🚀", "👌", "👍", "✨", "😁"].map(emoji => (
                  <button 
                    key={emoji} 
                    className="p-1 text-xl hover:bg-muted rounded cursor-pointer"
                    onClick={() => handleInsertEmoji(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <Input 
            placeholder="Type a message..." 
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="flex-1"
          />
          
          <Popover open={showScheduler} onOpenChange={setShowScheduler}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Clock className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0" side="top">
              <div className="p-3 border-b">
                <h4 className="font-medium">Schedule Message</h4>
              </div>
              
              <div className="px-3 py-2">
                <div className="space-y-2 mb-3">
                  <div 
                    className="p-2 border rounded-md cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      tomorrow.setHours(8, 0, 0, 0);
                      setScheduledDate(tomorrow);
                      setScheduledTime("08:00");
                    }}
                  >
                    Tomorrow morning 8 AM
                  </div>
                  <div 
                    className="p-2 border rounded-md cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      tomorrow.setHours(14, 0, 0, 0);
                      setScheduledDate(tomorrow);
                      setScheduledTime("14:00");
                    }}
                  >
                    Tomorrow afternoon 2 PM
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Custom Date & Time</p>
                  <CalendarComponent
                    mode="single"
                    selected={scheduledDate}
                    onSelect={setScheduledDate}
                    initialFocus
                  />
                  
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-32"
                    />
                    
                    <Select defaultValue={timezone} onValueChange={setTimezone}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="p-3 border-t flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {scheduledDate ? (
                    `Scheduled: ${scheduledDate.toLocaleDateString()} at ${scheduledTime}`
                  ) : (
                    "Select date and time"
                  )}
                </span>
                <Button 
                  size="sm"
                  disabled={!scheduledDate || !messageText.trim()}
                  onClick={handleSendMessage}
                >
                  Schedule
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            onClick={handleSendMessage}
            disabled={!messageText.trim() || (showScheduler && !scheduledDate)}
            size="icon" 
            className="text-white bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-muted-foreground">
            {charCount} characters • {smsSegments} credit{smsSegments !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
