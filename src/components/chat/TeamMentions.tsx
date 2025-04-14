
import React from 'react';
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface TeamMember {
  id: string;
  name: string;
}

interface TeamMentionsProps {
  isOpen: boolean;
  onSelect: (member: TeamMember) => void;
  onOpenChange: (open: boolean) => void;
  searchTerm: string;
  teamMembers: TeamMember[];
  triggerRef: React.RefObject<HTMLDivElement>;
}

export function TeamMentions({ 
  isOpen, 
  onSelect, 
  onOpenChange, 
  searchTerm, 
  teamMembers,
  triggerRef 
}: TeamMentionsProps) {
  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <div ref={triggerRef} className="w-0 h-0" />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <Command>
          <CommandGroup heading="Team members">
            {filteredMembers.map((member) => (
              <CommandItem
                key={member.id}
                onSelect={() => onSelect(member)}
                className="flex items-center gap-2 px-2 py-1.5"
              >
                <Avatar className="h-6 w-6">
                  <AvatarFallback>
                    {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{member.name}</span>
              </CommandItem>
            ))}
            {filteredMembers.length === 0 && (
              <CommandItem disabled className="px-2 py-1.5 text-muted-foreground">
                No team members found
              </CommandItem>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
