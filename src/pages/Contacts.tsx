
import { useState } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Upload, UserPlus, UsersRound } from "lucide-react";
import { ContactList } from "@/components/contacts/ContactList";
import { GroupList } from "@/components/contacts/GroupList";

const Contacts = () => {
  const [activeTab, setActiveTab] = useState("contacts");

  return (
    <Dashboard title="Contacts & Groups">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Tabs
          defaultValue="contacts"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="contacts" className="m-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Contact Management</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <Button size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                </div>
              </div>
              <ContactList />
            </TabsContent>

            <TabsContent value="groups" className="m-0">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Group Management</h2>
                <Button size="sm">
                  <UsersRound className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </div>
              <GroupList />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Dashboard>
  );
};

export default Contacts;
