
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface OpenInternalThreadProps {
  messageId: string;
  onOpenThread: (messageId: string) => void;
}

export function OpenInternalThread({ messageId, onOpenThread }: OpenInternalThreadProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-muted"
            onClick={() => onOpenThread(messageId)}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Open internal thread</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
