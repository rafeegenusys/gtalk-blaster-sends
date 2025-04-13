import { useState, useEffect } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, KeyIcon, AlertCircle, CheckCircle, Save } from "lucide-react";

const AISettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [openRouterKey, setOpenRouterKey] = useState("");
  const [preferredModel, setPreferredModel] = useState("gpt-3.5-turbo");
  const [enableAutoResponder, setEnableAutoResponder] = useState(false);
  const [autoResponderTemplate, setAutoResponderTemplate] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Get business ID
        const { data: profileData } = await supabase
          .from('profiles')
          .select('business_id')
          .eq('id', user.id)
          .single();
          
        if (!profileData?.business_id) {
          return;
        }
        
        // Get AI settings
        const { data: settings } = await supabase
          .from('business_settings')
          .select('*')
          .eq('business_id', profileData.business_id)
          .single();
        
        if (settings) {
          setOpenRouterKey(settings.openrouter_key || "");
          setPreferredModel(settings.preferred_llm_model || "gpt-3.5-turbo");
          // Other settings can be added here
        }
      } catch (error: any) {
        console.error("Error fetching AI settings:", error);
        toast({
          title: "Failed to load settings",
          description: error.message || "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, [user, toast]);
  
  const handleSaveSettings = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      // Get business ID
      const { data: profileData } = await supabase
        .from('profiles')
        .select('business_id')
        .eq('id', user.id)
        .single();
        
      if (!profileData?.business_id) {
        throw new Error("Business not found");
      }
      
      // Update settings
      const { error } = await supabase
        .from('business_settings')
        .upsert({
          business_id: profileData.business_id,
          openrouter_key: openRouterKey,
          preferred_llm_model: preferredModel,
          updated_at: new Date().toISOString()
        }, { onConflict: 'business_id' });
        
      if (error) throw error;
      
      toast({
        title: "Settings saved",
        description: "Your AI settings have been updated successfully",
      });
    } catch (error: any) {
      console.error("Error saving AI settings:", error);
      toast({
        title: "Failed to save settings",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const testOpenRouterConnection = async () => {
    if (!openRouterKey) {
      toast({
        title: "API Key Required",
        description: "Please enter an OpenRouter API key first",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Test the API connection
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${openRouterKey}`,
          'HTTP-Referer': window.location.origin, 
          'X-Title': 'GTalk Messaging App'
        },
      });
      
      const data = await response.json();
      
      if (response.ok && data.data && data.data.length > 0) {
        toast({
          title: "Connection successful",
          description: `Successfully connected to OpenRouter. ${data.data.length} models available.`,
        });
      } else {
        throw new Error(data.error?.message || "Failed to connect to OpenRouter");
      }
    } catch (error: any) {
      console.error("Error testing OpenRouter connection:", error);
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect to OpenRouter",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dashboard title="AI Settings">
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="auto-responder">Auto Responder</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-primary" />
                OpenRouter API Configuration
              </CardTitle>
              <CardDescription>
                Configure your OpenRouter API connection to enable AI features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openrouter-key">OpenRouter API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="openrouter-key"
                    type="password"
                    placeholder="Enter your OpenRouter API key"
                    value={openRouterKey}
                    onChange={(e) => setOpenRouterKey(e.target.value)}
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button 
                    variant="outline" 
                    onClick={testOpenRouterConnection}
                    disabled={isLoading || isSaving || !openRouterKey}
                  >
                    Test
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Don't have an API key? <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Get one from OpenRouter</a>
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preferred-model">Preferred AI Model</Label>
                <Select value={preferredModel} onValueChange={setPreferredModel} disabled={isLoading}>
                  <SelectTrigger id="preferred-model">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (OpenAI)</SelectItem>
                    <SelectItem value="gpt-4">GPT-4 (OpenAI)</SelectItem>
                    <SelectItem value="anthropic/claude-instant-v1">Claude Instant (Anthropic)</SelectItem>
                    <SelectItem value="anthropic/claude-2">Claude 2 (Anthropic)</SelectItem>
                    <SelectItem value="google/palm-2-chat-bison">PaLM 2 (Google)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  The AI model used for generating message suggestions and auto-responses
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveSettings} 
                disabled={isLoading || isSaving}
                className="ml-auto"
              >
                {isSaving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="auto-responder" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Auto Responder</CardTitle>
              <CardDescription>
                Configure automatic responses to incoming messages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-responder">Enable Auto Responder</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically respond to incoming messages when you're away
                  </p>
                </div>
                <Switch
                  id="auto-responder"
                  checked={enableAutoResponder}
                  onCheckedChange={setEnableAutoResponder}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="auto-responder-template">Auto Responder Message</Label>
                <Textarea
                  id="auto-responder-template"
                  placeholder="Thanks for your message! I'll get back to you as soon as possible."
                  value={autoResponderTemplate}
                  onChange={(e) => setAutoResponderTemplate(e.target.value)}
                  className="min-h-[100px]"
                  disabled={isLoading || !enableAutoResponder}
                />
                <p className="text-xs text-muted-foreground">
                  You can use placeholders like {"{name}"} and {"{business}"} in your message
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveSettings} 
                disabled={isLoading || isSaving || !enableAutoResponder}
                className="ml-auto"
              >
                {isSaving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Template Generation</CardTitle>
              <CardDescription>
                Use AI to help create message templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                This feature allows you to generate message templates using AI. Simply describe what kind of template you want, and the AI will create it for you.
              </p>
              
              <div className="mt-4 p-4 border rounded-md bg-muted/30 flex items-center justify-between">
                <div>
                  <h3 className="font-medium mb-1">AI Template Generator</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate message templates with AI assistance
                  </p>
                </div>
                <Button 
                  variant="default" 
                  disabled={!openRouterKey}
                  onClick={() => {
                    toast({
                      title: "Coming Soon",
                      description: "This feature will be available in the next update",
                    });
                  }}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create with AI
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Dashboard>
  );
};

export default AISettings;
