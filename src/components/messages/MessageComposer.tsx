
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Clock, Image, SendHorizonal, Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";

export function MessageComposer() {
  const [message, setMessage] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedMedia([...selectedMedia, ...filesArray].slice(0, 5)); // Limit to 5 files
    }
  };

  const removeSelectedFile = (index: number) => {
    const newFiles = [...selectedMedia];
    newFiles.splice(index, 1);
    setSelectedMedia(newFiles);
  };

  const calculateCredits = () => {
    // Basic calculation - 1 credit per SMS, 3 per MMS
    const baseCredits = 1;
    const mediaCredits = selectedMedia.length > 0 ? 2 : 0;
    return baseCredits + mediaCredits;
  };

  const characterCount = message.length;
  const smsCount = Math.ceil(characterCount / 160);

  return (
    <Card className="flex-1 shadow-sm">
      <CardHeader>
        <CardTitle>New Message</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="recipients">Recipients</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select recipients" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Contacts</SelectItem>
              <SelectItem value="customers">Customers Group</SelectItem>
              <SelectItem value="leads">Leads Group</SelectItem>
              <SelectItem value="custom">Custom Selection</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">3 groups / 145 contacts selected</p>
        </div>

        <div>
          <Label htmlFor="template">Template</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a template (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="welcome">Welcome Message</SelectItem>
              <SelectItem value="followup">Follow Up</SelectItem>
              <SelectItem value="promotion">Promotion</SelectItem>
              <SelectItem value="none">No Template</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <Label htmlFor="message">Message</Label>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAiSuggestions(!showAiSuggestions)}
              >
                <Sparkles className="h-4 w-4 mr-1" />
                AI Assistant
              </Button>
            </div>
          </div>
          <Textarea 
            id="message" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..." 
            className="min-h-[150px]"
          />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>{characterCount} characters</span>
            <span>{smsCount} SMS ({calculateCredits()} credits)</span>
          </div>

          {showAiSuggestions && (
            <Card className="mt-2 bg-slate-50">
              <CardContent className="p-3">
                <p className="text-sm font-medium mb-2">AI Message Suggestions</p>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start text-xs"
                    onClick={() => setMessage("Thank you for your recent purchase! If you have any questions about your order, please reply to this message.")}
                  >
                    Thank you for your recent purchase! If you have any questions about your order, please reply to this message.
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start text-xs"
                    onClick={() => setMessage("Just a friendly reminder that your appointment is scheduled for tomorrow. Reply Y to confirm or N to reschedule.")}
                  >
                    Just a friendly reminder that your appointment is scheduled for tomorrow. Reply Y to confirm or N to reschedule.
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Label>Media (optional)</Label>
          <div className="border-2 border-dashed rounded-md p-4 mt-1 text-center">
            <Input 
              type="file" 
              multiple
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/gif,video/mp4,video/3gpp"
              className="hidden"
              id="media-upload"
            />
            <Label htmlFor="media-upload" className="cursor-pointer flex flex-col items-center">
              <Image className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Click to upload</p>
              <p className="text-xs text-muted-foreground">
                Up to 5 images (JPEG, PNG, GIF) or 1 video (MP4, 3GP)
              </p>
            </Label>
          </div>

          {selectedMedia.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedMedia.map((file, index) => (
                <div key={index} className="relative">
                  <div className="border rounded-md p-2 w-16 h-16 flex items-center justify-center">
                    {file.type.startsWith('image/') ? (
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt="Preview" 
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <video className="max-w-full max-h-full object-contain">
                        <source src={URL.createObjectURL(file)} type={file.type} />
                      </video>
                    )}
                  </div>
                  <button 
                    className="absolute -top-1 -right-1 bg-gtalkred text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                    onClick={() => removeSelectedFile(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t px-6 py-4 flex justify-between">
        <Button variant="outline" className="gap-2">
          <Clock className="h-4 w-4" />
          Schedule
        </Button>
        <Button className="gap-2 bg-gtalkblue hover:bg-blue-600">
          <SendHorizonal className="h-4 w-4" />
          Send Now
        </Button>
      </CardFooter>
    </Card>
  );
}
