
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Image as ImageIcon, Plus } from "lucide-react";

interface DialogAddTemplateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DialogAddTemplate({ open, onOpenChange }: DialogAddTemplateProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [color, setColor] = useState("#8B5CF6");
  const [hasImage, setHasImage] = useState(false);

  // Available template categories
  const categories = ["General", "Scheduling", "Marketing", "Sales", "Support", "Other"];
  
  // Available template colors
  const colors = [
    { label: "Purple", value: "#8B5CF6" },
    { label: "Blue", value: "#0EA5E9" },
    { label: "Green", value: "#10B981" },
    { label: "Orange", value: "#F97316" },
    { label: "Pink", value: "#D946EF" },
    { label: "Red", value: "#EF4444" }
  ];

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a template title",
        variant: "destructive"
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter template content",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, save the template to the database here
    toast({
      title: "Template created",
      description: "Your new template has been created successfully"
    });
    
    // Reset form and close dialog
    setTitle("");
    setContent("");
    setCategory("General");
    setTags([]);
    setNewTag("");
    setColor("#8B5CF6");
    setHasImage(false);
    onOpenChange(false);
  };
  
  const addPlaceholder = (placeholder: string) => {
    setContent(prev => prev + `{{${placeholder}}}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
          <DialogDescription>
            Create a message template with placeholders for personalized messages.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Template Name</Label>
            <Input
              id="title"
              placeholder="Enter template name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="color">Color</Label>
              <Select value={color} onValueChange={setColor}>
                <SelectTrigger id="color">
                  <SelectValue placeholder="Select color">
                    <div className="flex items-center">
                      <div 
                        className="h-3 w-3 rounded-full mr-2" 
                        style={{ backgroundColor: color }}
                      />
                      {colors.find(c => c.value === color)?.label || "Color"}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {colors.map(color => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center">
                        <div 
                          className="h-3 w-3 rounded-full mr-2" 
                          style={{ backgroundColor: color.value }}
                        />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <Badge key={tag} className="bg-muted/70 hover:bg-muted/90 pl-2">
                  {tag}
                  <button 
                    type="button" 
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddTag}
              >
                Add
              </Button>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-muted/90"
                onClick={() => addPlaceholder("name")}
              >
                + name
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-muted/90"
                onClick={() => addPlaceholder("date")}
              >
                + date
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-muted/90"
                onClick={() => addPlaceholder("time")}
              >
                + time
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-muted/90"
                onClick={() => addPlaceholder("company")}
              >
                + company
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-muted/90"
                onClick={() => addPlaceholder("custom")}
              >
                + custom
              </Badge>
            </div>
            <Textarea
              id="content"
              placeholder="Enter template content..."
              className="min-h-[120px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Image</Label>
            <div className="flex items-center">
              <Button 
                type="button" 
                variant="outline" 
                className={`flex items-center ${hasImage ? 'text-primary' : ''}`}
                onClick={() => setHasImage(!hasImage)}
              >
                <ImageIcon size={16} className="mr-2" />
                {hasImage ? "Remove Image" : "Add Image"}
              </Button>
              {hasImage && (
                <span className="ml-2 text-xs text-muted-foreground">
                  Image will be added when template is created
                </span>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
