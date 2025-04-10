
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Contact {
  id: string;
  name: string;
  phone: string;
  group?: string;
}

interface ContactsListProps {
  contacts: Contact[];
}

export function ContactsList({ contacts }: ContactsListProps) {
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
          <Input placeholder="Search contacts..." className="pl-8" />
        </div>

        <div className="mb-4 flex items-center gap-2 text-sm">
          <Button variant="secondary" size="sm" className="rounded-full">
            All
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            <Users className="h-3 w-3 mr-1" />
            Groups
          </Button>
          <Button variant="ghost" size="sm" className="rounded-full">
            Recent
          </Button>
        </div>

        <div className="space-y-1">
          {contacts.map((contact) => (
            <div 
              key={contact.id} 
              className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
            >
              <div className="flex items-center gap-2">
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
              {contact.group && (
                <Badge variant="outline" className="text-xs">
                  {contact.group}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
