import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Tag, FolderOpen, ChevronLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Template } from "@/components/templates/TemplateGrid";
import { TemplateCard } from "@/components/templates/TemplateCard";

interface NewMessageProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: (phoneNumber: string, message: string) => void;
  onBack?: () => void; // Add optional onBack prop
}

export function NewMessage({ open, onOpenChange, onSend, onBack }: NewMessageProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const handleSend = () => {
    if (phoneNumber && (message || selectedTemplate)) {
      onSend(phoneNumber, selectedTemplate?.content || message);
      setPhoneNumber("");
      setMessage("");
      setSelectedTemplate(null);
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
              <Input
                placeholder="Enter phone number..."
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="dark:bg-background"
              />
            </div>

            <Tabs defaultValue="message" className="w-full">
              <TabsList className="dark:bg-background">
                <TabsTrigger value="message">Message</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>

              <TabsContent value="message" className="mt-4">
                <textarea
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full h-32 p-2 border rounded-md dark:bg-background dark:text-foreground"
                />
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
                  <Badge
                    variant={activeCategory === "all" ? "default" : "outline"}
                    onClick={() => setActiveCategory("all")}
                    className="cursor-pointer"
                  >
                    All
                  </Badge>
                  {/* Add more category badges */}
                </div>

                <ScrollArea className="h-[300px]">
                  {/* Add template grid here */}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={!phoneNumber || (!message && !selectedTemplate)}>
            Send Message
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
