
import { useState } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { TeamChat } from "@/components/chat/TeamChat";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusIcon, Search, LayoutList, CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

const Chat = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Dashboard title="Team Chat">
      <div className="grid grid-cols-12 h-[calc(100vh-4rem)] overflow-hidden bg-background">
        {/* Left sidebar - Chat channels */}
        <div className="col-span-12 sm:col-span-4 md:col-span-3 flex flex-col h-full border-r">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-semibold">Channels</h3>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search channels..."
                className="pl-8 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="px-2">
              <TabsList className="grid grid-cols-3 mb-2">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="direct">Direct</TabsTrigger>
                <TabsTrigger value="groups">Groups</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="m-0">
              <div className="p-2">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-2 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 mr-2">
                      #
                    </div>
                    <div>
                      <p className="font-medium text-sm">general</p>
                      <p className="text-xs text-muted-foreground">Company-wide discussions</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors mt-2 bg-muted/30">
                  <CardContent className="p-2 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mr-2">
                      #
                    </div>
                    <div>
                      <p className="font-medium text-sm">marketing</p>
                      <p className="text-xs text-muted-foreground">Marketing team channel</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors mt-2">
                  <CardContent className="p-2 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 mr-2">
                      #
                    </div>
                    <div>
                      <p className="font-medium text-sm">product</p>
                      <p className="text-xs text-muted-foreground">Product discussions</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors mt-2">
                  <CardContent className="p-2 flex items-center">
                    <div className="w-8 h-8 rounded bg-orange-500/20 flex items-center justify-center text-orange-500 mr-2">
                      @
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Sarah Johnson</p>
                      <p className="text-xs text-muted-foreground truncate">Hey, are you free for a quick call?</p>
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      11:45 AM
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors mt-2">
                  <CardContent className="p-2 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-500/20 flex items-center justify-center text-slate-500 mr-2 relative">
                      <span className="text-xs">3+</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Design Team</p>
                      <p className="text-xs text-muted-foreground truncate">Alex: Let's review the final mockups</p>
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Yesterday
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="direct" className="m-0">
              <div className="p-2">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors mt-2">
                  <CardContent className="p-2 flex items-center">
                    <div className="w-8 h-8 rounded bg-orange-500/20 flex items-center justify-center text-orange-500 mr-2">
                      S
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Sarah Johnson</p>
                      <p className="text-xs text-muted-foreground truncate">Hey, are you free for a quick call?</p>
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      11:45 AM
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors mt-2">
                  <CardContent className="p-2 flex items-center">
                    <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-500 mr-2">
                      M
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Michael Chen</p>
                      <p className="text-xs text-muted-foreground truncate">I'll have the report ready by EOD</p>
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Mon
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="groups" className="m-0">
              <div className="p-2">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors mt-2">
                  <CardContent className="p-2 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-500/20 flex items-center justify-center text-slate-500 mr-2 relative">
                      <span className="text-xs">3+</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Design Team</p>
                      <p className="text-xs text-muted-foreground truncate">Alex: Let's review the final mockups</p>
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Yesterday
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors mt-2">
                  <CardContent className="p-2 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mr-2 relative">
                      <span className="text-xs">5+</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Sales Team</p>
                      <p className="text-xs text-muted-foreground truncate">Jamie: Q2 targets achieved!</p>
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Apr 11
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Right side - Chat area */}
        <div className="hidden sm:block col-span-8 md:col-span-9 h-full">
          <div className="flex h-full flex-col">
            <div className="border-b p-3 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mr-2">
                  #
                </div>
                <div>
                  <h3 className="font-medium">marketing</h3>
                  <p className="text-xs text-muted-foreground">24 members</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Search className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <CalendarIcon className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <TeamChat />
          </div>
        </div>
      </div>
    </Dashboard>
  );
};

export default Chat;
