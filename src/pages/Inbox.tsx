
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, MoreVertical, MessageSquare } from "lucide-react";

// Sample data
const inboxMessages = [
  {
    id: "1",
    sender: "John Doe",
    phone: "+1 (555) 123-4567",
    message: "Hello, I'm interested in your services. Can you provide more information?",
    date: "Today, 10:30 AM",
    isRead: true,
  },
  {
    id: "2",
    sender: "Sarah Williams",
    phone: "+1 (555) 456-7890",
    message: "I need to reschedule my appointment from tomorrow to next week.",
    date: "Yesterday, 3:15 PM",
    isRead: false,
  },
  {
    id: "3",
    sender: "Michael Brown",
    phone: "+1 (555) 234-5678",
    message: "Thanks for the quick response. That works perfectly for me.",
    date: "Yesterday, 1:45 PM",
    isRead: true,
  },
  {
    id: "4",
    sender: "Emma Davis",
    phone: "+1 (555) 876-5432",
    message: "Could you send me the invoice for last month's services?",
    date: "04/08/2025, 9:00 AM",
    isRead: false,
  },
  {
    id: "5",
    sender: "Robert Johnson",
    phone: "+1 (555) 987-6543",
    message: "The product arrived damaged. How can I request a replacement?",
    date: "04/07/2025, 2:30 PM",
    isRead: true,
  },
];

const Inbox = () => {
  const [selectedMessage, setSelectedMessage] = useState(inboxMessages[0]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Inbox</h1>
      
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:w-80">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-8" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 max-h-[500px] overflow-y-auto">
                {inboxMessages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`px-4 py-3 cursor-pointer border-b last:border-b-0 hover:bg-muted ${
                      selectedMessage.id === msg.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedMessage(msg)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium">
                            {msg.sender}
                            {!msg.isRead && (
                              <span className="ml-2 inline-block w-2 h-2 rounded-full bg-gtalkblue"></span>
                            )}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">{msg.phone}</p>
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">{msg.date}</p>
                    </div>
                    <p className="text-sm mt-1 line-clamp-1 text-muted-foreground">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="shadow-sm h-full flex flex-col">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{selectedMessage.sender}</CardTitle>
                  <p className="text-sm text-muted-foreground">{selectedMessage.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto p-4">
              <div className="space-y-4 h-[400px]">
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">{selectedMessage.message}</p>
                    <div className="text-xs mt-1 text-muted-foreground flex justify-end">
                      {selectedMessage.date}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input placeholder="Reply to this message..." className="flex-grow" />
                <Button className="shrink-0 bg-gtalkblue hover:bg-blue-600">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Reply
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
