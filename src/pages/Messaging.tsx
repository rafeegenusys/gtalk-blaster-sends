import { useState, useEffect, useRef } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { MessageFilters } from "@/components/messaging/MessageFilters";
import { ContactList, Contact } from "@/components/messaging/ContactList";
import { MessageThread, Message } from "@/components/messaging/MessageThread";
import { ContactDetails } from "@/components/messaging/ContactDetails";
import { NewMessage } from "@/components/messaging/NewMessage";
import { NotificationBell } from "@/components/messaging/NotificationBell";
import { 
  ChevronLeft,
  MessageSquare,
  PenSquare, 
  Plus, 
  User as UserIcon
} from "lucide-react";
import { PinToChat } from "@/components/messaging/PinToChat";
import { ActivityItem } from "@/components/dashboard/RecentActivity";

interface MessageWithPinning extends Message {
  isPinned?: boolean;
  cancelIfResponse?: boolean;
}

const Messaging = () => {
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
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

  const [messages, setMessages] = useState<Record<string, MessageWithPinning[]>>({
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
  const isMobile = useIsMobile();
  const [mobileView, setMobileView] = useState<'contacts' | 'conversation' | 'details'>('contacts');
  const welcomeToastShownRef = useRef(false);
  const initialRenderRef = useRef(true);

  useEffect(() => {
    initialRenderRef.current = false;
  }, []);

  // Handle the selected activity from dashboard
  useEffect(() => {
    const selectedActivityJson = sessionStorage.getItem('selectedActivity');
    
    if (selectedActivityJson) {
      // Clear the session storage item
      sessionStorage.removeItem('selectedActivity');
      
      try {
        const activity = JSON.parse(selectedActivityJson) as ActivityItem;
        handleActivityClick(activity);
      } catch (error) {
        console.error('Error parsing selected activity:', error);
      }
    }
  }, []);

  const handleTogglePin = (contactId: string, messageId: string) => {
    setMessages(prev => {
      const contactMessages = [...prev[contactId]];
      const messageIndex = contactMessages.findIndex(m => m.id === messageId);
      
      if (messageIndex !== -1) {
        contactMessages[messageIndex] = {
          ...contactMessages[messageIndex],
          isPinned: !contactMessages[messageIndex].isPinned
        };
      }
      
      return {
        ...prev,
        [contactId]: contactMessages
      };
    });
    
    toast({
      title: "Message pinned",
      description: "You can find this pinned message easily for reference",
    });
  };
  
  const handleSendMessage = (text: string, scheduledTime?: Date, cancelIfResponse?: boolean) => {
    if (!activeContact) return;
    
    const newMessage: MessageWithPinning = {
      id: `m${Date.now()}`,
      content: text,
      timestamp: scheduledTime 
        ? 'Scheduled' 
        : new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      type: "outgoing",
      status: scheduledTime ? "scheduled" : "sent"
    };
    
    if (scheduledTime) {
      newMessage.scheduledTime = scheduledTime.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      if (cancelIfResponse) {
        newMessage.cancelIfResponse = true;
      }
    }
    
    setMessages(prev => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), newMessage]
    }));
    
    setContacts(prev => prev.map(contact => 
      contact.id === activeContact.id
        ? { 
            ...contact, 
            lastMessage: text, 
            lastMessageTime: scheduledTime ? 'Scheduled' : 'Just now', 
            unread: false 
          }
        : contact
    ));
    
    if (!scheduledTime) {
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
    }
  };

  const handleContactUpdate = (updatedContact: Contact) => {
    setContacts(prev => prev.map(contact => 
      contact.id === updatedContact.id ? updatedContact : contact
    ));
    
    setActiveContact(updatedContact);
  };

  const handleNewMessageSend = (phoneNumber: string, message: string, scheduledTime?: Date, cancelIfResponse?: boolean) => {
    const existingContact = contacts.find(c => c.phone === phoneNumber);
    
    if (existingContact) {
      setActiveContact(existingContact);
      handleSendMessage(message, scheduledTime, cancelIfResponse);
    } else {
      const newContact: Contact = {
        id: `new-${Date.now()}`,
        name: "",
        phone: phoneNumber,
        lastMessage: message,
        lastMessageTime: "Just now"
      };
      
      setContacts(prev => [...prev, newContact]);
      
      setMessages(prev => ({
        ...prev,
        [newContact.id]: [{
          id: `m-new-${Date.now()}`,
          content: message,
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          type: "outgoing",
          status: "sent"
        }]
      }));
      
      setActiveContact(newContact);
    }
    
    setShowNewMessage(false);
    setMobileView('conversation');
    
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully",
    });
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const handleNewMessageClick = () => {
    setShowNewMessage(true);
    if (isMobile) {
      setMobileView('conversation');
    }
  };

  const renderMobileView = () => {
    if (showNewMessage) {
      return (
        <NewMessage 
          open={true}
          onOpenChange={setShowNewMessage}
          onSend={handleNewMessageSend} 
          onBack={() => {
            setShowNewMessage(false);
            setMobileView('contacts');
          }}
        />
      );
    }
    
    switch (mobileView) {
      case 'contacts':
        return (
          <div className="h-full flex flex-col">
            <div className="flex justify-between items-center p-3 border-b">
              <h2 className="font-semibold text-lg">Messages</h2>
              <div className="flex items-center gap-2">
                <NotificationBell />
                <Button 
                  size="icon" 
                  onClick={handleNewMessageClick}
                >
                  <PenSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <MessageFilters onFilterChange={handleFilterChange} />
            <ContactList
              contacts={contacts}
              activeContact={activeContact}
              setActiveContact={(contact) => {
                setActiveContact(contact);
                setMobileView('conversation');
              }}
              filter={selectedFilter}
            />
          </div>
        );
        
      case 'conversation':
        return (
          <MessageThread
            activeContact={activeContact}
            messages={activeContact ? messages[activeContact.id] || [] : []}
            onSendMessage={handleSendMessage}
            onBackClick={() => setMobileView('contacts')}
            showBackButton={true}
          />
        );
        
      case 'details':
        return activeContact ? (
          <div className="h-full flex flex-col">
            <div className="p-3 border-b flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => setMobileView('conversation')}
                className="mr-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-medium">Contact Details</h3>
            </div>
            <ContactDetails
              contact={activeContact}
              onContactUpdate={handleContactUpdate}
            />
          </div>
        ) : null;
    }
  };

  const handleActivityClick = (activity: ActivityItem) => {
    const contact = contacts.find(c => c.phone === activity.phone);
    
    if (contact) {
      setActiveContact(contact);
      if (isMobile) {
        setMobileView('conversation');
      }
    } else {
      const newContact: Contact = {
        id: `new-${Date.now()}`,
        name: activity.contact,
        phone: activity.phone,
        lastMessage: activity.message,
        lastMessageTime: activity.timestamp
      };
      
      setContacts(prev => [...prev, newContact]);
      setActiveContact(newContact);
      if (isMobile) {
        setMobileView('conversation');
      }
      
      // Add this message to the messages state
      setMessages(prev => ({
        ...prev,
        [newContact.id]: [{
          id: `m-new-${Date.now()}`,
          content: activity.message,
          timestamp: activity.timestamp,
          type: activity.type === 'received' ? 'incoming' : 'outgoing',
          status: activity.type === 'scheduled' ? 'scheduled' : undefined
        }]
      }));
    }
  };
  
  return (
    <Dashboard title="Messaging">
      {isMobile ? (
        <div className="h-[calc(100vh-4rem)]">
          {renderMobileView()}
        </div>
      ) : (
        <div className="grid grid-cols-12 h-[calc(100vh-4rem)] overflow-hidden bg-background">
          {/* Left Column - Contacts */}
          <div className="col-span-12 sm:col-span-4 md:col-span-3 flex flex-col h-full border rounded-l-md">
            <div className="flex justify-between items-center p-3 border-b">
              <h2 className="font-semibold text-lg">Messages</h2>
              <div className="flex items-center gap-2">
                <NotificationBell />
                <Button 
                  size="sm" 
                  onClick={handleNewMessageClick}
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" /> New
                </Button>
              </div>
            </div>
            <MessageFilters onFilterChange={handleFilterChange} />
            <ContactList
              contacts={contacts}
              activeContact={activeContact}
              setActiveContact={(contact) => {
                setActiveContact(contact);
                if (isMobile) {
                  setMobileView('conversation');
                }
                if (showNewMessage) {
                  setShowNewMessage(false);
                }
              }}
              filter={selectedFilter}
            />
          </div>
          
          {/* Middle Column - Messages */}
          <div className="hidden sm:flex sm:col-span-8 md:col-span-5 flex-col h-full border-t border-b">
            {showNewMessage ? (
              <NewMessage 
                open={true}
                onOpenChange={setShowNewMessage}
                onSend={handleNewMessageSend} 
                onBack={() => setShowNewMessage(false)} 
              />
            ) : (
              <MessageThread
                activeContact={activeContact}
                messages={activeContact ? messages[activeContact.id] || [] : []}
                onSendMessage={handleSendMessage}
              />
            )}
          </div>
          
          {/* Right Column - Contact Details */}
          <div className="hidden md:block md:col-span-4 h-full border rounded-r-md">
            {activeContact ? (
              <ContactDetails
                contact={activeContact}
                onContactUpdate={handleContactUpdate}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8 h-full">
                <div>
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <UserIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No contact selected</h3>
                  <p className="text-muted-foreground">
                    Select a conversation to view contact details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Dashboard>
  );
};

export default Messaging;
