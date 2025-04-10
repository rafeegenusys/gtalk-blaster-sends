
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="ai">AI Assistant</TabsTrigger>
          <TabsTrigger value="media">Media Handling</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Configure your business details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="business-name">Business Name</Label>
                  <Input id="business-name" defaultValue="Acme Inc." className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="business-phone">Business Phone</Label>
                  <Input id="business-phone" defaultValue="+1 (555) 123-4567" className="mt-1" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="business-address">Business Address</Label>
                <Input id="business-address" defaultValue="123 Main St, Suite 100" className="mt-1" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" defaultValue="San Francisco" className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input id="state" defaultValue="CA" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" defaultValue="94103" className="mt-1" />
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="time-zone">Default Time Zone</Label>
                  <Select defaultValue="america_los_angeles">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select time zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america_los_angeles">America/Los Angeles (UTC-7)</SelectItem>
                      <SelectItem value="america_chicago">America/Chicago (UTC-5)</SelectItem>
                      <SelectItem value="america_new_york">America/New York (UTC-4)</SelectItem>
                      <SelectItem value="europe_london">Europe/London (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="opt-out-compliance" defaultChecked />
                <Label htmlFor="opt-out-compliance">Enable automatic opt-out compliance</Label>
              </div>
              
              <Button className="mt-2 bg-gtalkblue hover:bg-blue-600">Save Changes</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Credit Management</CardTitle>
              <CardDescription>View and manage your messaging credits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Current Balance</p>
                  <p className="text-2xl font-bold">1,500 Credits</p>
                </div>
                <Button>Purchase Credits</Button>
              </div>
              
              <Separator className="my-2" />
              
              <div>
                <p className="text-sm text-muted-foreground">Credit Usage</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm">Standard SMS message</p>
                  <p className="text-sm font-medium">1 credit</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm">MMS with media</p>
                  <p className="text-sm font-medium">3 credits</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm">Internal messages</p>
                  <p className="text-sm font-medium">0 credits (free)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>SMS Provider</CardTitle>
              <CardDescription>Configure your SMS/MMS provider integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sms-provider">Provider</Label>
                <Select defaultValue="twilio">
                  <SelectTrigger id="sms-provider" className="mt-1">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twilio">Twilio</SelectItem>
                    <SelectItem value="openphone">OpenPhone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="api-key">API Key</Label>
                <Input id="api-key" type="password" defaultValue="••••••••••••••••" className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="api-secret">API Secret</Label>
                <Input id="api-secret" type="password" defaultValue="••••••••••••••••" className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="phone-number">Sending Phone Number</Label>
                <Input id="phone-number" defaultValue="+1 (555) 987-6543" className="mt-1" />
              </div>
              
              <Button className="mt-2 bg-gtalkblue hover:bg-blue-600">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Assistant Configuration</CardTitle>
              <CardDescription>Configure your AI-powered message suggestions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="enable-ai" defaultChecked />
                <Label htmlFor="enable-ai">Enable AI message suggestions</Label>
              </div>
              
              <div>
                <Label htmlFor="openrouter-key">OpenRouter API Key</Label>
                <Input id="openrouter-key" type="password" defaultValue="••••••••••••••••" className="mt-1" />
              </div>
              
              <div>
                <Label htmlFor="ai-model">Preferred AI Model</Label>
                <Select defaultValue="claude">
                  <SelectTrigger id="ai-model" className="mt-1">
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt4">GPT-4o (OpenAI)</SelectItem>
                    <SelectItem value="claude">Claude (Anthropic)</SelectItem>
                    <SelectItem value="llama">Llama 3 (Meta)</SelectItem>
                    <SelectItem value="mistral">Mistral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="enable-context" defaultChecked />
                <Label htmlFor="enable-context">Enable contact history context</Label>
              </div>
              
              <Button className="mt-2 bg-gtalkblue hover:bg-blue-600">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="media" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Media Handling Settings</CardTitle>
              <CardDescription>Configure image and video processing options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-md p-4 bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">Current MMS Limitations</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Images</p>
                    <ul className="mt-1 space-y-1 list-disc list-inside text-muted-foreground">
                      <li>Maximum resolution: 1920x1080</li>
                      <li>Formats: JPEG, PNG, GIF</li>
                      <li>Max file size: 2MB</li>
                      <li>Max images per message: 5</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">Videos</p>
                    <ul className="mt-1 space-y-1 list-disc list-inside text-muted-foreground">
                      <li>Maximum duration: 60 seconds</li>
                      <li>Formats: MP4, 3GP</li>
                      <li>Max file size: 5MB</li>
                      <li>Max videos per message: 1</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-resize">Auto-resize large images</Label>
                  <Switch id="auto-resize" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="strip-metadata">Strip metadata from media</Label>
                  <Switch id="strip-metadata" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="convert-format">Convert incompatible formats</Label>
                  <Switch id="convert-format" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="optimize-video">Optimize videos automatically</Label>
                  <Switch id="optimize-video" defaultChecked />
                </div>
              </div>
              
              <div>
                <Label htmlFor="default-quality">Default Optimization Quality</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="default-quality" className="mt-1">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (smaller file size)</SelectItem>
                    <SelectItem value="medium">Medium (balanced)</SelectItem>
                    <SelectItem value="high">High (better quality)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">Affects compression level for automatic optimization</p>
              </div>
              
              <Button className="mt-2 bg-gtalkblue hover:bg-blue-600">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
