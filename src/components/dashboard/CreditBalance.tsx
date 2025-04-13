
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
        if (!user) {
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        
        // First check if the user has a profile with a business_id
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('business_id')
          .eq('id', user.id)
          .single();
        
        // If there's an error or no business ID yet
        if (profileError || !profileData?.business_id) {
          // Create a new business
          const { data: newBusiness, error: businessError } = await supabase
            .from('businesses')
            .insert([
              { name: 'My Business', credits_balance: 500 }
            ])
            .select()
            .single();
            
          if (businessError) throw businessError;
          
          // Create or update the user profile with the new business ID
          const { error: updateProfileError } = await supabase
            .from('profiles')
            .upsert([
              { 
                id: user.id, 
                business_id: newBusiness.id,
                updated_at: new Date().toISOString()
              }
            ]);
            
          if (updateProfileError) throw updateProfileError;
          
          setCredits(500); // Default value for new business
        } else {
          // Business ID exists, get the credits
          const { data: businessData, error: businessError } = await supabase
            .from('businesses')
            .select('credits_balance')
            .eq('id', profileData.business_id)
            .single();

          if (businessError) throw businessError;
          
          setCredits(businessData?.credits_balance || 500);
        }
      } catch (error: any) {
        console.error('Error fetching credit balance:', error);
        // Set a default value to prevent UI from showing an error state
        setCredits(500); // Default value
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredits();
  }, [user]);

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
