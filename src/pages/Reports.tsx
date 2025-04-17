
import { Dashboard } from "@/components/layout/Dashboard";
import { ReportsDashboard } from "@/components/reports/ReportsDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageLogs } from "@/components/reports/MessageLogs";
import { DeliveryReports } from "@/components/reports/DeliveryReports";
import { TeamAnalytics } from "@/components/reports/TeamAnalytics";
import { CostInsights } from "@/components/reports/CostInsights";

export default function Reports() {
  return (
    <Dashboard title="Reports">
      <div className="space-y-6">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 w-full max-w-4xl mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="message-logs">Message Logs</TabsTrigger>
            <TabsTrigger value="delivery">Delivery Reports</TabsTrigger>
            <TabsTrigger value="team">Team Analytics</TabsTrigger>
            <TabsTrigger value="costs">Cost Insights</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <ReportsDashboard />
          </TabsContent>
          <TabsContent value="message-logs">
            <MessageLogs />
          </TabsContent>
          <TabsContent value="delivery">
            <DeliveryReports />
          </TabsContent>
          <TabsContent value="team">
            <TeamAnalytics />
          </TabsContent>
          <TabsContent value="costs">
            <CostInsights />
          </TabsContent>
        </Tabs>
      </div>
    </Dashboard>
  );
}
