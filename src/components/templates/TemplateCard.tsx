
import { useState } from "react";
import { Template } from "./TemplateGrid";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Edit, 
  Copy, 
  Trash2, 
  MessageSquare, 
  MoreHorizontal, 
  Image 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { DialogEditTemplate } from "./DialogEditTemplate";
import { useToast } from "@/components/ui/use-toast";
import { extractPlaceholders } from "@/utils/templateHelpers";

interface TemplateCardProps {
  template: Template;
  isCompact?: boolean;
}

export function TemplateCard({ template, isCompact = false }: TemplateCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { toast } = useToast();
  
  // Format the updated date
  const formattedDate = formatDistanceToNow(new Date(template.updatedAt), { addSuffix: true });
  
  // Extract placeholders from content
  const placeholders = extractPlaceholders(template.content);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(template.content);
    toast({
      title: "Template copied",
      description: "Template content copied to clipboard"
    });
  };
  
  const handleUse = () => {
    toast({
      title: "Template selected",
      description: "Template has been added to your message"
    });
    // In a real app, you would pass this to the message composer
  };
  
  const handleDelete = () => {
    toast({
      title: "Template deleted",
      description: "The template has been deleted"
    });
    // In a real app, you would delete from the database
  };

  if (isCompact) {
    // Compact version for template selection dialog
    return (
      <Card className="hover:shadow-md transition-shadow duration-200 h-full border overflow-hidden">
        <div className="h-1" style={{ backgroundColor: template.color || '#8B5CF6' }}></div>
        <CardContent className="p-3">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-medium text-sm line-clamp-1">{template.title}</h3>
          </div>
          
          <div className="flex gap-1 flex-wrap my-1">
            {template.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs bg-muted/70 py-0">
                {tag}
              </Badge>
            ))}
            {template.tags.length > 2 && (
              <Badge variant="outline" className="text-xs bg-muted/70 py-0">
                +{template.tags.length - 2}
              </Badge>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {template.content}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="flex flex-col h-full hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2 relative" style={{ borderTop: `3px solid ${template.color || '#8B5CF6'}` }}>
          <div className="flex justify-between">
            <h3 className="font-medium line-clamp-1">{template.title}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopy}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex gap-1 flex-wrap mt-1">
            {template.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs bg-muted/70">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent className="pb-2 flex-grow">
          <div className="text-sm text-muted-foreground line-clamp-3">
            {template.hasImage && (
              <div className="mb-1 text-xs flex items-center text-primary">
                <Image className="h-3 w-3 mr-1" /> Contains image
              </div>
            )}
            {template.content.split(/{{[^}]+}}/).map((part, index) => (
              <span key={index}>
                {part}
                {index < placeholders.length && (
                  <Badge variant="secondary" className="mx-0.5 text-xs py-0 px-1 bg-muted">
                    {placeholders[index]}
                  </Badge>
                )}
              </span>
            ))}
          </div>
        </CardContent>
        <CardFooter className="pt-2 border-t flex justify-between items-center">
          <div className="text-xs text-muted-foreground flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>Updated {formattedDate}</span>
          </div>
          <Button size="sm" onClick={handleUse} className="bg-gtalk-primary hover:bg-gtalk-primary/90 text-white h-7">
            <MessageSquare className="h-3.5 w-3.5 mr-1" />
            Use
          </Button>
        </CardFooter>
      </Card>
      
      <DialogEditTemplate
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        template={template}
      />
    </>
  );
}
