
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Send, MessageSquare } from "lucide-react";
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

// Sample templates for demo
const sampleTemplates = [
  {
    id: "1",
    title: "Welcome Message",
    content: "Hi {{name}}, welcome to our service! How can we help you today?",
    tags: ["welcome", "intro"],
    category: "General",
    color: "#8B5CF6", // Purple
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01"
  },
  {
    id: "2", 
    title: "Appointment Reminder",
    content: "Hello {{name}}, this is a reminder about your appointment on {{date}} at {{time}}. Please reply to confirm.",
    tags: ["appointment", "reminder"],
    category: "Scheduling",
    color: "#0EA5E9", // Blue
    createdAt: "2025-04-02",
    updatedAt: "2025-04-05"
  },
  {
    id: "3",
    title: "Follow-up",
    content: "Hi {{name}}, just following up on our conversation about {{topic}}. Do you have any questions?",
    tags: ["follow-up", "sales"],
    category: "Sales",
    color: "#F97316", // Orange
    createdAt: "2025-04-03",
    updatedAt: "2025-04-06"
  }
];

interface NewMessageProps {
  onSend: (phoneNumber: string, message: string) => void;
  onBack: () => void;
}

export function NewMessage({ onSend, onBack }: NewMessageProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showMessageThread, setShowMessageThread] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  
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
                  <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Select Template</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-3">
                      {sampleTemplates.map(template => (
                        <div 
                          key={template.id}
                          className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSelectTemplate(template)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-sm">{template.title}</h4>
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: template.color }}
                            ></div>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {template.content}
                          </p>
                          <div className="mt-2 flex gap-1 flex-wrap">
                            {template.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs bg-muted/50">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
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
