
import { useState } from "react";
import { MessageComposer } from "@/components/messages/MessageComposer";
import { ContactsList } from "@/components/messages/ContactsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, MessageSquare, Template } from "lucide-react";
import { Card } from "@/components/ui/card";

// Sample data
const contacts = [
  { id: "1", name: "John Doe", phone: "+1 (555) 123-4567", group: "Customers", lastContact: "2 days ago" },
  { id: "2", name: "Jane Smith", phone: "+1 (555) 765-4321", group: "Leads", lastContact: "5 days ago" },
  { id: "3", name: "Robert Johnson", phone: "+1 (555) 987-6543", lastContact: "1 week ago" },
  { id: "4", name: "Sarah Williams", phone: "+1 (555) 456-7890", group: "Customers", lastContact: "3 hours ago" },
  { id: "5", name: "Michael Brown", phone: "+1 (555) 234-5678", group: "Leads", lastContact: "Yesterday" },
  { id: "6", name: "Emily Davis", phone: "+1 (555) 876-5432", group: "VIP", lastContact: "Just now" },
  { id: "7", name: "David Wilson", phone: "+1 (555) 654-3210", group: "Leads", lastContact: "1 month ago" },
  { id: "8", name: "Jennifer Garcia", phone: "+1 (555) 321-9876", group: "Customers", lastContact: "2 weeks ago" },
];

// Sample groups
const groups = [
  { id: "1", name: "Customers", count: 45, description: "Active customer accounts" },
  { id: "2", name: "Leads", count: 28, description: "Potential customers" },
  { id: "3", name: "VIP", count: 12, description: "High-value customers" },
  { id: "4", name: "Support", count: 33, description: "Customers with active support tickets" },
];

const Messages = () => {
  const [activeTab, setActiveTab] = useState("compose");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const handleSelectContact = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    } else {
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroup(groupId === selectedGroup ? null : groupId);
    // In a real app, we would fetch all contacts in this group and select them
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold">New Message</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Contact</span>
          </Button>
          <Button className="flex items-center gap-2 bg-gtalkblue hover:bg-blue-600">
            <Template className="h-4 w-4" />
            <span className="hidden sm:inline">Use Template</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="compose" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="compose" className="text-base py-3">
            <MessageSquare className="h-4 w-4 mr-2" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="recipients" className="text-base py-3">
            <Users className="h-4 w-4 mr-2" />
            Recipients {selectedContacts.length > 0 && `(${selectedContacts.length})`}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="compose" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <MessageComposer selectedCount={selectedContacts.length + (selectedGroup ? groups.find(g => g.id === selectedGroup)?.count || 0 : 0)} />
            </div>
            <div className="lg:col-span-1">
              <Card className="shadow-sm bg-muted/30 p-4">
                <h3 className="font-medium mb-3">Message Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Recipients:</span>
                    <span className="font-medium">{selectedContacts.length + (selectedGroup ? groups.find(g => g.id === selectedGroup)?.count || 0 : 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Credits:</span>
                    <span className="font-medium">1-5 per recipient</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Start:</span>
                    <span className="font-medium">Immediate</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Character Count:</span>
                    <span className="font-medium">0/160</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="recipients" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="mb-6">
                <h3 className="font-medium mb-2">Groups</h3>
                <div className="space-y-2">
                  {groups.map(group => (
                    <div 
                      key={group.id}
                      className={`p-3 border rounded-md cursor-pointer hover:bg-muted transition-colors ${
                        selectedGroup === group.id ? "border-gtalkblue bg-muted" : "border-border"
                      }`}
                      onClick={() => handleSelectGroup(group.id)}
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{group.name}</span>
                        <span className="text-muted-foreground">{group.count}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{group.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <ContactsList 
                contacts={contacts} 
                selectedContacts={selectedContacts}
                onSelectContact={handleSelectContact}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Messages;
