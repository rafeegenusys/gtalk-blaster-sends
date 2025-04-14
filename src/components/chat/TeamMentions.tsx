
import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
}

interface TeamMentionsProps {
  value: string;
  onChange: (value: string) => void;
  onMention?: (userId: string) => void;
  teamMembers: TeamMember[];
}

export function TeamMentions({ value, onChange, onMention, teamMembers }: TeamMentionsProps) {
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const position = e.target.selectionStart || 0;
    
    onChange(newValue);
    setCursorPosition(position);
    
    // Check if we should show mentions dropdown
    const lastAtSymbol = newValue.lastIndexOf('@', position);
    if (lastAtSymbol !== -1) {
      const textAfterAt = newValue.slice(lastAtSymbol + 1, position);
      if (!textAfterAt.includes(' ')) {
        setMentionSearch(textAfterAt.toLowerCase());
        setShowMentions(true);
        return;
      }
    }
    
    setShowMentions(false);
  };

  const insertMention = (member: TeamMember) => {
    const lastAtSymbol = value.lastIndexOf('@', cursorPosition);
    if (lastAtSymbol === -1) return;

    const newValue = 
      value.slice(0, lastAtSymbol) + 
      `@${member.name} ` + 
      value.slice(cursorPosition);
    
    onChange(newValue);
    setShowMentions(false);
    if (onMention) onMention(member.id);
  };

  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(mentionSearch)
  );

  const getHighlightedText = (text: string) => {
    const parts = text.split(new RegExp(`(@${mentionSearch})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === `@${mentionSearch}`.toLowerCase() ? 
        <span key={i} className="bg-primary/20">{part}</span> : part
    );
  };

  return (
    <div className="relative w-full">
      <textarea
        value={value}
        onChange={handleInputChange}
        placeholder="Type your message... Use @ to mention team members"
        className="min-h-[100px] w-full resize-none rounded-md border border-input bg-background px-3 py-2"
      />
      
      {showMentions && filteredMembers.length > 0 && (
        <div className="absolute bottom-full left-0 mb-1 w-64 rounded-md border bg-popover p-1 shadow-md">
          {filteredMembers.map(member => (
            <button
              key={member.id}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1 text-sm hover:bg-muted"
              onClick={() => insertMention(member)}
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={member.avatar} />
                <AvatarFallback>
                  {member.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {getHighlightedText(member.name)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
