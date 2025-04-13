
import { useState, useEffect } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { MoonIcon, SunIcon, MonitorIcon, PaletteIcon } from "lucide-react";
import { useTheme } from "next-themes";

// Define the shape of our business settings type
interface BusinessSettings {
  business_id: string;
  created_at?: string;
  id?: string;
  openphone_api_key?: string;
  openrouter_key?: string;
  preferred_llm_model?: string;
  sms_provider?: string;
  twilio_auth_token?: string;
  twilio_sid?: string;
  updated_at?: string;
  notifications_enabled?: boolean;
  sound_enabled?: boolean;
  primary_color?: string;
}

const Settings = () => {
  const [openrouterKey, setOpenrouterKey] = useState("");
  const [preferredModel, setPreferredModel] = useState("");
  const [smsProvider, setSmsProvider] = useState("");
  const [twilioSid, setTwilioSid] = useState("");
  const [twilioAuthToken, setTwilioAuthToken] = useState("");
  const [openphoneApiKey, setOpenphoneApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ai");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [primaryColor, setPrimaryColor] = useState("#8B5CF6");
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  
  // Available theme colors
  const themeColors = [
    { name: "Purple", value: "#8B5CF6" },
    { name: "Blue", value: "#0EA5E9" },
    { name: "Green", value: "#10B981" },
    { name: "Pink", value: "#D946EF" },
    { name: "Orange", value: "#F97316" }
  ];
  
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
        // Cast data to BusinessSettings type to safely access properties
        const settings = data as BusinessSettings;
        setOpenrouterKey(settings.openrouter_key || "");
        setPreferredModel(settings.preferred_llm_model || "");
        setSmsProvider(settings.sms_provider || "twilio");
        setTwilioSid(settings.twilio_sid || "");
        setTwilioAuthToken(settings.twilio_auth_token || "");
        setOpenphoneApiKey(settings.openphone_api_key || "");
        
        // Safely access the potentially undefined properties
        setNotificationsEnabled(settings.notifications_enabled !== false);
        setSoundEnabled(settings.sound_enabled !== false);
        setPrimaryColor(settings.primary_color || "#8B5CF6");
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
      
      const updateData: BusinessSettings = {
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
      } else if (activeTab === "appearance") {
        updateData.primary_color = primaryColor;
        // Theme is handled by next-themes and stored in localStorage
      } else if (activeTab === "notifications") {
        updateData.notifications_enabled = notificationsEnabled;
        updateData.sound_enabled = soundEnabled;
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
  useEffect(() => {
    fetchSettings();
  }, [user]);
  
  return (
    <Dashboard title="Settings">
      <div className="grid gap-6">
        <Tabs defaultValue="ai" onValueChange={setActiveTab}>
          <TabsList className="mb-4 overflow-x-auto flex">
            <TabsTrigger value="ai">AI Configuration</TabsTrigger>
            <TabsTrigger value="sms">SMS Provider</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
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
                      <SelectItem value="vonage">Vonage</SelectItem>
                      <SelectItem value="messagebird">MessageBird</SelectItem>
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
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize the look and feel of your application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="text-md font-medium mb-3 flex items-center">
                    <PaletteIcon className="h-4 w-4 mr-2" />
                    Theme Mode
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div 
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-muted'} cursor-pointer`}
                      onClick={() => setTheme('light')}
                    >
                      <SunIcon className="h-6 w-6 mb-2" />
                      <span className="text-sm">Light</span>
                    </div>
                    
                    <div 
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-muted'} cursor-pointer`}
                      onClick={() => setTheme('dark')}
                    >
                      <MoonIcon className="h-6 w-6 mb-2" />
                      <span className="text-sm">Dark</span>
                    </div>
                    
                    <div 
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-muted'} cursor-pointer`}
                      onClick={() => setTheme('system')}
                    >
                      <MonitorIcon className="h-6 w-6 mb-2" />
                      <span className="text-sm">System</span>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-md font-medium mb-3">Brand Color</h3>
                  
                  <div className="grid grid-cols-5 gap-2">
                    {themeColors.map((color) => (
                      <div 
                        key={color.value}
                        className={`flex flex-col items-center p-2 rounded-lg border ${primaryColor === color.value ? 'border-primary' : 'border-muted'} cursor-pointer`}
                        onClick={() => setPrimaryColor(color.value)}
                      >
                        <div 
                          className="h-8 w-8 rounded-full mb-1"
                          style={{ backgroundColor: color.value }}
                        ></div>
                        <span className="text-xs">{color.name}</span>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-2">
                    Custom color picker coming soon
                  </p>
                </div>
                
                <Button 
                  className="w-full bg-gtalk-primary hover:bg-gtalk-primary/90"
                  onClick={saveSettings}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Appearance Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how you want to be notified about messages and events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="enable-notifications" className="flex-1">Enable notifications</Label>
                  <Switch
                    id="enable-notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="enable-sound" className="flex-1">Notification sounds</Label>
                  <Switch
                    id="enable-sound"
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                    disabled={!notificationsEnabled}
                  />
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-md font-medium mb-3">Notification Preferences</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-new-messages" className="flex-1">New messages</Label>
                      <Switch id="notify-new-messages" defaultChecked disabled={!notificationsEnabled} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-mentions" className="flex-1">Mentions and replies</Label>
                      <Switch id="notify-mentions" defaultChecked disabled={!notificationsEnabled} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-scheduled" className="flex-1">Scheduled messages</Label>
                      <Switch id="notify-scheduled" defaultChecked disabled={!notificationsEnabled} />
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gtalk-primary hover:bg-gtalk-primary/90"
                  onClick={saveSettings}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Notification Settings"}
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
              <CardContent className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    placeholder="Enter your company name"
                    defaultValue="Acme Inc."
                  />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="business-phone">Business Phone</Label>
                  <Input
                    id="business-phone"
                    placeholder="Enter your business phone"
                    defaultValue="+1 (555) 123-4567"
                  />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="business-email">Business Email</Label>
                  <Input
                    id="business-email"
                    type="email"
                    placeholder="Enter your business email"
                    defaultValue="contact@acmeinc.com"
                  />
                </div>
                
                <div className="grid gap-3">
                  <Label htmlFor="business-address">Business Address</Label>
                  <Input
                    id="business-address"
                    placeholder="Enter your business address"
                    defaultValue="123 Main St, Anytown, USA"
                  />
                </div>
                
                <div className="pt-4 mt-4 border-t">
                  <h3 className="text-md font-medium mb-3">Subscription & Billing</h3>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Current Plan: Professional</p>
                        <p className="text-sm text-muted-foreground">Billed monthly</p>
                      </div>
                      <Button variant="outline">Manage</Button>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gtalk-primary hover:bg-gtalk-primary/90"
                  onClick={saveSettings}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Account Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Dashboard>
  );
};

export default Settings;
