
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MessageSquare, Bell, UserCheck } from "lucide-react";

export interface StatsData {
  monthlyMessages: number;
  activeContacts: number;
  unreadCount: number;
  scheduled: number;
}

interface StatsOverviewProps {
  stats: StatsData;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="dark:bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Monthly Messages</CardTitle>
          <Calendar className="w-4 h-4 text-gtalk-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.monthlyMessages.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Messages received this month
          </p>
        </CardContent>
      </Card>
      
      <Card className="dark:bg-card">
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
      
      <Card className="dark:bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
          <Bell className="w-4 h-4 text-gtalk-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.unreadCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Pending responses
          </p>
        </CardContent>
      </Card>
      
      <Card className="dark:bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          <MessageSquare className="w-4 h-4 text-gtalk-primary" />
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
