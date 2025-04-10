
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MessageSquare, Users, Pencil, Trash2 } from "lucide-react";

interface ScheduledMessageProps {
  id: string;
  content: string;
  date: string;
  time: string;
  recipients: number;
  messageType: "SMS" | "MMS";
  recurring?: boolean;
}

export function ScheduledMessageCard({
  id,
  content,
  date,
  time,
  recipients,
  messageType,
  recurring
}: ScheduledMessageProps) {
  return (
    <Card className="shadow-sm overflow-hidden">
      <div className={`px-4 py-1 ${recurring ? 'bg-primary/20' : 'bg-muted'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span className="text-xs font-medium">{date}</span>
            <Clock className="h-3 w-3 ml-2" />
            <span className="text-xs font-medium">{time}</span>
          </div>
          <Badge variant={messageType === "MMS" ? "default" : "outline"}>
            {messageType}
          </Badge>
        </div>
      </div>
      
      <CardContent className="pt-3">
        <p className="text-sm line-clamp-2 mb-2">{content}</p>
        <div className="flex items-center text-xs text-muted-foreground">
          <Users className="h-3 w-3 mr-1" />
          <span>{recipients} recipients</span>
          {recurring && (
            <Badge variant="outline" className="ml-2 text-xs">
              Recurring
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 border-t flex justify-between">
        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="h-4 w-4 mr-1" />
          Cancel
        </Button>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
