
import { Dashboard } from "@/components/layout/Dashboard";
import { MessageComposer } from "@/components/messaging/MessageComposer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Messaging = () => {
  return (
    <Dashboard title="Messaging">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your recent contacts will appear here.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <MessageComposer />
        </div>
      </div>
    </Dashboard>
  );
};

export default Messaging;
