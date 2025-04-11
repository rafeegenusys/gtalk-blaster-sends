
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { PlusCircle, MessageSquare, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Types for scheduled messages
interface ScheduledMessage {
  id: string;
  content: string;
  scheduledTime: Date;
  recipient: string;
  status: 'pending' | 'sent' | 'failed';
}

// Mock data - would be replaced with real data from your database
const mockScheduledMessages: ScheduledMessage[] = [
  {
    id: '1',
    content: 'Follow-up on our last conversation',
    scheduledTime: new Date(2025, 3, 15, 10, 0),
    recipient: '+1234567890',
    status: 'pending'
  },
  {
    id: '2',
    content: 'Reminder about your appointment',
    scheduledTime: new Date(2025, 3, 15, 14, 30),
    recipient: '+0987654321',
    status: 'pending'
  }
];

export function MessageCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedMessage, setSelectedMessage] = useState<ScheduledMessage | null>(null);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  
  // Filter messages for the selected date
  const messagesForSelectedDate = mockScheduledMessages.filter(msg => {
    if (!date) return false;
    
    const msgDate = new Date(msg.scheduledTime);
    return (
      msgDate.getDate() === date.getDate() &&
      msgDate.getMonth() === date.getMonth() &&
      msgDate.getFullYear() === date.getFullYear()
    );
  });
  
  // Function to handle viewing a message
  const handleViewMessage = (message: ScheduledMessage) => {
    setSelectedMessage(message);
    setShowMessageDialog(true);
  };
  
  // Function to determine if a day has scheduled messages
  const hasDayMessages = (day: Date) => {
    return mockScheduledMessages.some(msg => {
      const msgDate = new Date(msg.scheduledTime);
      return (
        msgDate.getDate() === day.getDate() &&
        msgDate.getMonth() === day.getMonth() &&
        msgDate.getFullYear() === day.getFullYear()
      );
    });
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Message Calendar</span>
          <Button size="sm" className="bg-gtalk-primary hover:bg-gtalk-primary/90">
            <PlusCircle size={16} className="mr-1" /> New Scheduled Message
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={{
              hasMessages: (date) => hasDayMessages(date),
            }}
            modifiersStyles={{
              hasMessages: {
                fontWeight: 'bold',
                backgroundColor: 'rgba(0, 128, 255, 0.1)',
                borderRadius: '100%',
              }
            }}
          />
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">
            {date ? format(date, 'PPP') : 'Select a date'}
          </h3>
          
          {messagesForSelectedDate.length === 0 ? (
            <div className="text-gray-500 text-center py-6">
              No scheduled messages for this date
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messagesForSelectedDate.map((msg) => (
                    <TableRow key={msg.id}>
                      <TableCell>{format(msg.scheduledTime, 'h:mm a')}</TableCell>
                      <TableCell>{msg.recipient}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            msg.status === 'sent' ? 'default' :
                            msg.status === 'pending' ? 'outline' : 'destructive'
                          }
                        >
                          {msg.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleViewMessage(msg)}
                          >
                            <MessageSquare size={16} />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit size={16} />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Scheduled Message</DialogTitle>
              </DialogHeader>
              
              {selectedMessage && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Time</h4>
                    <p>{format(selectedMessage.scheduledTime, 'PPP p')}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Recipient</h4>
                    <p>{selectedMessage.recipient}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Message</h4>
                    <p className="p-3 bg-gray-100 rounded-md">
                      {selectedMessage.content}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Status</h4>
                    <Badge
                      variant={
                        selectedMessage.status === 'sent' ? 'default' :
                        selectedMessage.status === 'pending' ? 'outline' : 'destructive'
                      }
                    >
                      {selectedMessage.status}
                    </Badge>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
