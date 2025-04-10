
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Paperclip, Send } from "lucide-react";
import { cn } from "@/lib/utils";

// Sample chat data
const chatContacts = [
  { id: "1", name: "Sarah Johnson", role: "Sales Manager", online: true, unread: 3 },
  { id: "2", name: "Mike Peterson", role: "Support Specialist", online: true, unread: 0 },
  { id: "3", name: "Emma Wilson", role: "Marketing Coordinator", online: false, unread: 0 },
  { id: "4", name: "Daniel Smith", role: "Field Technician", online: false, unread: 1 },
  { id: "5", name: "Rachel Thompson", role: "Customer Service", online: true, unread: 0 },
];

const messageHistory = [
  { id: "1", sender: "2", content: "Hey, can you update me on the new client meeting?", time: "10:30 AM", read: true },
  { id: "2", sender: "self", content: "Sure! We're scheduled for 2pm with ABC Corp. Do you have the proposal ready?", time: "10:32 AM", read: true },
  { id: "3", sender: "2", content: "Yes, I've prepared everything. I'll share the deck with you shortly.", time: "10:35 AM", read: true },
  { id: "4", sender: "self", content: "Sounds good. I also think we should highlight the new SMS campaign features.", time: "10:37 AM", read: true },
  { id: "5", sender: "2", content: "Great idea! I'll add a slide about that. What metrics should we focus on?", time: "10:40 AM", read: true },
  { id: "6", sender: "self", content: "Let's emphasize the 32% increase in response rates and the reduced cost per conversion.", time: "10:45 AM", read: false },
];

const Chat = () => {
  const [selectedContact, setSelectedContact] = useState(chatContacts[0]);
  const [messageInput, setMessageInput] = useState("");

  return (
    <div className="h-[calc(100vh-12rem)]">
      <h1 className="text-2xl font-semibold mb-6">Internal Chat</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        <Card className="lg:col-span-1 shadow-sm flex flex-col h-full">
          <CardHeader className="pb-3">
            <CardTitle>Team Members</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-8" />
            </div>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto space-y-1 py-0">
            {chatContacts.map(contact => (
              <div
                key={contact.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-muted",
                  selectedContact.id === contact.id && "bg-muted"
                )}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarFallback className="bg-primary">
                      {contact.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <p className="font-medium text-sm">{contact.name}</p>
                    {contact.unread > 0 && (
                      <span className="bg-gtalkblue text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{contact.role}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3 shadow-sm flex flex-col h-full">
          <CardHeader className="border-b pb-3">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary">
                  {selectedContact.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">{selectedContact.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{selectedContact.online ? 'Online' : 'Offline'}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-grow overflow-auto p-4">
            <div className="space-y-4">
              {messageHistory.map(message => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.sender === "self" ? "justify-end" : "justify-start"
                  )}
                >
                  <div 
                    className={cn(
                      "max-w-[80%] rounded-lg p-3",
                      message.sender === "self" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div 
                      className={cn(
                        "text-xs mt-1 flex justify-end",
                        message.sender === "self" 
                          ? "text-primary-foreground/80" 
                          : "text-muted-foreground"
                      )}
                    >
                      {message.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          
          <div className="border-t p-3">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="shrink-0">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input 
                placeholder="Type a message..." 
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-grow"
              />
              <Button className="shrink-0 bg-gtalkblue hover:bg-blue-600">
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
