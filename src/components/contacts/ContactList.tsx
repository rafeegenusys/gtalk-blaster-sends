
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
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();

  useEffect(() => {
    const fetchContacts = async () => {
      if (!user) return;
      
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('business_id')
          .eq('id', user.id)
          .single();
          
        if (!profileData?.business_id) return;
        
        const { data, error } = await supabase
          .from('contacts')
          .select('*')
          .eq('business_id', profileData.business_id)
          .order('name', { ascending: true });
          
        if (error) throw error;
        
        setContacts(data || []);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContacts();
  }, [user]);

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading contacts...</div>;
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/50">
        <h3 className="text-lg font-medium mb-2">No contacts yet</h3>
        <p className="text-muted-foreground mb-4">
          Add your first contact to get started with messaging
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
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
        </TableBody>
      </Table>
    </div>
  );
}
