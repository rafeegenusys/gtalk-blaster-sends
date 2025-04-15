
import { useState, useEffect } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { MessageCalendar } from "@/components/scheduler/MessageCalendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Edit, Trash, PlusCircle, Calendar, ListChecks, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { MessageScheduler } from "@/components/messaging/components/MessageScheduler";

// Types for scheduled messages
interface ScheduledMessage {
  id: string;
  content: string;
  scheduledTime: Date;
  recipient: string;
  status: 'pending' | 'sent' | 'failed';
}

const Scheduler = () => {
  const [activeTab, setActiveTab] = useState("calendar");
  const [storedMessages, setStoredMessages] = useState<ScheduledMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ScheduledMessage | null>(null);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  // Form state for editing
  const [recipient, setRecipient] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(new Date());
  const [scheduledTime, setScheduledTime] = useState("12:00");
  const [timezone, setTimezone] = useState("America/New_York");
  const [cancelIfResponse, setCancelIfResponse] = useState(false);
  
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    loadScheduledMessages();
  }, [user]);
  
  // Load scheduled messages from Supabase
  const loadScheduledMessages = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('business_id')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileError) throw profileError;
      
      // Use a default business ID for demo if none exists
      const businessId = profileData?.business_id || '00000000-0000-0000-0000-000000000000';
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('business_id', businessId)
        .not('scheduled_time', 'is', null);
      
      if (error) throw error;
      
      if (data) {
        const formattedMessages: ScheduledMessage[] = data.map(msg => ({
          id: msg.id,
          content: msg.content || "",
          scheduledTime: new Date(msg.scheduled_time),
          recipient: msg.recipient_id || "",
          status: msg.status as 'pending' | 'sent' | 'failed'
        }));
        
        setStoredMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error loading scheduled messages:", error);
      toast({
        title: "Error",
        description: "Failed to load scheduled messages",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to handle viewing a message
  const handleViewMessage = (message: ScheduledMessage) => {
    setSelectedMessage(message);
    setShowMessageDialog(true);
  };
  
  // Function to handle editing a message
  const handleEditMessage = (message: ScheduledMessage) => {
    setSelectedMessage(message);
    setRecipient(message.recipient);
    setMessageContent(message.content);
    setScheduledDate(message.scheduledTime);
    setScheduledTime(
      format(message.scheduledTime, 'HH:mm')
    );
    setShowEditDialog(true);
  };
  
  // Function to handle updating a message
  const handleUpdateMessage = async () => {
    if (!user || !selectedMessage || !scheduledDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create scheduled time
      const [hours, minutes] = scheduledTime.split(':').map(Number);
      const scheduledDateTime = new Date(scheduledDate);
      scheduledDateTime.setHours(hours, minutes);
      
      // Update the message
      const { error } = await supabase
        .from('messages')
        .update({
          content: messageContent,
          recipient_id: recipient,
          scheduled_time: scheduledDateTime.toISOString()
        })
        .eq('id', selectedMessage.id);
      
      if (error) throw error;
      
      toast({
        title: "Message updated",
        description: `Message scheduled for ${format(scheduledDateTime, 'PPP p')} has been updated`
      });
      
      // Close dialog and reset form
      setShowEditDialog(false);
      loadScheduledMessages();
      
    } catch (error: any) {
      console.error("Error updating message:", error);
      toast({
        title: "Failed to update message",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to handle deleting a message
  const handleDeleteMessage = async (messageId: string) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);
      
      if (error) throw error;
      
      toast({
        title: "Message deleted",
        description: "The scheduled message has been deleted."
      });
      
      // Remove from local state
      setStoredMessages(prev => prev.filter(msg => msg.id !== messageId));
      setShowMessageDialog(false);
      
    } catch (error: any) {
      console.error("Error deleting message:", error);
      toast({
        title: "Failed to delete message",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dashboard title="Scheduler">
      <div className="container mx-auto py-4 max-h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col overflow-hidden">
          <TabsList className="mb-4 w-full justify-start overflow-x-auto">
            <TabsTrigger value="calendar" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" /> Calendar View
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center">
              <ListChecks className="h-4 w-4 mr-2" /> Scheduled Messages
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="m-0 flex-1 overflow-auto pb-4">
            <MessageCalendar />
          </TabsContent>
          
          <TabsContent value="list" className="m-0 flex-1 overflow-auto pb-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Scheduled Messages</span>
                  <Button 
                    size="sm" 
                    className="bg-gtalk-primary hover:bg-gtalk-primary/90"
                    onClick={() => setActiveTab("calendar")}
                  >
                    <PlusCircle size={16} className="mr-1" /> Schedule New Message
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-auto">
                {isLoading ? (
                  <div className="text-center py-6">Loading scheduled messages...</div>
                ) : storedMessages.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    No scheduled messages found
                  </div>
                ) : (
                  <div className={`overflow-x-auto ${isMobile ? 'pb-16' : ''}`}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Scheduled For</TableHead>
                          <TableHead>Recipient</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {storedMessages.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime()).map((msg) => (
                          <TableRow key={msg.id}>
                            <TableCell>{format(msg.scheduledTime, 'PPP p')}</TableCell>
                            <TableCell>{msg.recipient}</TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {msg.content}
                            </TableCell>
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
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleEditMessage(msg)}
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDeleteMessage(msg.id)}
                                >
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* View Message Dialog */}
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
                <p className="p-3 bg-gray-100 rounded-md dark:bg-gray-800">
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
              
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="ghost" 
                  onClick={() => handleEditMessage(selectedMessage)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Edit Message Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Scheduled Message</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="recipient" className="text-sm font-medium">
                Recipient Phone Number
              </label>
              <div className="flex">
                <input
                  id="recipient"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter phone number"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <textarea
                id="message"
                placeholder="Type your message here..."
                className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
              />
            </div>
            
            <MessageScheduler
              scheduledDate={scheduledDate}
              scheduledTime={scheduledTime}
              timezone={timezone}
              cancelIfResponse={cancelIfResponse}
              onDateChange={setScheduledDate}
              onTimeChange={setScheduledTime}
              onTimezoneChange={setTimezone}
              onCancelIfResponseChange={setCancelIfResponse}
            />
            
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setShowEditDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateMessage}
                disabled={isLoading}
              >
                Update Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dashboard>
  );
};

export default Scheduler;
