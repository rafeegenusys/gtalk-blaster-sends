
import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

export function TeamMentions({
  value,
  onChange,
  onMention,
  teamMembers
}: TeamMentionsProps) {
  const [mentionIndex, setMentionIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mentionIndex !== null) {
      setFilteredMembers(
        teamMembers.filter(member => 
          member.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setSelectedIndex(0);
    }
  }, [searchTerm, teamMembers, mentionIndex]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Check for @ symbol
    const lastAtSymbol = newValue.lastIndexOf('@');
    if (lastAtSymbol !== -1) {
      // Check if @ is preceded by space or is at the beginning of text
      const isValidMention = lastAtSymbol === 0 || newValue[lastAtSymbol - 1] === ' ';
      if (isValidMention) {
        setMentionIndex(lastAtSymbol);
        setSearchTerm(newValue.slice(lastAtSymbol + 1).split(' ')[0]);
      } else {
        setMentionIndex(null);
      }
    } else {
      setMentionIndex(null);
    }
  };

  const insertMention = (member: TeamMember) => {
    if (mentionIndex !== null) {
      const beforeMention = value.substring(0, mentionIndex);
      const afterMention = value.substring(mentionIndex + searchTerm.length + 1);
      const newText = `${beforeMention}@${member.name} ${afterMention}`;
      onChange(newText);
      
      if (onMention) {
        onMention(member.id);
      }
    }
    
    setMentionIndex(null);
    setSearchTerm("");
    
    // Focus back on textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (mentionIndex === null || filteredMembers.length === 0) return;

    // Arrow navigation
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((selectedIndex + 1) % filteredMembers.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((selectedIndex - 1 + filteredMembers.length) % filteredMembers.length);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      insertMention(filteredMembers[selectedIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setMentionIndex(null);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        placeholder="Type a message... Use @ to mention team members"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="resize-none min-h-[80px]"
      />
      
      {mentionIndex !== null && filteredMembers.length > 0 && (
        <div 
          ref={menuRef}
          className="absolute z-10 mt-1 bg-card border rounded-md shadow-lg w-64"
        >
          <ScrollArea className="h-auto max-h-[200px]">
            {filteredMembers.map((member, index) => (
              <div
                key={member.id}
                className={`flex items-center gap-2 p-2 cursor-pointer hover:bg-accent ${
                  index === selectedIndex ? 'bg-accent' : ''
                }`}
                onClick={() => insertMention(member)}
              >
                <Avatar className="h-6 w-6">
                  {member.avatar && <AvatarImage src={member.avatar} />}
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{member.name}</span>
              </div>
            ))}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
