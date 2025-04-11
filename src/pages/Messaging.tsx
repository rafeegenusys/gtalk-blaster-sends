
import { useState } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Phone, 
  MessageSquare, 
  Search, 
  User, 
  Star, 
  Tag, 
  X, 
  Send, 
  Paperclip, 
  ChevronLeft,
  Circle,
  MoreVertical,
  Clock,
  CheckCheck
} from "lucide-react";

type Contact = {
  id: string;
  name: string;
  phone: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unread?: boolean;
  missedCall?: boolean;
  status?: "online" | "offline" | "away";
  company?: string;
  email?: string;
  notes?: string;
};

type Message = {
  id: string;
  content: string;
  timestamp: string;
  type: "incoming" | "outgoing";
  status?: "sent" | "delivered" | "read" | "failed";
};

const Messaging = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [messageText, setMessageText] = useState("");
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [contactNote, setContactNote] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Jane Smith",
      phone: "+1 (555) 123-4567",
      lastMessage: "I'll check and get back to you",
      lastMessageTime: "10:23 AM",
      unread: true,
      company: "Acme Inc.",
      email: "jane@acme.com",
      notes: "Previous customer, interested in new product line"
    },
    {
      id: "2",
      name: "Michael Johnson",
      phone: "+1 (555) 987-6543",
      lastMessage: "Thanks for the update",
      lastMessageTime: "Yesterday",
      status: "away",
      missedCall: true,
      company: "XYZ Corp",
      email: "michael@xyz.com"
    },
    {
      id: "3",
      name: "Sarah Williams",
      phone: "+1 (555) 456-7890",
      lastMessage: "When can we schedule a call?",
      lastMessageTime: "Apr 10",
      status: "offline",
      company: "ABC Enterprises",
      email: "sarah@abc.com",
      notes: "Follow up about pricing options"
    },
    {
      id: "4",
      phone: "+1 (555) 222-3333",
      lastMessage: "Hello, is this GTalk support?",
      lastMessageTime: "Apr 9",
      unread: true,
      name: "",
    },
    {
      id: "5",
      name: "David Chen",
      phone: "+1 (555) 444-5555",
      lastMessage: "Looking forward to our meeting",
      lastMessageTime: "Apr 8",
      status: "online"
    }
  ]);

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    "1": [
      { id: "m1", content: "Hi, I have a question about your product", timestamp: "10:20 AM", type: "incoming" },
      { id: "m2", content: "Sure, how can I help you?", timestamp: "10:22 AM", type: "outgoing", status: "read" },
      { id: "m3", content: "I'll check and get back to you", timestamp: "10:23 AM", type: "incoming" }
    ],
    "2": [
      { id: "m4", content: "Here's the update you requested", timestamp: "Yesterday", type: "outgoing", status: "delivered" },
      { id: "m5", content: "Thanks for the update", timestamp: "Yesterday", type: "incoming" }
    ],
    "3": [
      { id: "m6", content: "I'm interested in your services", timestamp: "Apr 10", type: "incoming" },
      { id: "m7", content: "Great! Do you have time for a quick call?", timestamp: "Apr 10", type: "outgoing", status: "read" },
      { id: "m8", content: "When can we schedule a call?", timestamp: "Apr 10", type: "incoming" }
    ],
    "4": [
      { id: "m9", content: "Hello, is this GTalk support?", timestamp: "Apr 9", type: "incoming" }
    ],
    "5": [
      { id: "m10", content: "Hi David, just confirming our meeting tomorrow at 2pm", timestamp: "Apr 8", type: "outgoing", status: "delivered" },
      { id: "m11", content: "Looking forward to our meeting", timestamp: "Apr 8", type: "incoming" }
    ]
  });

  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!activeContact || !messageText.trim()) return;
    
    const newMessage = {
      id: `m${Date.now()}`,
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      type: "outgoing" as const,
      status: "sent" as const
    };
    
    setMessages(prev => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMessage]
    }));
    
    // Update the contact's last message
    setContacts(prev => prev.map(contact => 
      contact.id === activeContact.id
        ? { ...contact, lastMessage: messageText, lastMessageTime: 'Just now', unread: false }
        : contact
    ));
    
    setMessageText("");
    
    // Simulate message delivered after a delay
    setTimeout(() => {
      setMessages(prev => {
        const contactMessages = [...prev[activeContact.id]];
        const lastIndex = contactMessages.length - 1;
        
        contactMessages[lastIndex] = {
          ...contactMessages[lastIndex],
          status: "delivered"
        };
        
        return {
          ...prev,
          [activeContact.id]: contactMessages
        };
      });
    }, 1500);
  };

  const handleUpdateContact = () => {
    if (!activeContact) return;
    
    const updatedContact = {
      ...activeContact,
      notes: contactNote
    };
    
    setContacts(prev => prev.map(contact => 
      contact.id === activeContact.id ? updatedContact : contact
    ));
    
    setActiveContact(updatedContact);
    
    toast({
      title: "Contact updated",
      description: "Contact notes have been saved",
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredContacts = contacts.filter(contact => 
    (contact.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
    contact.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (message: Message) => {
    switch(message.status) {
      case "sent": return <Clock className="h-3 w-3 text-muted-foreground" />;
      case "delivered": return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case "read": return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case "failed": return <X className="h-3 w-3 text-red-500" />;
      default: return null;
    }
  };

  return (
    <Dashboard title="Messaging">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0 h-[calc(100vh-9rem)] border rounded-md overflow-hidden bg-background">
        {/* Left Column - Contacts */}
        <div className="md:col-span-3 border-r">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search messages..." 
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-8"
              />
            </div>
          </div>
          
          <ScrollArea className="h-[calc(100%-56px)]">
            {filteredContacts.map(contact => (
              <div 
                key={contact.id}
                className={`p-3 border-b cursor-pointer hover:bg-muted/30 transition-colors ${activeContact?.id === contact.id ? 'bg-muted/50' : ''}`}
                onClick={() => setActiveContact(contact)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {contact.name ? contact.name.charAt(0).toUpperCase() : <User size={18} />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <span className={`font-medium truncate ${contact.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {contact.name || contact.phone}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {contact.lastMessageTime}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {contact.missedCall && (
                        <Phone className="h-3 w-3 text-red-500" />
                      )}
                      
                      <p className={`text-sm truncate ${contact.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {contact.lastMessage}
                      </p>
                    </div>
                    
                    {contact.unread && (
                      <div className="mt-1">
                        <Circle className="h-2 w-2 fill-primary text-primary" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
        
        {/* Middle Column - Messages */}
        <div className="md:col-span-5 border-r flex flex-col">
          {activeContact ? (
            <>
              <div className="p-3 border-b flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden"
                    onClick={() => setActiveContact(null)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {activeContact.name ? activeContact.name.charAt(0).toUpperCase() : <User size={16} />}
                  </div>
                  
                  <div>
                    <h3 className="font-medium">
                      {activeContact.name || "Unknown"}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {activeContact.phone}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" title="Call">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="More">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <ScrollArea className="flex-1 p-4 bg-muted/10">
                {messages[activeContact.id]?.map((message) => (
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
                        <span>{message.timestamp}</span>
                        {message.type === 'outgoing' && getStatusIcon(message)}
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              
              <div className="p-3 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  
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
                  
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    size="icon" 
                    className="text-white bg-primary hover:bg-primary/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <MessageSquare className="h-12 w-12 mb-4 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
                <p className="text-muted-foreground">
                  Select a contact from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Right Column - Contact Details */}
        <div className="hidden md:block md:col-span-4">
          {activeContact ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b bg-muted/20">
                <h3 className="font-medium text-lg">Contact Details</h3>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Basic Info</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Name</label>
                        <Input 
                          value={activeContact.name || ''} 
                          placeholder="Add name" 
                          onChange={(e) => setActiveContact({...activeContact, name: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Phone</label>
                        <Input value={activeContact.phone} readOnly />
                      </div>
                      
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Company</label>
                        <Input 
                          value={activeContact.company || ''} 
                          placeholder="Add company" 
                          onChange={(e) => setActiveContact({...activeContact, company: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Email</label>
                        <Input 
                          value={activeContact.email || ''} 
                          placeholder="Add email" 
                          onChange={(e) => setActiveContact({...activeContact, email: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Tags</h4>
                      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
                        <Tag className="h-3 w-3" /> Add Tag
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="gap-1 cursor-pointer hover:bg-muted">
                        Customer <X className="h-3 w-3" />
                      </Badge>
                      <Badge variant="outline" className="gap-1 cursor-pointer hover:bg-muted">
                        Follow-up <X className="h-3 w-3" />
                      </Badge>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-xs"
                        onClick={handleUpdateContact}
                      >
                        Save Notes
                      </Button>
                    </div>
                    
                    <Textarea 
                      placeholder="Add notes about this contact..." 
                      className="min-h-[120px]"
                      value={contactNote || activeContact.notes || ''}
                      onChange={(e) => setContactNote(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1 gap-1">
                      <Phone className="h-4 w-4" /> Call
                    </Button>
                    <Button variant="outline" className="flex-1 gap-1">
                      <Star className="h-4 w-4" /> Favorite
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <User className="h-12 w-12 mb-4 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No contact selected</h3>
                <p className="text-muted-foreground">
                  Select a conversation to view contact details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Dashboard>
  );
};

export default Messaging;
