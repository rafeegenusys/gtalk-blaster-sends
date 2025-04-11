
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
import { Edit, Trash2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Group {
  id: string;
  name: string;
  created_at: string;
  contact_count?: number;
}

export function GroupList() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchGroups = async () => {
      if (!user) return;
      
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('business_id')
          .eq('id', user.id)
          .single();
          
        if (!profileData?.business_id) return;
        
        const { data, error } = await supabase
          .from('groups')
          .select('*')
          .eq('business_id', profileData.business_id)
          .order('name', { ascending: true });
          
        if (error) throw error;
        
        // For each group, get the count of contacts
        const groupsWithCounts = await Promise.all((data || []).map(async (group) => {
          const { count, error: countError } = await supabase
            .from('group_contacts')
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.id);
            
          if (countError) console.error('Error counting contacts:', countError);
          
          return {
            ...group,
            contact_count: count || 0
          };
        }));
        
        setGroups(groupsWithCounts);
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGroups();
  }, [user]);

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading groups...</div>;
  }

  if (groups.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/50">
        <h3 className="text-lg font-medium mb-2">No groups yet</h3>
        <p className="text-muted-foreground mb-4">
          Create your first group to organize your contacts
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
            <TableHead>Contacts</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((group) => (
            <TableRow key={group.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  {group.name}
                </div>
              </TableCell>
              <TableCell>{group.contact_count} contacts</TableCell>
              <TableCell>{new Date(group.created_at).toLocaleDateString()}</TableCell>
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
