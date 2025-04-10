
import React from "react";
import { Link } from "react-router-dom";
import { 
  Home, 
  MessageSquare, 
  FileText, 
  Calendar, 
  Users, 
  MessageCircle,
  Settings,
  CreditCard,
  Inbox,
  Send
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

// Menu items
const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquare,
  },
  {
    title: "Inbox",
    url: "/inbox",
    icon: Inbox,
  },
  {
    title: "Sent",
    url: "/sent",
    icon: Send,
  },
  {
    title: "Templates",
    url: "/templates",
    icon: FileText,
  },
  {
    title: "Schedule",
    url: "/schedule",
    icon: Calendar,
  },
  {
    title: "Contacts",
    url: "/contacts",
    icon: Users,
  },
  {
    title: "Internal Chat",
    url: "/chat",
    icon: MessageCircle,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center h-16 px-4">
        <div className="flex items-center">
          <div className="bg-gtalkblue rounded-lg p-2 mr-2">
            <MessageSquare size={20} className="text-white" />
          </div>
          <span className="font-bold text-lg">GTalk SMS</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="py-3 px-4 text-base">
                    <Link to={item.url} className="flex items-center">
                      <item.icon className="mr-3" size={20} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-2">
          <CreditCard size={16} className="text-gtalkblue" />
          <div className="text-sm">
            <span className="font-medium">Credits:</span> 1,500
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
