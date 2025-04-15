
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, File, X, Image } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AttachmentButtonProps {
  onAttach: (files: File[]) => void;
  attachments: File[];
  onRemove: (index: number) => void;
  disabled?: boolean;
}

export function AttachmentButton({ 
  onAttach, 
  attachments, 
  onRemove, 
  disabled 
}: AttachmentButtonProps) {
  const [showAttachmentDialog, setShowAttachmentDialog] = useState(false);

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const selectedFiles = Array.from(e.target.files);
    const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    
    // 10 MB limit as example
    if (totalSize > 10 * 1024 * 1024) {
      toast({
        title: "File size exceeds limit",
        description: "Total attachment size cannot exceed 10MB",
        variant: "destructive",
      });
      return;
    }
    
    onAttach(selectedFiles);
    e.target.value = ""; // Reset the input
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className={attachments.length > 0 ? "relative bg-accent" : ""}
            disabled={disabled}
          >
            <Paperclip size={18} />
            {attachments.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                {attachments.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-3" side="top">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Attachments</h4>
              <label 
                htmlFor="file-upload" 
                className="text-xs text-primary hover:underline cursor-pointer"
              >
                Add file
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileSelection}
              />
            </div>
            
            {attachments.length > 0 ? (
              <ScrollArea className="max-h-40">
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between bg-muted p-2 rounded-md text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {getFileIcon(file)}
                        <span className="truncate max-w-[130px]">{file.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {formatFileSize(file.size)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => onRemove(index)}
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="py-2 text-center text-sm text-muted-foreground">
                No attachments yet
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
