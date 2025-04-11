
import { useState } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Settings = () => {
  const [openrouterKey, setOpenrouterKey] = useState("");
  const [preferredModel, setPreferredModel] = useState("");
  const [smsProvider, setSmsProvider] = useState("");
  const [twilioSid, setTwilioSid] = useState("");
  const [twilioAuthToken, setTwilioAuthToken] = useState("");
  const [openphoneApiKey, setOpenphoneApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ai");
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Fetch existing settings
  const fetchSettings = async () => {
    if (!user) return;
    
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('business_id')
        .eq('id', user.id)
        .single();
      
      if (!profileData?.business_id) return;
      
      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .eq('business_id', profileData.business_id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setOpenrouterKey(data.openrouter_key || "");
        setPreferredModel(data.preferred_llm_model || "");
        setSmsProvider(data.sms_provider || "twilio");
        setTwilioSid(data.twilio_sid || "");
        setTwilioAuthToken(data.twilio_auth_token || "");
        setOpenphoneApiKey(data.openphone_api_key || "");
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Save settings
  const saveSettings = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('business_id')
        .eq('id', user.id)
        .single();
      
      if (!profileData?.business_id) {
        throw new Error("Business ID not found");
      }
      
      const updateData: any = {
        business_id: profileData.business_id
      };
      
      // Only include fields that are relevant to the active tab
      if (activeTab === "ai") {
        updateData.openrouter_key = openrouterKey;
        updateData.preferred_llm_model = preferredModel;
      } else if (activeTab === "sms") {
        updateData.sms_provider = smsProvider;
        if (smsProvider === "twilio") {
          updateData.twilio_sid = twilioSid;
          updateData.twilio_auth_token = twilioAuthToken;
        } else if (smsProvider === "openphone") {
          updateData.openphone_api_key = openphoneApiKey;
        }
      }
      
      const { error } = await supabase
        .from('business_settings')
        .upsert(updateData);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load settings on mount
  useState(() => {
    fetchSettings();
  });
  
  return (
    <Dashboard title="Settings">
      <div className="grid gap-6">
        <Tabs defaultValue="ai" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="ai">AI Configuration</TabsTrigger>
            <TabsTrigger value="sms">SMS Provider</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ai">
            <Card>
              <CardHeader>
                <CardTitle>AI Configuration</CardTitle>
                <CardDescription>
                  Configure your AI preferences and API keys
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="openrouter-key">OpenRouter API Key</Label>
                  <Input
                    id="openrouter-key"
                    type="password"
                    placeholder="Enter your OpenRouter API key"
                    value={openrouterKey}
                    onChange={(e) => setOpenrouterKey(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Get your API key from{" "}
                    <a 
                      href="https://openrouter.ai/keys" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      OpenRouter.ai
                    </a>
                  </p>
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="preferred-model">Preferred AI Model</Label>
                  <Select
                    value={preferredModel}
                    onValueChange={setPreferredModel}
                  >
                    <SelectTrigger id="preferred-model">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                      <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                      <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                      <SelectItem value="llama-3">Llama 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    This model will be used for AI message suggestions
                  </p>
                </div>
                
                <Button 
                  className="w-full bg-gtalk-primary hover:bg-gtalk-primary/90"
                  onClick={saveSettings}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save AI Configuration"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sms">
            <Card>
              <CardHeader>
                <CardTitle>SMS Provider Configuration</CardTitle>
                <CardDescription>
                  Set up your SMS provider for sending messages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="sms-provider">SMS Provider</Label>
                  <Select
                    value={smsProvider}
                    onValueChange={setSmsProvider}
                  >
                    <SelectTrigger id="sms-provider">
                      <SelectValue placeholder="Select a provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="openphone">OpenPhone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {smsProvider === "twilio" && (
                  <>
                    <div className="grid gap-3">
                      <Label htmlFor="twilio-sid">Twilio Account SID</Label>
                      <Input
                        id="twilio-sid"
                        placeholder="Enter your Twilio Account SID"
                        value={twilioSid}
                        onChange={(e) => setTwilioSid(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid gap-3">
                      <Label htmlFor="twilio-auth-token">Twilio Auth Token</Label>
                      <Input
                        id="twilio-auth-token"
                        type="password"
                        placeholder="Enter your Twilio Auth Token"
                        value={twilioAuthToken}
                        onChange={(e) => setTwilioAuthToken(e.target.value)}
                      />
                    </div>
                  </>
                )}
                
                {smsProvider === "openphone" && (
                  <div className="grid gap-3">
                    <Label htmlFor="openphone-api-key">OpenPhone API Key</Label>
                    <Input
                      id="openphone-api-key"
                      type="password"
                      placeholder="Enter your OpenPhone API Key"
                      value={openphoneApiKey}
                      onChange={(e) => setOpenphoneApiKey(e.target.value)}
                    />
                  </div>
                )}
                
                <Button 
                  className="w-full bg-gtalk-primary hover:bg-gtalk-primary/90"
                  onClick={saveSettings}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save SMS Configuration"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account settings, business profile, and user access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Account management features coming soon!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Dashboard>
  );
};

export default Settings;
