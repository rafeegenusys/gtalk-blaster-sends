
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  MessageSquare, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  MessageCircle,
  BarChart,
  Menu,
  X,
  DollarSign // New import for credits icon
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      className={cn(
        "fixed top-0 left-0 z-40 h-full transition-all duration-300 bg-white border-r border-border",
        expanded ? "w-64" : "w-20",
        className
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border h-16">
        <div className={cn("flex items-center", expanded ? "justify-between w-full" : "justify-center")}>
          {expanded && (
            <h1 className="text-xl font-bold text-gtalk-primary">GTalk</h1>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700"
          >
            {expanded ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      <div className="flex flex-col p-3 space-y-2 overflow-y-auto h-[calc(100vh-64px)]">
        <NavItem 
          icon={<BarChart />} 
          label="Dashboard" 
          path="/" 
          active={location.pathname === '/'} 
          expanded={expanded} 
        />
        <NavItem 
          icon={<MessageSquare />} 
          label="Messaging" 
          path="/messaging" 
          active={location.pathname === '/messaging'} 
          expanded={expanded} 
        />
        <NavItem 
          icon={<Users />} 
          label="Contacts" 
          path="/contacts" 
          active={location.pathname === '/contacts'} 
          expanded={expanded} 
        />
        <NavItem 
          icon={<FileText />} 
          label="Templates" 
          path="/templates" 
          active={location.pathname === '/templates'} 
          expanded={expanded} 
        />
        <NavItem 
          icon={<Calendar />} 
          label="Scheduler" 
          path="/scheduler" 
          active={location.pathname === '/scheduler'} 
          expanded={expanded} 
        />
        <NavItem 
          icon={<MessageCircle />} 
          label="Team Chat" 
          path="/chat" 
          active={location.pathname === '/chat'} 
          expanded={expanded} 
        />
        <NavItem 
          icon={<DollarSign />} 
          label="Credits" 
          path="/credits" 
          active={location.pathname === '/credits'} 
          expanded={expanded} 
        />
        <NavItem 
          icon={<Settings />} 
          label="Settings" 
          path="/settings" 
          active={location.pathname === '/settings'} 
          expanded={expanded} 
        />
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active?: boolean;
  expanded: boolean;
}

function NavItem({ icon, label, path, active, expanded }: NavItemProps) {
  return (
    <Link
      to={path}
      className={cn(
        "flex items-center p-3 rounded-md transition-colors",
        active
          ? "bg-gtalk-primary bg-opacity-10 text-gtalk-primary"
          : "text-gray-600 hover:bg-gray-100",
        !expanded && "justify-center"
      )}
    >
      <span className="flex items-center justify-center w-6 h-6">{icon}</span>
      {expanded && <span className="ml-3 font-medium">{label}</span>}
    </Link>
  );
}
