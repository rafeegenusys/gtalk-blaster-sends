
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock, ScrollText, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  type: "sent" | "received" | "scheduled" | "failed";
  contact: string;
  phone: string;
  message: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="col-span-1 row-span-3">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle>Recent Activity</CardTitle>
        <div className="text-sm text-muted-foreground">Last 10 activities</div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[500px] overflow-auto pr-2">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className="mt-1">
                <StatusIcon type={activity.type} />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">{activity.contact}</p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
                <p className="text-xs text-muted-foreground">{activity.phone}</p>
                <p className="text-sm line-clamp-2">{activity.message}</p>
              </div>
            </div>
          ))}
          
          {activities.length === 0 && (
            <p className="text-sm text-center text-muted-foreground py-4">
              No recent activity to display
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusIcon({ type }: { type: ActivityItem["type"] }) {
  switch (type) {
    case "sent":
      return (
        <div className="p-1 rounded-full bg-green-100">
          <Check className="w-3 h-3 text-green-600" />
        </div>
      );
    case "received":
      return (
        <div className="p-1 rounded-full bg-blue-100">
          <Check className="w-3 h-3 text-gtalk-primary" />
        </div>
      );
    case "scheduled":
      return (
        <div className="p-1 rounded-full bg-yellow-100">
          <Clock className="w-3 h-3 text-yellow-600" />
        </div>
      );
    case "failed":
      return (
        <div className="p-1 rounded-full bg-red-100">
          <X className="w-3 h-3 text-gtalk-accent" />
        </div>
      );
  }
}
