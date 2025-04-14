
import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';
import { Bell, MessageSquare, Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface DashboardProps {
  children: ReactNode;
  title?: string;
}

export function Dashboard({ children, title = 'Dashboard' }: DashboardProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleNewMessage = () => {
    navigate('/messaging');
  };

  return (
    <div className="flex h-screen bg-background dark:bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 ml-[64px] md:ml-64">
        <header className="flex items-center justify-between h-16 px-4 sm:px-6 bg-card dark:bg-card border-b border-border">
          <h1 className="text-xl font-semibold truncate text-foreground dark:text-foreground">{title}</h1>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="outline" size="icon" className="text-foreground dark:text-foreground">
              <Bell size={20} />
            </Button>
            
            <Button 
              className="bg-gtalk-primary text-white hover:bg-gtalk-primary/90 h-9 px-2 sm:px-4"
              onClick={handleNewMessage}
            >
              <Plus size={16} className="sm:mr-2" />
              <span className="hidden sm:inline">New Message</span>
            </Button>

            <Button variant="ghost" size="sm" onClick={handleSignOut} className="h-9 px-2 sm:px-4">
              <LogOut size={16} className="sm:mr-2" />
              <span className="hidden md:inline">Sign Out</span>
            </Button>
          </div>
        </header>
        
        <main className="flex-1 p-3 sm:p-6 overflow-auto bg-background dark:bg-background text-foreground dark:text-foreground">
          {children}
        </main>
      </div>
    </div>
  );
}
