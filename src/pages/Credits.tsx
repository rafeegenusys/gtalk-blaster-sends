
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { CreditCard, RefreshCcw } from "lucide-react";

const CREDIT_PACKAGES = [
  { amount: 500, price: 5.99, name: "Starter Pack" },
  { amount: 1000, price: 9.99, name: "Business Boost" },
  { amount: 2500, price: 19.99, name: "Enterprise Plan" },
];

const CreditsPage = () => {
  const [customAmount, setCustomAmount] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const handleRecharge = async (creditAmount: number) => {
    if (!user) {
      toast({
        title: "Not Authenticated",
        description: "Please log in to recharge credits",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get the user's business ID
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('business_id')
        .eq('id', user.id)
        .single();

      if (profileError || !profileData?.business_id) {
        throw new Error("Could not find associated business");
      }

      // Update business credits
      const { error: updateError } = await supabase
        .from('businesses')
        .update({ 
          credits_balance: supabase.sql`credits_balance + ${creditAmount}`,
          updated_at: new Date().toISOString()
        })
        .eq('id', profileData.business_id);

      if (updateError) throw updateError;

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
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <CreditCard className="mr-2" /> Recharge Credits
      </h1>
      
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
