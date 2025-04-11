
import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New message received",
      description: "Jane Smith sent you a new message",
      time: "5 minutes ago",
      read: false,
    },
    {
      id: "2",
      title: "Scheduled message sent",
      description: "Your scheduled message to Michael Johnson was sent successfully",
      time: "1 hour ago",
      read: false,
    },
    {
      id: "3",
      title: "Credits updated",
      description: "Your account was credited with 100 SMS credits",
      time: "2 days ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="p-3 flex items-center justify-between border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs" 
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-80">
          {notifications.length > 0 ? (
            <div>
              {notifications.map((notification, i) => (
                <div key={notification.id}>
                  <div 
                    className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                      !notification.read ? 'bg-muted/20' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                  </div>
                  {i < notifications.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No notifications
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
