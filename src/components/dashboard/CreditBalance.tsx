
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export function CreditBalance() {
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCredits = async () => {
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

        // Get the credits for the business
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('credits_balance')
          .eq('id', profileData.business_id)
          .single();

        if (businessError) throw businessError;
        
        setCredits(businessData?.credits_balance || 0);
      } catch (error: any) {
        console.error('Error fetching credit balance:', error);
        toast({
          title: "Failed to load credit balance",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredits();
  }, [user, toast]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">Credit Balance</CardTitle>
        <CreditCard className="w-4 h-4 text-gtalk-primary" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-8 flex items-center">
            <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{credits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Approx. {Math.floor(credits / 5)} SMS messages
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
