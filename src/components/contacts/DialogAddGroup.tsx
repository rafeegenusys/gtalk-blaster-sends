
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DialogAddGroupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddGroup?: (group: any) => void;
}

export function DialogAddGroup({ open, onOpenChange, onAddGroup }: DialogAddGroupProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Missing information",
        description: "Group name is required.",
        variant: "destructive",
      });
      return;
    }
    
    const newGroup = {
      id: `group-${Date.now()}`,
      name,
      description,
      memberCount: 0,
      created_at: new Date().toISOString(),
    };
    
    if (onAddGroup) {
      onAddGroup(newGroup);
    }
    
    // Reset form
    setName("");
    setDescription("");
    
    // Close dialog
    onOpenChange(false);
    
    toast({
      title: "Group created",
      description: `Group "${name}" has been created.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Create a new group to organize your contacts.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Group description (optional)"
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="submit">Create Group</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
