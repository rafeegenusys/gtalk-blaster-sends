
import { Search, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Group {
  id: string;
  name: string;
  memberCount: number;
}

interface GroupSelectorProps {
  groups: Group[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectGroup: (group: Group) => void;
  onClose: () => void;
}

export function GroupSelector({
  groups,
  searchQuery,
  onSearchChange,
  onSelectGroup,
  onClose
}: GroupSelectorProps) {
  return (
    <div className="border rounded-md mt-2 overflow-hidden">
      <div className="p-2 border-b flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search groups..." 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border-0 h-8"
        />
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
      <ScrollArea className="h-48">
        {groups.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No groups found
          </div>
        ) : (
          <div>
            {groups.map(group => (
              <div 
                key={group.id} 
                className="p-2 hover:bg-accent cursor-pointer flex items-center justify-between"
                onClick={() => onSelectGroup(group)}
              >
                <div>
                  <p className="font-medium">{group.name}</p>
                  <p className="text-xs text-muted-foreground">{group.memberCount} members</p>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <CheckCheck className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
