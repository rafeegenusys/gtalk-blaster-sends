
import { useState } from "react";
import { ScheduledMessageCard } from "@/components/scheduling/ScheduledMessageCard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, CalendarDays, List } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Sample scheduled messages
const scheduledMessages = [
  {
    id: "1",
    content: "Hi [First Name], this is a reminder about your appointment tomorrow at 2:00 PM. Reply Y to confirm or N to reschedule.",
    date: "April 11, 2025",
    time: "10:00 AM",
    recipients: 15,
    messageType: "SMS" as const,
  },
  {
    id: "2",
    content: "Don't forget about our special promotion! Get 20% off your next purchase using code SPRING25. Valid until April 15.",
    date: "April 12, 2025",
    time: "9:00 AM",
    recipients: 78,
    messageType: "MMS" as const,
  },
  {
    id: "3",
    content: "Your monthly service report is ready. Please check your email for details or reply for assistance.",
    date: "April 15, 2025",
    time: "2:00 PM",
    recipients: 42,
    messageType: "SMS" as const,
    recurring: true,
  },
  {
    id: "4",
    content: "Thank you for being our valued customer! Here's a special birthday offer just for you. See attached image for details.",
    date: "April 18, 2025",
    time: "11:00 AM",
    recipients: 3,
    messageType: "MMS" as const,
  },
];

const Schedule = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Scheduled Messages</h1>
        <Button className="bg-gtalkblue hover:bg-blue-600">
          <Plus className="h-4 w-4 mr-2" />
          Schedule New Message
        </Button>
      </div>
      
      <div className="flex items-center justify-between">
        <Tabs defaultValue="upcoming" className="w-auto">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="recurring">Recurring</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("calendar")}
          >
            <CalendarDays className="h-4 w-4 mr-2" />
            Calendar
          </Button>
        </div>
      </div>
      
      {viewMode === "list" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scheduledMessages.map(message => (
            <ScheduledMessageCard
              key={message.id}
              id={message.id}
              content={message.content}
              date={message.date}
              time={message.time}
              recipients={message.recipients}
              messageType={message.messageType}
              recurring={message.recurring}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="border rounded-md p-3"
              />
              <div className="flex-1">
                <h3 className="font-medium mb-4">
                  Scheduled for {date?.toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'})}
                </h3>
                <div className="space-y-4">
                  {scheduledMessages.slice(0, 2).map(message => (
                    <div key={message.id} className="border rounded-md p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="font-medium">{message.time}</span>
                          <span className="ml-2 text-sm text-muted-foreground">{message.recipients} recipients</span>
                        </div>
                        <div>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm line-clamp-2">{message.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Schedule;
