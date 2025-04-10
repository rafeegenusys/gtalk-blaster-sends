
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, UserPlus, Check } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface Contact {
  id: string;
  name: string;
  phone: string;
  group?: string;
  lastContact?: string;
}

interface ContactsListProps {
  contacts: Contact[];
  selectedContacts?: string[];
  onSelectContact?: (contactId: string) => void;
}

export function ContactsList({ contacts, selectedContacts = [], onSelectContact }: ContactsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    contact.phone.includes(searchQuery)
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Contacts</CardTitle>
          <div>
            <Button variant="ghost" size="icon">
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search contacts..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="mb-4 flex items-center gap-2 text-sm overflow-auto pb-2">
          <Button variant="secondary" size="sm" className="rounded-full whitespace-nowrap">
            All
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full whitespace-nowrap">
            <Users className="h-3 w-3 mr-1" />
            Customers
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full whitespace-nowrap">
            Leads
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full whitespace-nowrap">
            VIP
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full whitespace-nowrap">
            Recent
          </Button>
        </div>

        {filteredContacts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No contacts found matching "{searchQuery}"
          </div>
        ) : (
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {filteredContacts.map((contact) => (
              <div 
                key={contact.id} 
                className={`flex items-center justify-between p-2 hover:bg-muted rounded-md ${
                  onSelectContact ? "cursor-pointer" : ""
                } ${selectedContacts.includes(contact.id) ? "bg-muted" : ""}`}
                onClick={() => onSelectContact && onSelectContact(contact.id)}
              >
                <div className="flex items-center gap-3">
                  {onSelectContact && (
                    <Checkbox 
                      checked={selectedContacts.includes(contact.id)}
                      onCheckedChange={() => onSelectContact(contact.id)}
                      className="data-[state=checked]:bg-gtalkblue"
                    />
                  )}
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {contact.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {contact.lastContact && (
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      {contact.lastContact}
                    </span>
                  )}
                  {contact.group && (
                    <Badge variant="outline" className="text-xs">
                      {contact.group}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
