
import { useState, useEffect } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { CreditBalance } from "@/components/dashboard/CreditBalance";
import { StatsOverview, StatsData } from "@/components/dashboard/StatsOverview";
import { RecentActivity, ActivityItem } from "@/components/dashboard/RecentActivity";
import { MessageComposer } from "@/components/messaging/MessageComposer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [stats, setStats] = useState<StatsData>({
    totalSent: 0,
    activeContacts: 0,
    deliveryRate: 0,
    scheduled: 0
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!user) return;

        // Get the business ID for the current user
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('business_id')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        if (!profileData || !profileData.business_id) return;

        const businessId = profileData.business_id;

        // Get message stats
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('id, status, scheduled_time')
          .eq('business_id', businessId);

        if (messagesError) throw messagesError;

        // Get contact count
        const { count: contactsCount, error: contactsError } = await supabase
          .from('contacts')
          .select('id', { count: 'exact', head: true })
          .eq('business_id', businessId);

        if (contactsError) throw contactsError;

        // Calculate statistics
        const messagesArray = messagesData || [];
        const totalSent = messagesArray.filter(msg => msg.status === 'sent' || msg.status === 'delivered').length;
        const scheduledCount = messagesArray.filter(msg => msg.status === 'scheduled').length;
        const deliveredCount = messagesArray.filter(msg => msg.status === 'delivered').length;
        const sentCount = messagesArray.filter(msg => msg.status === 'sent').length;
        
        const deliveryRate = sentCount > 0 ? Math.round((deliveredCount / sentCount) * 100) : 0;

        setStats({
          totalSent,
          activeContacts: contactsCount || 0,
          deliveryRate,
          scheduled: scheduledCount
        });

        // Get recent messages for activity feed
        const { data: recentMessages, error: recentError } = await supabase
          .from('messages')
          .select(`
            id, 
            content, 
            status, 
            type,
            created_at,
            recipient_type,
            recipient_id
          `)
          .eq('business_id', businessId)
          .order('created_at', { ascending: false })
          .limit(5);

        if (recentError) throw recentError;

        // Generate activity items from messages
        const recentMessagesArray = recentMessages || [];
        const activityItems: ActivityItem[] = recentMessagesArray.map(msg => {
          let type: "sent" | "received" | "scheduled" | "failed" = "sent";
          
          if (msg.status === 'failed') type = "failed";
          else if (msg.status === 'scheduled') type = "scheduled";
          
          // For demo purposes, let's assume some are received messages
          if (msg.id.charAt(0) < '5') type = "received";
          
          return {
            id: msg.id,
            type,
            contact: "Contact " + msg.recipient_id.substring(0, 4),
            phone: "+1 (555) " + Math.floor(100 + Math.random() * 900) + "-" + Math.floor(1000 + Math.random() * 9000),
            message: msg.content,
            timestamp: new Date(msg.created_at).toLocaleString()
          };
        });

        setActivities(activityItems);
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Failed to load dashboard data",
          description: error.message,
          variant: "destructive",
        });
        
        // Set default mock data as fallback
        setStats({
          totalSent: 0,
          activeContacts: 0,
          deliveryRate: 0,
          scheduled: 0
        });
        
        setActivities([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, toast]);

  return (
    <Dashboard title="Dashboard">
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <CreditBalance />
          <div className="md:col-span-4">
            <StatsOverview stats={stats} />
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <RecentActivity activities={activities} />
          <MessageComposer />
        </div>
      </div>
    </Dashboard>
  );
};

export default Index;
