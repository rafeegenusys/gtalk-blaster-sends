
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Send } from "lucide-react";
import { MessageThread } from "./MessageThread";

interface NewMessageProps {
  onSend: (phoneNumber: string, message: string) => void;
  onBack: () => void;
}

export function NewMessage({ onSend, onBack }: NewMessageProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showMessageThread, setShowMessageThread] = useState(false);
  
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
              
              <Button 
                onClick={handleContinue}
                disabled={!phoneNumber.trim()}
                className="w-full mt-2"
              >
                Continue
              </Button>
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
          />
        </div>
      )}
    </div>
  );
}
