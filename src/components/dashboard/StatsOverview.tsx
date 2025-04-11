
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, UserCheck, SendHorizontal, Clock } from "lucide-react";

export interface StatsData {
  totalSent: number;
  activeContacts: number;
  deliveryRate: number;
  scheduled: number;
}

interface StatsOverviewProps {
  stats: StatsData;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
          <MessageSquare className="w-4 h-4 text-gtalk-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSent.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            This month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Active Contacts</CardTitle>
          <UserCheck className="w-4 h-4 text-gtalk-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeContacts.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Total contacts
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
          <SendHorizontal className="w-4 h-4 text-gtalk-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.deliveryRate}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            Last 30 days
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          <Clock className="w-4 h-4 text-gtalk-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.scheduled}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Pending messages
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
