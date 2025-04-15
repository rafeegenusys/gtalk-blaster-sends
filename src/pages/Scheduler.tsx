
import { useState } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { MessageCalendar } from "@/components/scheduler/MessageCalendar";
import { MessageComposer } from "@/components/messaging/MessageComposer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const Scheduler = () => {
  const [activeTab, setActiveTab] = useState("calendar");

  return (
    <Dashboard title="Scheduler">
      <div className="container mx-auto py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="composer">Quick Compose</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="m-0">
            <MessageCalendar />
          </TabsContent>
          
          <TabsContent value="composer" className="m-0">
            <Card>
              <CardContent className="p-6">
                <MessageComposer />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Dashboard>
  );
};

export default Scheduler;
