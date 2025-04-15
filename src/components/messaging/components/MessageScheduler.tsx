
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CancelConditions } from "@/components/scheduler/CancelConditions";

interface MessageSchedulerProps {
  scheduledDate?: Date;
  scheduledTime: string;
  timezone: string;
  cancelIfResponse: boolean;
  onDateChange: (date?: Date) => void;
  onTimeChange: (time: string) => void;
  onTimezoneChange: (timezone: string) => void;
  onCancelIfResponseChange: (value: boolean) => void;
}

export function MessageScheduler({
  scheduledDate,
  scheduledTime,
  timezone,
  cancelIfResponse,
  onDateChange,
  onTimeChange,
  onTimezoneChange,
  onCancelIfResponseChange
}: MessageSchedulerProps) {
  return (
    <div className="border rounded-md p-3 space-y-3">
      <h4 className="text-sm font-medium">Schedule this message</h4>
      
      <div className="grid grid-cols-1 gap-3">
        <div>
          <p className="text-xs mb-1">Date</p>
          <Calendar
            mode="single"
            selected={scheduledDate}
            onSelect={onDateChange}
            initialFocus
            className="border rounded-md"
          />
        </div>
        
        <div className="space-y-3">
          <div>
            <p className="text-xs mb-1">Time</p>
            <Input
              type="time"
              value={scheduledTime}
              onChange={(e) => onTimeChange(e.target.value)}
            />
          </div>
          
          <div>
            <p className="text-xs mb-1">Timezone</p>
            <Select defaultValue={timezone} onValueChange={onTimezoneChange}>
              <SelectTrigger>
                <SelectValue placeholder="Timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">Eastern Time</SelectItem>
                <SelectItem value="America/Chicago">Central Time</SelectItem>
                <SelectItem value="America/Denver">Mountain Time</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <CancelConditions
            cancelIfResponse={cancelIfResponse}
            onCancelIfResponseChange={onCancelIfResponseChange}
          />
        </div>
      </div>
    </div>
  );
}
