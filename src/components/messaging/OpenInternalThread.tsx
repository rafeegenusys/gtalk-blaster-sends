
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

interface OpenInternalThreadProps {
  message: {
    id: string;
    content: string;
    sender?: string;
    timestamp: string;
  };
  contactName?: string;
}

export function OpenInternalThread({ message, contactName }: OpenInternalThreadProps) {
  const navigate = useNavigate();

  const handleOpenThread = () => {
    // Store message info in sessionStorage to be retrieved in chat
    sessionStorage.setItem('threadContext', JSON.stringify({
      messageId: message.id,
      content: message.content,
      sender: contactName,
      timestamp: message.timestamp
    }));
    navigate('/chat');
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenThread}
            className="text-muted-foreground hover:text-foreground"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Discuss internally</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
