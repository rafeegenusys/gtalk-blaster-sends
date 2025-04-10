
import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

const AppLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex items-center mb-6">
            <SidebarTrigger />
            <div className="ml-4">
              <div className="flex items-center">
                <img src="/placeholder.svg" alt="User" className="w-8 h-8 rounded-full mr-2" />
                <div>
                  <p className="text-sm font-medium">Acme Inc.</p>
                  <p className="text-xs text-muted-foreground">Business Account</p>
                </div>
              </div>
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
