
import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { DialogAddContact } from "./DialogAddContact";

interface Contact {
  id: string;
  name: string;
  phone: string;
  tags: string[];
  created_at: string;
}

export function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddContact, setShowAddContact] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchContacts = async () => {
      // For demo purposes, populate with sample data if no contacts are returned from the API
      const sampleContacts = [
        {
          id: "1",
          name: "John Doe",
          phone: "+1 (555) 123-4567",
          tags: ["customer", "support"],
          created_at: new Date().toISOString()
        },
        {
          id: "2",
          name: "Jane Smith",
          phone: "+1 (555) 987-6543",
          tags: ["prospect", "premium"],
          created_at: new Date().toISOString()
        },
        {
          id: "3",
          name: "Michael Johnson",
          phone: "+1 (555) 456-7890",
          tags: ["partner"],
          created_at: new Date().toISOString()
        }
      ];
      
      try {
        if (!user) {
          setContacts(sampleContacts);
          setIsLoading(false);
          return;
        }
        
        const { data: profileData } = await supabase
          .from('profiles')
          .select('business_id')
          .eq('id', user.id)
          .single();
          
        if (!profileData?.business_id) {
          setContacts(sampleContacts);
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .eq('business_id', profileData.business_id)
          .order('name', { ascending: true });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setContacts(data);
        } else {
          setContacts(sampleContacts);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setContacts(sampleContacts);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContacts();
  }, [user]);

  const handleAddContact = (contact: Contact) => {
    setContacts(prev => [...prev, contact]);
  };

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading contacts...</div>;
  }

  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {contact.tags && contact.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{new Date(contact.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {contacts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-muted-foreground mb-2">No contacts found</p>
                    <Button variant="outline" size="sm" onClick={() => setShowAddContact(true)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add your first contact
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DialogAddContact
        open={showAddContact}
        onOpenChange={setShowAddContact}
        onAddContact={handleAddContact}
      />
    </>
  );
}
