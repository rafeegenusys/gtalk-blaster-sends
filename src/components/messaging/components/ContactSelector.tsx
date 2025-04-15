
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCheck } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

interface ContactSelectorProps {
  contacts: Contact[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectContact: (contact: Contact) => void;
  onClose: () => void;
}

export function ContactSelector({
  contacts,
  searchQuery,
  onSearchChange,
  onSelectContact,
  onClose
}: ContactSelectorProps) {
  return (
    <div className="border rounded-md mt-2 overflow-hidden">
      <div className="p-2 border-b flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search contacts..." 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border-0 h-8"
        />
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
      <ScrollArea className="h-48">
        {contacts.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No contacts found
          </div>
        ) : (
          <div>
            {contacts.map(contact => (
              <div 
                key={contact.id} 
                className="p-2 hover:bg-accent cursor-pointer flex items-center justify-between"
                onClick={() => onSelectContact(contact)}
              >
                <div>
                  <p className="font-medium">{contact.name || "Unnamed"}</p>
                  <p className="text-xs text-muted-foreground">{contact.phone}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <CheckCheck className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
