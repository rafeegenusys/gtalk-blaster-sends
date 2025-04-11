
import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';
import { Bell, MessageSquare, Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardProps {
  children: ReactNode;
  title?: string;
}

export function Dashboard({ children, title = 'Dashboard' }: DashboardProps) {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex flex-col flex-1 ml-[64px] md:ml-64">
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-border">
          <h1 className="text-xl font-semibold">{title}</h1>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" className="text-gray-500">
              <Bell size={20} />
            </Button>
            
            <Button className="bg-gtalk-primary text-white hover:bg-gtalk-primary/90">
              <Plus size={16} className="mr-2" />
              <span>New Message</span>
            </Button>

            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut size={16} className="mr-2" />
              <span className="hidden md:inline">Sign Out</span>
            </Button>
          </div>
        </header>
        
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
