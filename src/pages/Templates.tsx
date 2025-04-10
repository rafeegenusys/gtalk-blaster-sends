
import { useState } from "react";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample template data
const templateData = [
  {
    id: "1",
    title: "Welcome Message",
    content: "Welcome to [Business Name]! We're excited to have you as a customer. Reply HELP for assistance or STOP to unsubscribe.",
    category: "Onboarding",
    hasMedia: false
  },
  {
    id: "2",
    title: "Appointment Reminder",
    content: "Hi [First Name], this is a reminder about your appointment on [Date] at [Time]. Reply Y to confirm or N to reschedule.",
    category: "Reminders",
    hasMedia: false
  },
  {
    id: "3",
    title: "Special Promotion",
    content: "Exclusive offer for [First Name]! Get 20% off your next purchase using code [Code]. Valid until [Date].",
    category: "Marketing",
    hasMedia: true
  },
  {
    id: "4",
    title: "Order Confirmation",
    content: "Thank you for your order #[Order Number]! Your [Product] has been shipped and will arrive in 2-3 business days.",
    category: "Transactional",
    hasMedia: false
  },
  {
    id: "5",
    title: "Service Follow-up",
    content: "Hi [First Name], how was your recent experience with us? We'd love your feedback! Reply with a rating from 1-5.",
    category: "Customer Service",
    hasMedia: false
  },
  {
    id: "6",
    title: "Event Invitation",
    content: "You're invited to our [Event Name] on [Date] at [Location]. See attached image for details. RSVP by replying YES.",
    category: "Events",
    hasMedia: true
  },
];

const Templates = () => {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Message Templates</h1>
        <Button className="bg-gtalkblue hover:bg-blue-600">
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="sms">SMS Only</TabsTrigger>
            <TabsTrigger value="mms">MMS Only</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:w-80">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search templates..." className="pl-8" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templateData
          .filter(template => {
            if (activeTab === "sms") return !template.hasMedia;
            if (activeTab === "mms") return template.hasMedia;
            return true;
          })
          .map(template => (
            <TemplateCard
              key={template.id}
              id={template.id}
              title={template.title}
              content={template.content}
              category={template.category}
              hasMedia={template.hasMedia}
            />
          ))}
      </div>
    </div>
  );
};

export default Templates;
