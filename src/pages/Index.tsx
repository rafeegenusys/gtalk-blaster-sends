
import { useState, useEffect } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { CreditBalance } from "@/components/dashboard/CreditBalance";
import { StatsOverview, StatsData } from "@/components/dashboard/StatsOverview";
import { RecentActivity, ActivityItem } from "@/components/dashboard/RecentActivity";
import { MessageComposer } from "@/components/messaging/MessageComposer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // For demonstration purposes, setting mock data
        setStats({
          totalSent: 238,
          activeContacts: 47,
          deliveryRate: 98,
          scheduled: 5
        });
        
        // Create sample activities
        const mockActivities: ActivityItem[] = [
          {
            id: "act1",
            type: "sent",
            contact: "Jane Smith",
            phone: "+1 (555) 123-4567",
            message: "Thank you for your inquiry. I've attached the product specs you requested.",
            timestamp: "Just now"
          },
          {
            id: "act2",
            type: "received",
            contact: "Michael Johnson",
            phone: "+1 (555) 987-6543",
            message: "When can we schedule a call to discuss the project details?",
            timestamp: "10 mins ago"
          },
          {
            id: "act3",
            type: "scheduled",
            contact: "David Chen",
            phone: "+1 (555) 444-5555",
            message: "Just following up on our conversation from yesterday. Let me know if you need anything else.",
            timestamp: "Scheduled for tomorrow at 9:00 AM"
          },
          {
            id: "act4",
            type: "failed",
            contact: "Unknown",
            phone: "+1 (555) 222-3333",
            message: "Your appointment is confirmed for Friday at 2:00 PM.",
            timestamp: "30 mins ago"
          },
          {
            id: "act5",
            type: "received",
            contact: "Sarah Williams",
            phone: "+1 (555) 456-7890",
            message: "Yes, that pricing works for us. Please send the contract when ready.",
            timestamp: "45 mins ago"
          },
          {
            id: "act6",
            type: "sent",
            contact: "Alex Thompson",
            phone: "+1 (555) 789-0123",
            message: "We've updated our services. Check out our new offerings at the link below.",
            timestamp: "1 hour ago"
          },
          {
            id: "act7",
            type: "scheduled",
            contact: "Emily Davis",
            phone: "+1 (555) 333-2222",
            message: "Looking forward to our meeting next week!",
            timestamp: "Scheduled for Monday at 11:00 AM"
          }
        ];
        
        setActivities(mockActivities);
        setIsLoading(false);
        
        // Uncomment when database is properly set up
        /*
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
          .limit(10);

        if (recentError) throw recentError;

        // Generate activity items from messages
        const recentMessagesArray = recentMessages || [];
        const activityItems: ActivityItem[] = recentMessagesArray.map(msg => {
          let type: "sent" | "received" | "scheduled" | "failed" = "sent";
          
          if (msg.status === 'failed') type = "failed";
          else if (msg.status === 'scheduled') type = "scheduled";
          else if (msg.type === 'incoming') type = "received";
          
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
        */
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Failed to load dashboard data",
          description: error.message,
          variant: "destructive",
        });
        
        // Set default mock data as fallback
        setStats({
          totalSent: 238,
          activeContacts: 47,
          deliveryRate: 98,
          scheduled: 5
        });
        
        // Create sample activities as fallback
        const mockActivities: ActivityItem[] = [
          {
            id: "act1",
            type: "sent",
            contact: "Jane Smith",
            phone: "+1 (555) 123-4567",
            message: "Thank you for your inquiry. I've attached the product specs you requested.",
            timestamp: "Just now"
          },
          {
            id: "act2",
            type: "received",
            contact: "Michael Johnson",
            phone: "+1 (555) 987-6543",
            message: "When can we schedule a call to discuss the project details?",
            timestamp: "10 mins ago"
          },
          {
            id: "act3",
            type: "scheduled",
            contact: "David Chen",
            phone: "+1 (555) 444-5555",
            message: "Just following up on our conversation from yesterday. Let me know if you need anything else.",
            timestamp: "Scheduled for tomorrow at 9:00 AM"
          },
          {
            id: "act4",
            type: "failed",
            contact: "Unknown",
            phone: "+1 (555) 222-3333",
            message: "Your appointment is confirmed for Friday at 2:00 PM.",
            timestamp: "30 mins ago"
          },
          {
            id: "act5",
            type: "received",
            contact: "Sarah Williams",
            phone: "+1 (555) 456-7890",
            message: "Yes, that pricing works for us. Please send the contract when ready.",
            timestamp: "45 mins ago"
          }
        ];
        
        setActivities(mockActivities);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, toast]);

  const handleActivityClick = (activity: ActivityItem) => {
    // Navigate to messaging and store the activity info in sessionStorage
    // to be retrieved by the Messaging page
    sessionStorage.setItem('selectedActivity', JSON.stringify(activity));
    navigate('/messaging');
  };

  return (
    <Dashboard title="Dashboard">
      <div className="grid gap-4 md:gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <CreditBalance />
          <div className="md:col-span-4">
            <StatsOverview stats={stats} />
          </div>
        </div>
        
        <div className="grid gap-4 md:gap-6 md:grid-cols-2">
          <RecentActivity 
            activities={activities} 
            onActivityClick={handleActivityClick}
          />
          <MessageComposer />
        </div>
      </div>
    </Dashboard>
  );
};

export default Index;
