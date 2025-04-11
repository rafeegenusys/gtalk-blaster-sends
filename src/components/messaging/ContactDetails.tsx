
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Contact } from "./ContactList";
import { Phone, Star, Tag, User, X } from "lucide-react";

interface ContactDetailsProps {
  contact: Contact;
  onContactUpdate: (updatedContact: Contact) => void;
}

export function ContactDetails({ contact, onContactUpdate }: ContactDetailsProps) {
  const [contactNote, setContactNote] = useState(contact.notes || "");
  const { toast } = useToast();

  const handleUpdateContact = () => {
    const updatedContact = {
      ...contact,
      notes: contactNote
    };
    
    onContactUpdate(updatedContact);
    
    toast({
      title: "Contact updated",
      description: "Contact notes have been saved",
    });
  };

  return (
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
                  value={contact.name || ''} 
                  placeholder="Add name" 
                  onChange={(e) => onContactUpdate({...contact, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Phone</label>
                <Input value={contact.phone} readOnly />
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Company</label>
                <Input 
                  value={contact.company || ''} 
                  placeholder="Add company" 
                  onChange={(e) => onContactUpdate({...contact, company: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Email</label>
                <Input 
                  value={contact.email || ''} 
                  placeholder="Add email" 
                  onChange={(e) => onContactUpdate({...contact, email: e.target.value})}
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
              value={contactNote}
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
  );
}
