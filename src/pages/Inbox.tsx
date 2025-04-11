import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Filter, MoreVertical, MessageSquare, Paperclip, Clock, FileText, Sparkles, Tag, StickyNote } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";

// Sample data
const inboxMessages = [{
  id: "1",
  sender: "John Doe",
  phone: "+1 (555) 123-4567",
  message: "Hello, I'm interested in your services. Can you provide more information?",
  date: "Today, 10:30 AM",
  isRead: true,
  tags: ["Customer", "New Lead"],
  notes: []
}, {
  id: "2",
  sender: "Sarah Williams",
  phone: "+1 (555) 456-7890",
  message: "I need to reschedule my appointment from tomorrow to next week.",
  date: "Yesterday, 3:15 PM",
  isRead: false,
  tags: ["VIP", "Appointment"],
  notes: ["Follow up about specific appointment times"]
}, {
  id: "3",
  sender: "Michael Brown",
  phone: "+1 (555) 234-5678",
  message: "Thanks for the quick response. That works perfectly for me.",
  date: "Yesterday, 1:45 PM",
  isRead: true,
  tags: ["Customer"],
  notes: []
}, {
  id: "4",
  sender: "Emma Davis",
  phone: "+1 (555) 876-5432",
  message: "Could you send me the invoice for last month's services?",
  date: "04/08/2025, 9:00 AM",
  isRead: false,
  tags: ["Billing"],
  notes: ["Needs invoice #INV-2025-042"]
}, {
  id: "5",
  sender: "Robert Johnson",
  phone: "+1 (555) 987-6543",
  message: "The product arrived damaged. How can I request a replacement?",
  date: "04/07/2025, 2:30 PM",
  isRead: true,
  tags: ["Support", "Urgent"],
  notes: ["Check order #45692 - damaged product"]
}];

// Sample message templates
const messageTemplates = [{
  id: "1",
  title: "Thank You",
  content: "Thank you for reaching out! We appreciate your interest in our services."
}, {
  id: "2",
  title: "Appointment Confirmation",
  content: "Your appointment has been confirmed for {date} at {time}."
}, {
  id: "3",
  title: "Support Response",
  content: "We're sorry to hear about the issue. Our team will help resolve this quickly."
}];
const Inbox = () => {
  const [selectedMessage, setSelectedMessage] = useState(inboxMessages[0]);
  const [replyText, setReplyText] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAttachments([...attachments, ...filesArray].slice(0, 5)); // Limit to 5 files
    }
  };
  const removeAttachment = (index: number) => {
    const newFiles = [...attachments];
    newFiles.splice(index, 1);
    setAttachments(newFiles);
  };
  const addTagToContact = () => {
    if (currentTag.trim()) {
      const updatedMessages = inboxMessages.map(msg => {
        if (msg.id === selectedMessage.id && !msg.tags.includes(currentTag)) {
          return {
            ...msg,
            tags: [...msg.tags, currentTag]
          };
        }
        return msg;
      });
      const updatedSelectedMessage = updatedMessages.find(msg => msg.id === selectedMessage.id);
      if (updatedSelectedMessage) {
        setSelectedMessage(updatedSelectedMessage);
      }
      setCurrentTag("");
    }
  };
  const removeTag = (tag: string) => {
    const updatedMessages = inboxMessages.map(msg => {
      if (msg.id === selectedMessage.id) {
        return {
          ...msg,
          tags: msg.tags.filter(t => t !== tag)
        };
      }
      return msg;
    });
    const updatedSelectedMessage = updatedMessages.find(msg => msg.id === selectedMessage.id);
    if (updatedSelectedMessage) {
      setSelectedMessage(updatedSelectedMessage);
    }
  };
  const addNote = () => {
    if (newNote.trim()) {
      const updatedMessages = inboxMessages.map(msg => {
        if (msg.id === selectedMessage.id) {
          return {
            ...msg,
            notes: [...msg.notes, newNote]
          };
        }
        return msg;
      });
      const updatedSelectedMessage = updatedMessages.find(msg => msg.id === selectedMessage.id);
      if (updatedSelectedMessage) {
        setSelectedMessage(updatedSelectedMessage);
      }
      setNewNote("");
    }
  };
  const generateAIResponse = () => {
    // Simulate AI generating a response
    setReplyText("Thank you for your message. I've reviewed your request and would be happy to assist you with more information about our services. Please let me know if you have any specific questions.");
  };
  const useTemplate = (content: string) => {
    setReplyText(content);
    setShowTemplates(false);
  };
  const scheduleSend = () => {
    // Placeholder for schedule send functionality
    console.log("Schedule send clicked");
    // In a real implementation, this would open a date/time picker
  };
  const filteredMessages = inboxMessages.filter(msg => {
    const matchesSearch = searchQuery === "" || msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) || msg.message.toLowerCase().includes(searchQuery.toLowerCase()) || msg.phone.includes(searchQuery);
    if (activeTab === "unread") {
      return !msg.isRead && matchesSearch;
    } else {
      return matchesSearch;
    }
  });
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Inbox</h1>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm">
            Mark All Read
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:w-80">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-8" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
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
                {filteredMessages.map(msg => <ContextMenu key={msg.id}>
                    <ContextMenuTrigger>
                      <div className={`px-4 py-3 cursor-pointer border-b last:border-b-0 hover:bg-muted ${selectedMessage.id === msg.id ? "bg-muted" : ""}`} onClick={() => setSelectedMessage(msg)}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium">
                                {msg.sender}
                                {!msg.isRead && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-gtalkblue"></span>}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground">{msg.phone}</p>
                          </div>
                          <p className="text-xs text-muted-foreground whitespace-nowrap">{msg.date}</p>
                        </div>
                        <p className="text-sm mt-1 line-clamp-1 text-muted-foreground">
                          {msg.message}
                        </p>
                        {msg.tags.length > 0 && <div className="flex flex-wrap gap-1 mt-2">
                            {msg.tags.slice(0, 2).map((tag, idx) => <Badge key={idx} variant="outline" className="text-xs py-0">
                                {tag}
                              </Badge>)}
                            {msg.tags.length > 2 && <Badge variant="outline" className="text-xs py-0">
                                +{msg.tags.length - 2} more
                              </Badge>}
                          </div>}
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem>Mark as {msg.isRead ? 'Unread' : 'Read'}</ContextMenuItem>
                      <ContextMenuItem>Add Tag</ContextMenuItem>
                      <ContextMenuItem>Add to Contact Group</ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem className="text-red-600">Archive</ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>)}
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setShowNotes(!showNotes)}>
                      <StickyNote className="h-4 w-4 mr-2" />
                      {showNotes ? 'Hide' : 'Show'} Notes
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Tag className="h-4 w-4 mr-2" />
                      Manage Tags
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Forward</DropdownMenuItem>
                    <DropdownMenuItem>Print</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Block Contact</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {selectedMessage.tags.length > 0 && <div className="flex flex-wrap gap-1 mt-2">
                  {selectedMessage.tags.map((tag, idx) => <Badge key={idx} variant="outline" className="hover:bg-muted cursor-pointer group">
                      {tag}
                      <span className="ml-1 opacity-0 group-hover:opacity-100" onClick={e => {
                  e.stopPropagation();
                  removeTag(tag);
                }}>
                        ×
                      </span>
                    </Badge>)}
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    <Tag className="h-3 w-3 mr-1" /> 
                    Add Tag
                  </Button>
                </div>}
            </CardHeader>
            
            <div className="flex flex-col h-full">
              <div className="flex-grow overflow-auto p-4">
                <div className="space-y-4">
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                      <p className="text-sm">{selectedMessage.message}</p>
                      <div className="text-xs mt-1 text-muted-foreground flex justify-end">
                        {selectedMessage.date}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {showNotes && <div className="p-3 border-t bg-secondary/10">
                  <div className="flex items-center mb-2">
                    <StickyNote className="h-4 w-4 mr-2 text-muted-foreground" />
                    <h4 className="text-sm font-medium">Team Notes</h4>
                  </div>
                  
                  <div className="mb-2 max-h-[150px] overflow-y-auto">
                    {selectedMessage.notes.length > 0 ? selectedMessage.notes.map((note, index) => <div key={index} className="bg-background p-2 rounded-md mb-2 text-xs">
                          {note}
                        </div>) : <p className="text-xs text-muted-foreground">No notes yet</p>}
                  </div>
                  
                  <div className="flex gap-2 items-center">
                    <Input placeholder="Add a private team note..." className="text-xs h-8" value={newNote} onChange={e => setNewNote(e.target.value)} />
                    <Button size="sm" className="h-8" onClick={addNote}>Add</Button>
                  </div>
                </div>}
              
              {/* Tags input */}
              <div className="border-t p-2 bg-secondary/5">
                <div className="flex gap-2 items-center mb-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Add a tag..." className="text-xs h-7" value={currentTag} onChange={e => setCurrentTag(e.target.value)} onKeyDown={e => {
                  if (e.key === 'Enter') {
                    addTagToContact();
                  }
                }} />
                  <Button size="sm" className="h-7" onClick={addTagToContact}>Add</Button>
                </div>
              </div>

              {showTemplates && <div className="border-t p-3 bg-secondary/10">
                  <h4 className="text-sm font-medium mb-2">Message Templates</h4>
                  <div className="grid gap-2">
                    {messageTemplates.map(template => <Button key={template.id} variant="outline" className="justify-start text-left h-auto py-2" onClick={() => useTemplate(template.content)}>
                        <div>
                          <p className="font-medium">{template.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{template.content}</p>
                        </div>
                      </Button>)}
                  </div>
                </div>}

              {/* Attachments section */}
              {attachments.length > 0 && <div className="border-t p-3 bg-secondary/5">
                  <h4 className="text-sm font-medium mb-2">Attachments</h4>
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((file, index) => <div key={index} className="relative group">
                        <div className="border rounded-md p-1 bg-background flex items-center text-xs">
                          <span className="max-w-[100px] truncate">{file.name}</span>
                          <button className="ml-1 text-muted-foreground hover:text-foreground" onClick={() => removeAttachment(index)}>
                            ×
                          </button>
                        </div>
                      </div>)}
                  </div>
                </div>}
              
              <div className="border-t p-4">
                <div className="mb-3">
                  <Textarea placeholder="Type your reply here..." value={replyText} onChange={e => setReplyText(e.target.value)} className="min-h-[50px] resize-none" />
                </div>
                <div className="flex flex-wrap justify-between gap-2">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowTemplates(!showTemplates)}>
                      <FileText className="h-4 w-4 mr-1" />
                      Templates
                    </Button>
                    <Button variant="outline" size="sm" onClick={generateAIResponse}>
                      <Sparkles className="h-4 w-4 mr-1" />
                      AI Response
                    </Button>
                    <div>
                      <Input type="file" id="file-upload" className="hidden" multiple onChange={handleFileChange} />
                      <label htmlFor="file-upload">
                        <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                          <span>
                            <Paperclip className="h-4 w-4 mr-1" />
                            Attach
                          </span>
                        </Button>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-auto">
                    <Button variant="outline" size="sm" onClick={scheduleSend}>
                      <Clock className="h-4 w-4 mr-1" />
                      Schedule
                    </Button>
                    <Button className="bg-gtalkblue hover:bg-blue-600">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>;
};
export default Inbox;