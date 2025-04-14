
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Tag, CheckCheck, ChevronLeft, Clock, Users, User, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Template, sampleTemplates } from "@/components/templates/TemplateGrid";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { AIAssistant } from "@/components/messaging/AIAssistant"; 
import { CancelConditions } from "@/components/scheduler/CancelConditions";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

interface Group {
  id: string;
  name: string;
  memberCount: number;
}

interface NewMessageProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: (phoneNumber: string, message: string, scheduledTime?: Date, cancelIfResponse?: boolean) => void;
  onBack?: () => void;
}

export function NewMessage({ open, onOpenChange, onSend, onBack }: NewMessageProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [scheduledTime, setScheduledTime] = useState<string>("08:00");
  const [timezone, setTimezone] = useState("America/New_York");
  const [cancelIfResponse, setCancelIfResponse] = useState<boolean>(false);
  const [showContactSelector, setShowContactSelector] = useState(false);
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [templates, setTemplates] = useState<Template[]>(sampleTemplates);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch contacts and groups
  useEffect(() => {
    if (!user) return;
    
    const fetchContactsAndGroups = async () => {
      try {
        // Get user's business ID
        const { data: profileData } = await supabase
          .from('profiles')
          .select('business_id')
          .eq('id', user.id)
          .single();
        
        if (!profileData?.business_id) return;
        
        // Fetch contacts
        const { data: contactsData } = await supabase
          .from('contacts')
          .select('id, name, phone, email')
          .eq('business_id', profileData.business_id);
          
        if (contactsData) {
          setContacts(contactsData);
          setFilteredContacts(contactsData);
        }
        
        // Fetch groups
        const { data: groupsData } = await supabase
          .from('groups')
          .select('id, name')
          .eq('business_id', profileData.business_id);
          
        if (groupsData) {
          // Get member count for each group
          const groupsWithMembers = await Promise.all(
            groupsData.map(async (group) => {
              const { count } = await supabase
                .from('group_contacts')
                .select('*', { count: 'exact', head: true })
                .eq('group_id', group.id);
                
              return {
                ...group,
                memberCount: count || 0
              };
            })
          );
          
          setGroups(groupsWithMembers);
          setFilteredGroups(groupsWithMembers);
        }
      } catch (error) {
        console.error('Error fetching contacts and groups:', error);
      }
    };
    
    fetchContactsAndGroups();
  }, [user]);
  
  // Filter contacts based on search
  useEffect(() => {
    if (searchQuery) {
      const filtered = contacts.filter(contact => 
        contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        contact.phone.includes(searchQuery) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredContacts(filtered);
      
      const filteredG = groups.filter(group => 
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredGroups(filteredG);
    } else {
      setFilteredContacts(contacts);
      setFilteredGroups(groups);
    }
  }, [searchQuery, contacts, groups]);

  // Filter templates based on search, category, and tag
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      searchQuery === "" || 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = 
      activeCategory === "all" || 
      template.category.toLowerCase() === activeCategory.toLowerCase();
    
    const matchesTag = 
      !activeTag ||
      template.tags.includes(activeTag);
    
    return matchesSearch && matchesCategory && matchesTag;
  });
  
  // Get unique categories and tags from templates
  const categories = ["all", ...Array.from(new Set(templates.map(t => t.category.toLowerCase())))];
  const tags = Array.from(new Set(templates.flatMap(t => t.tags)));
  
  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setMessage(template.content);
    // Close templates tab
    document.getElementById('message-tab')?.click();
  };

  const handleSelectTag = (tag: string) => {
    setActiveTag(prevTag => prevTag === tag ? null : tag);
  };
  
  const handleSelectContact = (contact: Contact) => {
    setPhoneNumber(contact.phone);
    setShowContactSelector(false);
  };
  
  const handleSelectGroup = (group: Group) => {
    // In a real app, you'd handle group messaging differently
    // For now, just show a notification
    toast({
      title: `Group: ${group.name}`,
      description: `You selected a group with ${group.memberCount} members. This would send the message to all members.`,
    });
    setShowGroupSelector(false);
  };
  
  const handleEmojiSelect = (emoji: any) => {
    setMessage(prev => prev + emoji.native);
  };
  
  const handleAISuggestion = (suggestion: string) => {
    setMessage(suggestion);
  };

  const handleSend = () => {
    if (phoneNumber && (message || selectedTemplate)) {
      if (showScheduler && scheduledDate) {
        // Parse time from HH:MM format
        const [hours, minutes] = scheduledTime.split(':').map(Number);
        const scheduledDateTime = new Date(scheduledDate);
        scheduledDateTime.setHours(hours, minutes);
        
        onSend(phoneNumber, message, scheduledDateTime, cancelIfResponse);
      } else {
        onSend(phoneNumber, message);
      }
      
      // Reset form
      setPhoneNumber("");
      setMessage("");
      setSelectedTemplate(null);
      setShowScheduler(false);
      setScheduledDate(undefined);
      setCancelIfResponse(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col dark:bg-card">
        <DialogHeader>
          {onBack && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute left-2 top-2 p-0 w-8 h-8"
              onClick={onBack}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Enter phone number..."
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="dark:bg-background flex-1"
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setShowContactSelector(true)}
                  title="Select contact"
                >
                  <User size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setShowGroupSelector(true)}
                  title="Select group"
                >
                  <Users size={16} />
                </Button>
              </div>
              
              {showContactSelector && (
                <div className="border rounded-md mt-2 overflow-hidden">
                  <div className="p-2 border-b flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search contacts..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-0 h-8"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2"
                      onClick={() => setShowContactSelector(false)}
                    >
                      Close
                    </Button>
                  </div>
                  <ScrollArea className="h-48">
                    {filteredContacts.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No contacts found
                      </div>
                    ) : (
                      <div>
                        {filteredContacts.map(contact => (
                          <div 
                            key={contact.id} 
                            className="p-2 hover:bg-accent cursor-pointer flex items-center justify-between"
                            onClick={() => handleSelectContact(contact)}
                          >
                            <div>
                              <p className="font-medium">{contact.name || "Unnamed"}</p>
                              <p className="text-xs text-muted-foreground">{contact.phone}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <CheckCheck className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              )}
              
              {showGroupSelector && (
                <div className="border rounded-md mt-2 overflow-hidden">
                  <div className="p-2 border-b flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search groups..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-0 h-8"
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2"
                      onClick={() => setShowGroupSelector(false)}
                    >
                      Close
                    </Button>
                  </div>
                  <ScrollArea className="h-48">
                    {filteredGroups.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No groups found
                      </div>
                    ) : (
                      <div>
                        {filteredGroups.map(group => (
                          <div 
                            key={group.id} 
                            className="p-2 hover:bg-accent cursor-pointer flex items-center justify-between"
                            onClick={() => handleSelectGroup(group)}
                          >
                            <div>
                              <p className="font-medium">{group.name}</p>
                              <p className="text-xs text-muted-foreground">{group.memberCount} members</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <CheckCheck className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              )}
            </div>

            <Tabs defaultValue="message" className="w-full">
              <TabsList className="dark:bg-background">
                <TabsTrigger value="message" id="message-tab">Message</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="ai">AI Assist</TabsTrigger>
              </TabsList>

              <TabsContent value="message" className="mt-4 space-y-4">
                <textarea
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full h-32 p-2 border rounded-md dark:bg-background dark:text-foreground"
                />
                
                <div className="flex items-center gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Picker 
                          data={data}
                          onEmojiSelect={handleEmojiSelect}
                          theme="light"
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Picker 
                        data={data}
                        onEmojiSelect={handleEmojiSelect}
                        theme="light"
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={showScheduler ? 'bg-accent' : ''}
                    onClick={() => setShowScheduler(!showScheduler)}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                </div>
                
                {showScheduler && (
                  <div className="border rounded-md p-3 space-y-3">
                    <h4 className="text-sm font-medium">Schedule this message</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs mb-1">Date</p>
                        <CalendarComponent
                          mode="single"
                          selected={scheduledDate}
                          onSelect={setScheduledDate}
                          initialFocus
                          className="border rounded-md"
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs mb-1">Time</p>
                          <Input
                            type="time"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <p className="text-xs mb-1">Timezone</p>
                          <Select defaultValue={timezone} onValueChange={setTimezone}>
                            <SelectTrigger>
                              <SelectValue placeholder="Timezone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="America/New_York">Eastern Time</SelectItem>
                              <SelectItem value="America/Chicago">Central Time</SelectItem>
                              <SelectItem value="America/Denver">Mountain Time</SelectItem>
                              <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <CancelConditions
                          cancelIfResponse={cancelIfResponse}
                          onCancelIfResponseChange={setCancelIfResponse}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="templates" className="mt-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="dark:bg-background"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={activeCategory === category ? "default" : "outline"}
                      onClick={() => setActiveCategory(category)}
                      className="cursor-pointer capitalize"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Tag className="h-3 w-3 mr-1" /> Filter:
                  </span>
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={activeTag === tag ? "default" : "outline"}
                      onClick={() => handleSelectTag(tag)}
                      className="cursor-pointer"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <ScrollArea className="h-[300px] pr-4">
                  <div className="grid grid-cols-1 gap-3">
                    {filteredTemplates.length === 0 ? (
                      <div className="text-center p-4 text-muted-foreground">
                        No templates found matching your criteria.
                      </div>
                    ) : (
                      filteredTemplates.map((template) => (
                        <div 
                          key={template.id} 
                          className="cursor-pointer"
                          onClick={() => handleSelectTemplate(template)}
                        >
                          <TemplateCard template={template} isCompact={true} />
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="ai" className="mt-4">
                <AIAssistant
                  messages={[]}  // Could pass in previous conversation context
                  activeContact={null}
                  onSelectSuggestion={handleAISuggestion}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={!phoneNumber || (!message && !selectedTemplate)}
          >
            {showScheduler && scheduledDate ? 'Schedule Message' : 'Send Message'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
