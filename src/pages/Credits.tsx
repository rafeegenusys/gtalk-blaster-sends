
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { CreditCard, RefreshCcw, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CREDIT_PACKAGES = [
  { amount: 500, price: 5.99, name: "Starter Pack" },
  { amount: 1000, price: 9.99, name: "Business Boost" },
  { amount: 2500, price: 19.99, name: "Enterprise Plan" },
];

const CreditsPage = () => {
  const [customAmount, setCustomAmount] = useState('');
  const [currentBalance, setCurrentBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCurrentBalance();
    }
  }, [user]);

  // Fetch or create business ID
  const fetchOrCreateBusinessId = async () => {
    try {
      // First check if the user has a profile with a business_id
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('business_id')
        .eq('id', user?.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }
      
      // If profile exists but no business ID, or if profile doesn't exist
      if (!profileData?.business_id) {
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
              id: user?.id, 
              business_id: newBusiness.id,
              updated_at: new Date().toISOString()
            }
          ]);
          
        if (updateProfileError) throw updateProfileError;
        
        // Return the new business ID
        return newBusiness.id;
      } else {
        // Business ID already exists
        return profileData.business_id;
      }
    } catch (error) {
      console.error("Error fetching or creating business ID:", error);
      throw new Error("Could not set up your account");
    }
  };

  const fetchCurrentBalance = async () => {
    setIsLoading(true);
    try {
      // Get or create the business ID
      const businessId = await fetchOrCreateBusinessId();
      
      // Get the current credits balance
      const { data: businessData, error: getBusinessError } = await supabase
        .from('businesses')
        .select('credits_balance')
        .eq('id', businessId)
        .single();
        
      if (getBusinessError) throw getBusinessError;
      
      setCurrentBalance(businessData?.credits_balance || 0);
    } catch (error) {
      console.error("Error fetching balance:", error);
      toast({
        title: "Error",
        description: "Could not fetch current balance",
        variant: "destructive"
      });
      // Set a default balance for better UX
      setCurrentBalance(500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecharge = async (creditAmount: number) => {
    if (!user) {
      toast({
        title: "Not Authenticated",
        description: "Please log in to recharge credits",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get or create the business ID
      const businessId = await fetchOrCreateBusinessId();
      
      // First get the current credits balance
      const { data: businessData, error: getBusinessError } = await supabase
        .from('businesses')
        .select('credits_balance')
        .eq('id', businessId)
        .single();
        
      if (getBusinessError) throw getBusinessError;
      
      // Calculate the new balance
      const newBalance = (businessData?.credits_balance || 0) + creditAmount;
      
      // Update business credits with the new balance
      const { error: updateError } = await supabase
        .from('businesses')
        .update({ 
          credits_balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', businessId);

      if (updateError) throw updateError;

      setCurrentBalance(newBalance);
      
      toast({
        title: "Credits Recharged",
        description: `Successfully added ${creditAmount} credits to your account`,
        variant: "default"
      });

    } catch (error) {
      console.error("Recharge error:", error);
      toast({
        title: "Recharge Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="icon"
          className="mr-2"
          onClick={() => navigate('/')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold flex items-center">
          <CreditCard className="mr-2" /> Recharge Credits
        </h1>
      </div>
      
      {currentBalance !== null && (
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <p className="text-lg">Current Balance: <span className="font-bold">{currentBalance} Credits</span></p>
        </div>
      )}

      {isLoading && (
        <div className="mb-6 p-4 bg-muted/50 rounded-lg flex justify-center">
          <p>Loading...</p>
        </div>
      )}
      
      <div className="grid md:grid-cols-3 gap-6">
        {CREDIT_PACKAGES.map((pkg) => (
          <Card key={pkg.amount} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{pkg.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <p className="text-xl font-bold">{pkg.amount} Credits</p>
                <p className="text-muted-foreground">Only ${pkg.price}</p>
                <Button 
                  onClick={() => handleRecharge(pkg.amount)}
                  className="w-full"
                  disabled={isLoading}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" /> Recharge
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Custom Recharge</CardTitle>
          </CardHeader>
          <CardContent className="flex space-x-4">
            <Input 
              type="number" 
              placeholder="Enter custom credit amount" 
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="flex-grow"
            />
            <Button 
              onClick={() => {
                const amount = parseInt(customAmount);
                if (amount > 0) {
                  handleRecharge(amount);
                } else {
                  toast({
                    title: "Invalid Amount",
                    description: "Please enter a valid credit amount",
                    variant: "destructive"
                  });
                }
              }}
              disabled={isLoading}
            >
              Recharge
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreditsPage;
