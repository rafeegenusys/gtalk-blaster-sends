
import { Dashboard } from "@/components/layout/Dashboard";
import { MessageComposer } from "@/components/messaging/MessageComposer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search, Filter, User, Users, Star, Tag, Paperclip, Calendar, FileText, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

type Contact = {
  id: string;
  name: string;
  phone: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unread?: boolean;
  tags?: string[];
  status?: "online" | "offline" | "away";
};

type MessageType = {
  id: string;
  sender: "user" | "contact";
  content: string;
  timestamp: string;
  attachments?: string[];
  notes?: string[];
};

const Messaging = () => {
  const [activeContact, setActiveContact] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Jane Smith",
      phone: "+1 (555) 123-4567",
      lastMessage: "I'll check and get back to you",
      lastMessageTime: "10:23 AM",
      unread: true,
      tags: ["Customer", "Priority"],
      status: "online"
    },
    {
      id: "2",
      name: "Michael Johnson",
      phone: "+1 (555) 987-6543",
      lastMessage: "Thanks for the update",
      lastMessageTime: "Yesterday",
      tags: ["Lead"],
      status: "away"
    },
    {
      id: "3",
      name: "Sarah Williams",
      phone: "+1 (555) 456-7890",
      lastMessage: "When can we schedule a call?",
      lastMessageTime: "Apr 10",
      tags: ["Prospect"],
      status: "offline"
    }
  ]);

  const [messages, setMessages] = useState<Record<string, MessageType[]>>({
    "1": [
      {
        id: "m1",
        sender: "contact",
        content: "Hi, I have a question about your product",
        timestamp: "10:20 AM",
      },
      {
        id: "m2",
        sender: "user",
        content: "Sure, how can I help you?",
        timestamp: "10:22 AM",
      },
      {
        id: "m3",
        sender: "contact",
        content: "I'll check and get back to you",
        timestamp: "10:23 AM",
      }
    ],
    "2": [
      {
        id: "m4",
        sender: "user",
        content: "Here's the update you requested",
        timestamp: "Yesterday",
        attachments: ["report.pdf"]
      },
      {
        id: "m5",
        sender: "contact",
        content: "Thanks for the update",
        timestamp: "Yesterday",
      }
    ],
    "3": [
      {
        id: "m6",
        sender: "contact",
        content: "I'm interested in your services",
        timestamp: "Apr 10",
      },
      {
        id: "m7",
        sender: "user",
        content: "Great! Do you have time for a quick call?",
        timestamp: "Apr 10",
      },
      {
        id: "m8",
        sender: "contact",
        content: "When can we schedule a call?",
        timestamp: "Apr 10",
      }
    ]
  });

  const [showNotes, setShowNotes] = useState(false);
  const [activeNote, setActiveNote] = useState("");
  
  const handleSendMessage = (message: string) => {
    if (!activeContact || !message.trim()) return;
    
    const newMessage = {
      id: `m${Date.now()}`,
      sender: "user" as const,
      content: message,
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };
    
    setMessages(prev => ({
      ...prev,
      [activeContact]: [...(prev[activeContact] || []), newMessage]
    }));
    
    // Update the contact's last message
    setContacts(prev => prev.map(contact => 
      contact.id === activeContact
        ? { ...contact, lastMessage: message, lastMessageTime: 'Just now', unread: false }
        : contact
    ));
  };

  const handleAddNote = () => {
    if (!activeContact || !activeNote.trim()) return;
    
    const lastMessageIndex = messages[activeContact].length - 1;
    const lastMessage = messages[activeContact][lastMessageIndex];
    
    const updatedMessage = {
      ...lastMessage,
      notes: [...(lastMessage.notes || []), activeNote]
    };
    
    const updatedMessages = [...messages[activeContact]];
    updatedMessages[lastMessageIndex] = updatedMessage;
    
    setMessages(prev => ({
      ...prev,
      [activeContact]: updatedMessages
    }));
    
    setActiveNote("");
  };

  const handleAddTag = (contactId: string, tag: string) => {
    setContacts(prev => prev.map(contact => 
      contact.id === contactId
        ? { ...contact, tags: [...(contact.tags || []), tag] }
        : contact
    ));
  };

  const handleRemoveTag = (contactId: string, tagToRemove: string) => {
    setContacts(prev => prev.map(contact => 
      contact.id === contactId
        ? { ...contact, tags: (contact.tags || []).filter(tag => tag !== tagToRemove) }
        : contact
    ));
  };

  return (
    <Dashboard title="Messaging">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-9rem)]">
        {/* Left sidebar - Contacts */}
        <div className="md:col-span-1 flex flex-col border rounded-md overflow-hidden">
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center gap-2 mb-4">
              <Input 
                placeholder="Search conversations..." 
                className="h-9"
              />
              <Button variant="outline" size="icon" title="Filter">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <Tabs defaultValue="all">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
                <TabsTrigger value="flagged" className="flex-1">Flagged</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {contacts.map(contact => (
              <ContextMenu key={contact.id}>
                <ContextMenuTrigger>
                  <div 
                    className={`p-3 border-b cursor-pointer hover:bg-muted/50 ${activeContact === contact.id ? 'bg-muted' : ''} ${contact.unread ? 'font-medium' : ''}`}
                    onClick={() => setActiveContact(contact.id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${
                          contact.status === 'online' ? 'bg-green-500' : 
                          contact.status === 'away' ? 'bg-yellow-500' : 'bg-gray-300'
                        }`} />
                        <span className="font-medium">{contact.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {contact.lastMessageTime}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground truncate mb-1">
                      {contact.lastMessage}
                    </div>
                    {contact.tags && contact.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {contact.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onSelect={() => handleAddTag(contact.id, "Priority")}>
                    <Star className="mr-2 h-4 w-4" /> Mark as Priority
                  </ContextMenuItem>
                  <ContextMenuItem onSelect={() => handleAddTag(contact.id, "Follow up")}>
                    <Tag className="mr-2 h-4 w-4" /> Add "Follow up" Tag
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <User className="mr-2 h-4 w-4" /> View Profile
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <Users className="mr-2 h-4 w-4" /> Add to Group
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </div>
        </div>
        
        {/* Middle - Messages */}
        <div className="md:col-span-1 flex flex-col border rounded-md overflow-hidden">
          {activeContact ? (
            <>
              <div className="p-4 border-b bg-muted/30">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">
                      {contacts.find(c => c.id === activeContact)?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {contacts.find(c => c.id === activeContact)?.phone}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" title="Search Messages">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="View Profile">
                      <User className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="More Options">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-more-vertical"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto bg-muted/20">
                {messages[activeContact]?.map(message => (
                  <div key={message.id} className={`mb-4 ${message.sender === 'user' ? 'ml-auto' : 'mr-auto'} max-w-[70%]`}>
                    <div className={`p-3 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      {message.content}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 flex items-center gap-2 text-sm">
                          <Paperclip className="h-3 w-3" />
                          {message.attachments.map((attachment, i) => (
                            <span key={i} className="underline">{attachment}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp}
                      </span>
                      {message.sender === 'user' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 text-xs"
                          onClick={() => setShowNotes(!showNotes)}
                        >
                          {message.notes?.length ? `Notes (${message.notes.length})` : "Add note"}
                        </Button>
                      )}
                    </div>
                    {showNotes && message.sender === 'user' && (
                      <div className="mt-1 pl-2 border-l-2 border-yellow-400">
                        {message.notes?.map((note, i) => (
                          <div key={i} className="text-sm text-muted-foreground bg-yellow-50 p-1 rounded mb-1">
                            {note}
                          </div>
                        ))}
                        <div className="flex gap-2 mt-1">
                          <Input 
                            placeholder="Add private team note..." 
                            className="h-7 text-xs"
                            value={activeNote}
                            onChange={(e) => setActiveNote(e.target.value)}
                          />
                          <Button 
                            size="sm" 
                            className="h-7" 
                            onClick={handleAddNote}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
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
        
        {/* Right sidebar - Message composer */}
        <div className="md:col-span-1 flex flex-col">
          {activeContact ? (
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle>New Message</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex gap-2 mb-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Paperclip className="h-4 w-4" /> Attach
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <FileText className="h-4 w-4" /> Template
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <MessageSquare className="h-4 w-4" /> AI Response
                  </Button>
                </div>
                <div className="flex gap-2 mb-4">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Calendar className="h-4 w-4" /> Schedule
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Tag className="h-4 w-4" /> Tag Customer
                  </Button>
                </div>
                <div className="flex-1">
                  <MessageComposer />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Message Composer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Select a contact to start composing a message
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Dashboard>
  );
};

export default Messaging;
