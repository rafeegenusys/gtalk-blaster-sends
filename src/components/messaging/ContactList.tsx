
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Circle, 
  MessageSquare, 
  Phone, 
  Plus, 
  Search, 
  User 
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export type Contact = {
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

interface ContactListProps {
  contacts: Contact[];
  activeContact: Contact | null;
  setActiveContact: (contact: Contact) => void;
  filter: string;
}

export function ContactList({ 
  contacts, 
  activeContact, 
  setActiveContact, 
  filter 
}: ContactListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const isMobile = useIsMobile();

  // Filter contacts based on search and filter type
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = (
      (contact.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
      contact.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (!matchesSearch) return false;
    
    // Apply additional filters
    if (filter === "unread" && !contact.unread) return false;
    if (filter === "unresponded" && !contact.missedCall) return false;
    
    return true;
  });

  return (
    <div className="flex flex-col h-full border-r">
      <div className="p-3 border-b flex items-center justify-between">
        <h3 className="font-semibold">Messages</h3>
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search messages..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        {filteredContacts.length > 0 ? (
          filteredContacts.map(contact => (
            <div 
              key={contact.id}
              className={`p-3 border-b cursor-pointer hover:bg-muted/30 transition-colors ${
                activeContact?.id === contact.id ? 'bg-muted/50' : ''
              }`}
              onClick={() => setActiveContact(contact)}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {contact.name ? contact.name.charAt(0).toUpperCase() : <User size={18} />}
                  </div>
                  {contact.status === "online" && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-background"></div>
                  )}
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
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 p-4 text-center text-muted-foreground">
            <MessageSquare className="h-8 w-8 mb-2 opacity-50" />
            <p>No messages found</p>
            <p className="text-xs mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
