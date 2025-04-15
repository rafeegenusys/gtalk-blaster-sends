
import { useState } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { MessageCalendar } from "@/components/scheduler/MessageCalendar";
import { MessageComposer } from "@/components/messaging/MessageComposer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const Scheduler = () => {
  const [activeTab, setActiveTab] = useState("calendar");

  return (
    <Dashboard title="Scheduler">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="composer">Quick Compose</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="m-0">
          <div className="grid gap-6">
            <MessageCalendar />
          </div>
        </TabsContent>
        
        <TabsContent value="composer" className="m-0">
          <div className="grid gap-6">
            <Card>
              <MessageComposer />
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Dashboard>
  );
};

export default Scheduler;
