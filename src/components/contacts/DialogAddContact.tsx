
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
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DialogAddContactProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddContact?: (contact: any) => void;
}

export function DialogAddContact({ open, onOpenChange, onAddContact }: DialogAddContactProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const { toast } = useToast();

  const handleAddTag = () => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setTags([...tags, tag.trim()]);
      setTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim()) {
      toast({
        title: "Missing information",
        description: "Name and phone number are required.",
        variant: "destructive",
      });
      return;
    }
    
    const newContact = {
      id: `contact-${Date.now()}`,
      name,
      phone,
      email,
      company,
      notes,
      tags,
      created_at: new Date().toISOString(),
    };
    
    if (onAddContact) {
      onAddContact(newContact);
    }
    
    // Reset form
    setName("");
    setPhone("");
    setEmail("");
    setCompany("");
    setNotes("");
    setTags([]);
    
    // Close dialog
    onOpenChange(false);
    
    toast({
      title: "Contact added",
      description: `${name} has been added to your contacts.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
          <DialogDescription>
            Create a new contact to start messaging with them.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Company name"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add tag and press Enter"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddTag}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((t) => (
                <Badge key={t} variant="secondary" className="px-2 py-1">
                  {t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional information about this contact"
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="submit">Add Contact</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
