
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Smile } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { TeamMentions } from "./TeamMentions";

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
}

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onMention: (userId: string) => void;
  teamMembers: TeamMember[];
}

export function MessageInput({ onSendMessage, onFileUpload, onMention, teamMembers }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleEmojiSelect = (emoji: any) => {
    setMessage(prev => prev + emoji.native);
  };

  const handleSend = async () => {
    if (message.trim()) {
      await onSendMessage(message.trim());
      setMessage("");
    }
  };

  return (
    <div className="border-t p-4 space-y-4">
      <TeamMentions 
        value={message}
        onChange={setMessage}
        onMention={onMention}
        teamMembers={teamMembers}
      />
      
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Smile className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Picker 
              data={data} 
              onEmojiSelect={handleEmojiSelect}
              theme="light"
            />
          </PopoverContent>
        </Popover>
        
        <label htmlFor="file-upload-team" className="cursor-pointer">
          <Button variant="ghost" size="icon" type="button" className="h-8 w-8">
            <Paperclip className="h-4 w-4" />
          </Button>
          <input 
            id="file-upload-team" 
            type="file" 
            className="hidden" 
            onChange={onFileUpload} 
          />
        </label>
        
        <Button 
          onClick={handleSend} 
          disabled={!message.trim()}
          className="ml-auto"
        >
          <Send className="h-4 w-4 mr-2" />
          Send
        </Button>
      </div>
    </div>
  );
}
