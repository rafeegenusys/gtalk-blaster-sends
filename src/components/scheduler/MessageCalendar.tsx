
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { 
  PlusCircle, 
  MessageSquare, 
  Edit, 
  Trash, 
  Send,
  ArrowLeft
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { MessageScheduler } from "../messaging/components/MessageScheduler";

// Types for scheduled messages
interface ScheduledMessage {
  id: string;
  content: string;
  scheduledTime: Date;
  recipient: string;
  status: 'pending' | 'sent' | 'failed';
}

export function MessageCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedMessage, setSelectedMessage] = useState<ScheduledMessage | null>(null);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [mobileView, setMobileView] = useState<'calendar' | 'messages'>('calendar');
  
  // Form state
  const [recipient, setRecipient] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(new Date());
  const [scheduledTime, setScheduledTime] = useState("12:00");
  const [timezone, setTimezone] = useState("America/New_York");
  const [cancelIfResponse, setCancelIfResponse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  // State for stored messages
  const [storedMessages, setStoredMessages] = useState<ScheduledMessage[]>([]);
  
  // Load scheduled messages from Supabase when component mounts or user changes
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
  
  // Filter messages for the selected date
  const messagesForSelectedDate = storedMessages.filter(msg => {
    if (!date) return false;
    
    const msgDate = new Date(msg.scheduledTime);
    return (
      msgDate.getDate() === date.getDate() &&
      msgDate.getMonth() === date.getMonth() &&
      msgDate.getFullYear() === date.getFullYear()
    );
  });
  
  // Function to schedule a new message
  const handleScheduleMessage = async () => {
    if (!user || !recipient || !messageContent || !scheduledDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Get business ID or use default for demo
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('business_id')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileError) throw profileError;
      const businessId = profileData?.business_id || '00000000-0000-0000-0000-000000000000';
      
      // Create scheduled time
      const [hours, minutes] = scheduledTime.split(':').map(Number);
      const scheduledDateTime = new Date(scheduledDate);
      scheduledDateTime.setHours(hours, minutes);
      
      // Insert the message
      const { data, error } = await supabase
        .from('messages')
        .insert({
          type: 'SMS',
          content: messageContent,
          sender_id: user.id,
          recipient_type: 'contact',
          recipient_id: recipient,
          business_id: businessId,
          status: 'pending',
          scheduled_time: scheduledDateTime.toISOString()
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Message scheduled",
        description: `Message scheduled for ${format(scheduledDateTime, 'PPP p')}`
      });
      
      // Close dialog and reset form
      setShowNewMessageDialog(false);
      setRecipient("");
      setMessageContent("");
      setScheduledDate(new Date());
      setScheduledTime("12:00");
      
      // Reload messages
      loadScheduledMessages();
      
    } catch (error: any) {
      console.error("Error scheduling message:", error);
      toast({
        title: "Failed to schedule message",
        description: error.message,
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
    setShowNewMessageDialog(true);
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
  
  // Function to determine if a day has scheduled messages
  const hasDayMessages = (day: Date) => {
    return storedMessages.some(msg => {
      const msgDate = new Date(msg.scheduledTime);
      return (
        msgDate.getDate() === day.getDate() &&
        msgDate.getMonth() === day.getMonth() &&
        msgDate.getFullYear() === day.getFullYear()
      );
    });
  };

  // Handle date selection
  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (isMobile && newDate) {
      setMobileView('messages');
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Message Calendar</span>
          <Button 
            size="sm" 
            className="bg-gtalk-primary hover:bg-gtalk-primary/90"
            onClick={() => setShowNewMessageDialog(true)}
            disabled={isLoading}
          >
            <PlusCircle size={16} className="mr-1" /> New Scheduled Message
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto pb-6">
        {isLoading && !storedMessages.length ? (
          <div className="text-center py-6">Loading scheduled messages...</div>
        ) : (
          <>
            {/* Mobile View */}
            {isMobile && (
              <div className="lg:hidden">
                {mobileView === 'calendar' ? (
                  <div className="space-y-4">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      className="rounded-md border mx-auto"
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
                    <div className="text-center mt-4">
                      <p className="text-sm text-muted-foreground">
                        Select a date to view scheduled messages
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Dates with scheduled messages are highlighted
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center mb-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setMobileView('calendar')}
                        className="mr-2 p-0 h-8 w-8 flex items-center justify-center"
                      >
                        <ArrowLeft size={16} />
                      </Button>
                      <h3 className="text-lg font-medium">
                        {date ? format(date, 'PPP') : 'Select a date'}
                      </h3>
                    </div>
                    
                    {messagesForSelectedDate.length === 0 ? (
                      <div className="text-gray-500 text-center py-6">
                        No scheduled messages for this date
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {messagesForSelectedDate.map((msg) => (
                          <Card key={msg.id} className="p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium">{format(msg.scheduledTime, 'h:mm a')}</p>
                                <p className="text-sm text-muted-foreground truncate">{msg.recipient}</p>
                              </div>
                              <Badge
                                variant={
                                  msg.status === 'sent' ? 'default' :
                                  msg.status === 'pending' ? 'outline' : 'destructive'
                                }
                              >
                                {msg.status}
                              </Badge>
                            </div>
                            <p className="text-sm line-clamp-2 mb-2">{msg.content}</p>
                            <div className="flex space-x-2 mt-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleViewMessage(msg)}
                              >
                                <MessageSquare size={14} className="mr-1" /> View
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditMessage(msg)}
                              >
                                <Edit size={14} className="mr-1" /> Edit
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-500"
                                onClick={() => handleDeleteMessage(msg.id)}
                              >
                                <Trash size={14} className="mr-1" /> Delete
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Desktop View */}
            <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
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
                            <TableCell className="max-w-[120px] truncate">{msg.recipient}</TableCell>
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
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      {/* View Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Scheduled Message</DialogTitle>
            <DialogDescription>View details of this scheduled message</DialogDescription>
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
                <p className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
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
                  variant="outline" 
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
      
      {/* New/Edit Message Dialog */}
      <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
        <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedMessage ? 'Edit Scheduled Message' : 'Schedule New Message'}
            </DialogTitle>
            <DialogDescription>
              {selectedMessage ? 'Modify your scheduled message' : 'Create a new scheduled message'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="recipient" className="text-sm font-medium">
                Recipient Phone Number
              </label>
              <div className="flex">
                <Input
                  id="recipient"
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
                className="w-full min-h-24 p-2 border rounded-md resize-y dark:bg-gray-800"
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
                onClick={() => {
                  setShowNewMessageDialog(false);
                  if (!selectedMessage) {
                    setRecipient("");
                    setMessageContent("");
                    setScheduledDate(new Date());
                    setScheduledTime("12:00");
                  }
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleScheduleMessage}
                disabled={isLoading}
              >
                <Send className="mr-2 h-4 w-4" />
                {selectedMessage ? 'Update Message' : 'Schedule Message'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
