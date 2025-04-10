
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Clock, Image, SendHorizonal, Sparkles, Upload, AlertCircle, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MessageComposerProps {
  selectedCount?: number;
}

export function MessageComposer({ selectedCount = 0 }: MessageComposerProps) {
  const [message, setMessage] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState("text");

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
  const totalCredits = selectedCount * calculateCredits();

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>Compose Message</CardTitle>
          <div className="flex items-center gap-2">
            {selectedCount > 0 && (
              <Badge variant="outline" className="ml-2 bg-muted">
                {selectedCount} recipient{selectedCount !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-4">
        <Tabs defaultValue="text" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="text">Text Message</TabsTrigger>
            <TabsTrigger value="media">Media Message (MMS)</TabsTrigger>
          </TabsList>
        
          {/* Text Tab */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="message">Message</Label>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowAiSuggestions(!showAiSuggestions)}
                    className={showAiSuggestions ? "bg-muted" : ""}
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
                className="min-h-[150px] resize-y"
              />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>{characterCount} characters</span>
                <span>{smsCount} SMS ({calculateCredits()} credits per recipient)</span>
              </div>
            </div>

            {activeTab === "media" && (
              <div className="mt-4">
                <Label className="mb-2 block">Attachments (MMS)</Label>
                <div className="border-2 border-dashed rounded-md p-4 text-center">
                  <Input 
                    type="file" 
                    multiple
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/gif,video/mp4,video/3gpp"
                    className="hidden"
                    id="media-upload"
                    max={5}
                  />
                  <Label htmlFor="media-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Click or drag files to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Up to 5 images (JPEG, PNG, GIF) or 1 video (MP4, 3GP)
                    </p>
                  </Label>
                </div>

                {selectedMedia.length > 0 && (
                  <div className="mt-4">
                    <Label className="mb-2 block">Selected Media ({selectedMedia.length}/5)</Label>
                    <div className="flex flex-wrap gap-3">
                      {selectedMedia.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="border rounded-md p-2 w-24 h-24 flex items-center justify-center overflow-hidden bg-muted/30">
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
                            className="absolute -top-2 -right-2 bg-gtalkred text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            onClick={() => removeSelectedFile(index)}
                          >
                            ×
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 text-xs bg-background/80 text-center truncate px-1">
                            {file.name.substring(0, 10)}{file.name.length > 10 ? "..." : ""}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {showAiSuggestions && (
              <Card className="mt-4 bg-slate-50">
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => setMessage("Special offer for our valued customers! Get 15% off your next purchase with code SPECIAL15. Valid until the end of the month.")}
                    >
                      Special offer for our valued customers! Get 15% off your next purchase with code SPECIAL15. Valid until the end of the month.
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t px-6 py-4 flex justify-between items-center bg-muted/20">
        <div className="text-sm">
          <span className="font-medium">Total Credits:</span> {totalCredits > 0 ? totalCredits : "—"}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Clock className="h-4 w-4" />
            Schedule
          </Button>
          <Button className="gap-2 bg-gtalkblue hover:bg-blue-600">
            <SendHorizonal className="h-4 w-4" />
            Send Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
