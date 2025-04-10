
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { MessageSquare, CreditCard, Users, Clock } from "lucide-react";

// Sample data
const recentActivities = [
  { 
    id: "1", 
    recipient: "John Doe", 
    messageType: "SMS", 
    date: "Today, 10:30 AM", 
    status: "Delivered" 
  },
  { 
    id: "2", 
    recipient: "Customer Group (15)", 
    messageType: "MMS", 
    date: "Yesterday, 3:15 PM", 
    status: "Delivered" 
  },
  { 
    id: "3", 
    recipient: "Mary Smith", 
    messageType: "SMS", 
    date: "Yesterday, 1:45 PM", 
    status: "Failed" 
  },
  { 
    id: "4", 
    recipient: "Leads Group (8)", 
    messageType: "SMS", 
    date: "04/08/2025, 9:00 AM", 
    status: "Pending" 
  },
] as const;

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Messages Sent" 
          value="452" 
          icon={<MessageSquare size={20} />} 
          description="Last 30 days" 
        />
        <StatCard 
          title="Credits Balance" 
          value="1,500" 
          icon={<CreditCard size={20} />} 
        />
        <StatCard 
          title="Active Contacts" 
          value="145" 
          icon={<Users size={20} />} 
        />
        <StatCard 
          title="Scheduled Messages" 
          value="8" 
          icon={<Clock size={20} />} 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <RecentActivity activities={recentActivities} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
