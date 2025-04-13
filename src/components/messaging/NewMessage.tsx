
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Send, MessageSquare, Search } from "lucide-react";
import { MessageThread } from "./MessageThread";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Template } from "@/components/templates/TemplateGrid";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { processTemplate } from "@/utils/templateHelpers";

// Importing the sample templates from TemplateGrid to ensure consistency
import { TemplateCard } from "@/components/templates/TemplateCard";

interface NewMessageProps {
  onSend: (phoneNumber: string, message: string) => void;
  onBack: () => void;
}

export function NewMessage({ onSend, onBack }: NewMessageProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showMessageThread, setShowMessageThread] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Import templates from the same source as the Templates page
  const [templates, setTemplates] = useState<Template[]>([]);
  
  // Fetch templates - in a real app, this would be from an API or context
  useEffect(() => {
    // Using the same sample data as TemplateGrid for consistency
    import("@/components/templates/TemplateGrid").then(module => {
      // Access the sampleTemplates from the imported module
      if (module && module.sampleTemplates) {
        setTemplates(module.sampleTemplates);
      }
    }).catch(err => {
      console.error("Failed to load templates:", err);
    });
  }, []);
  
  // Get unique categories from templates
  const categories = templates.length > 0 
    ? ["All", ...Array.from(new Set(templates.map(t => t.category)))] 
    : ["All"];
  
  // Filter templates based on search query and active category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = 
      searchQuery === "" || 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = 
      activeCategory === "all" || 
      template.category.toLowerCase() === activeCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });
  
  const handleContinue = () => {
    if (phoneNumber.trim()) {
      setShowMessageThread(true);
    }
  };
  
  const handleSendMessage = (text: string) => {
    onSend(phoneNumber, text);
  };

  const handleBackToPhoneInput = () => {
    setShowMessageThread(false);
  };
  
  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsTemplatesOpen(false);
  };

  // Create a temp contact from the phone number
  const tempContact = {
    id: "new",
    name: "",
    phone: phoneNumber,
    lastMessage: "",
    lastMessageTime: "Just now"
  };

  return (
    <div className="h-full flex flex-col">
      {!showMessageThread ? (
        <Card className="w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto mt-4 sm:mt-8">
          <CardHeader>
            <div className="flex items-center">
              <Button variant="ghost" onClick={onBack} className="mr-2 -ml-2">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardTitle>New Message</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="phone" className="text-sm font-medium block mb-1">
                  To:
                </label>
                <Input
                  id="phone"
                  placeholder="Enter phone number..."
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleContinue}
                  disabled={!phoneNumber.trim()}
                  className="flex-1"
                >
                  Continue
                </Button>
                
                <Dialog open={isTemplatesOpen} onOpenChange={setIsTemplatesOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex gap-1">
                      <MessageSquare className="h-4 w-4" />
                      Templates
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[680px] max-h-[80vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                      <DialogTitle>Select Template</DialogTitle>
                    </DialogHeader>
                    
                    <div className="flex items-center gap-2 my-2 px-1">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-8"
                      />
                    </div>
                    
                    <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex-1">
                      <TabsList className="mb-3 bg-muted/80 overflow-x-auto flex w-full gap-1">
                        {categories.map((category) => (
                          <TabsTrigger 
                            key={category.toLowerCase()} 
                            value={category.toLowerCase()}
                            className="text-xs px-3 py-1"
                          >
                            {category}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      
                      <ScrollArea className="flex-1 pr-4 h-[400px]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {filteredTemplates.map(template => (
                            <div 
                              key={template.id}
                              className="cursor-pointer"
                              onClick={() => handleSelectTemplate(template)}
                            >
                              <TemplateCard template={template} isCompact={true} />
                            </div>
                          ))}
                          
                          {filteredTemplates.length === 0 && (
                            <div className="col-span-full text-center py-8">
                              <p className="text-muted-foreground">No templates found matching your search.</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </div>
              
              {selectedTemplate && (
                <div className="pt-2 mt-2 border-t">
                  <p className="text-sm font-medium mb-1">Selected Template:</p>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm">{selectedTemplate.title}</h4>
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: selectedTemplate.color }}
                      ></div>
                    </div>
                    <p className="text-sm">{selectedTemplate.content}</p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      You'll be able to customize placeholders in the next step
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col h-full">
          <MessageThread
            activeContact={tempContact}
            messages={[]}
            onSendMessage={handleSendMessage}
            onBackClick={handleBackToPhoneInput}
            showBackButton={true}
            initialMessage={selectedTemplate?.content}
          />
        </div>
      )}
    </div>
  );
}
