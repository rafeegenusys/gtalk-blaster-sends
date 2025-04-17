
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { BarChart, PieChart, LineChart, Bar, Pie, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

// Sample data - would be replaced with real data from API
const messageData = [
  { name: "Mon", sms: 40, mms: 24 },
  { name: "Tue", sms: 30, mms: 13 },
  { name: "Wed", sms: 20, mms: 8 },
  { name: "Thu", sms: 27, mms: 18 },
  { name: "Fri", sms: 18, mms: 12 },
  { name: "Sat", sms: 23, mms: 7 },
  { name: "Sun", sms: 34, mms: 15 }
];

const deliveryData = [
  { name: "Delivered", value: 85 },
  { name: "Failed", value: 10 },
  { name: "Pending", value: 5 }
];

const colors = ["#8B5CF6", "#D946EF", "#F97316", "#0EA5E9"];

export function ReportsDashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Reports Overview</CardTitle>
            <CardDescription>Summary of your messaging activities</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Weekly Message Volume</CardTitle>
          <CardDescription>SMS and MMS counts for the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{
            sms: { label: "SMS", color: "#8B5CF6" },
            mms: { label: "MMS", color: "#D946EF" }
          }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={messageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="sms" fill="var(--color-sms)" />
                <Bar dataKey="mms" fill="var(--color-mms)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Status</CardTitle>
          <CardDescription>Message status breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{
            delivered: { label: "Delivered", color: "#8B5CF6" },
            failed: { label: "Failed", color: "#F97316" },
            pending: { label: "Pending", color: "#0EA5E9" }
          }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deliveryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deliveryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Monthly Cost Trend</CardTitle>
          <CardDescription>Spending over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{
            cost: { label: "Cost", color: "#8B5CF6" }
          }}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={Array.from({ length: 30 }, (_, i) => ({
                day: i + 1,
                cost: Math.floor(Math.random() * 50) + 10
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="var(--color-cost)"
                  strokeWidth={2}
                  dot={{ r: 1 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
