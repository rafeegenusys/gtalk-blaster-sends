
import { useState } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Upload, UserPlus, UsersRound } from "lucide-react";
import { ContactList } from "@/components/contacts/ContactList";
import { GroupList } from "@/components/contacts/GroupList";
import { DialogAddContact } from "@/components/contacts/DialogAddContact";
import { DialogAddGroup } from "@/components/contacts/DialogAddGroup";
import { useToast } from "@/components/ui/use-toast";

const Contacts = () => {
  const [activeTab, setActiveTab] = useState("contacts");
  const [showAddContact, setShowAddContact] = useState(false);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const { toast } = useToast();

  const handleAddContact = (contact: any) => {
    toast({
      title: "Contact added",
      description: `${contact.name} has been added to your contacts.`,
    });
    // In a real application, this would save the contact to a database
  };

  const handleAddGroup = (group: any) => {
    toast({
      title: "Group created",
      description: `Group "${group.name}" has been created.`,
    });
    // In a real application, this would save the group to a database
  };

  const handleImportClick = () => {
    // In a real application, this would open a file dialog to import contacts
    toast({
      title: "Import contacts",
      description: "This feature will be available soon.",
    });
  };

  return (
    <Dashboard title="Contacts & Groups">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Tabs
          defaultValue="contacts"
          className="w-full dark:text-foreground"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          <TabsList className="dark:bg-card">
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="contacts" className="m-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold dark:text-foreground">Contact Management</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleImportClick} className="dark:text-foreground dark:border-border">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <Button size="sm" onClick={() => setShowAddContact(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                </div>
              </div>
              <ContactList />
            </TabsContent>

            <TabsContent value="groups" className="m-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold dark:text-foreground">Group Management</h2>
                <Button size="sm" onClick={() => setShowAddGroup(true)}>
                  <UsersRound className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </div>
              <GroupList />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <DialogAddContact 
        open={showAddContact} 
        onOpenChange={setShowAddContact}
        onAddContact={handleAddContact}
      />

      <DialogAddGroup 
        open={showAddGroup} 
        onOpenChange={setShowAddGroup}
        onAddGroup={handleAddGroup}
      />
    </Dashboard>
  );
};

export default Contacts;
