
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Download, TrendingDown, TrendingUp } from "lucide-react";

// Sample cost data
const monthlyCostData = [
  { name: "Jan", sms: 450, mms: 320 },
  { name: "Feb", sms: 480, mms: 350 },
  { name: "Mar", sms: 520, mms: 380 },
  { name: "Apr", sms: 550, mms: 420 },
];

// Sample message type breakdown
const messageTypeData = [
  { name: "SMS", value: 65 },
  { name: "MMS", value: 35 },
];

// Sample team breakdown
const teamBreakdownData = [
  { name: "Sales", value: 45 },
  { name: "Marketing", value: 30 },
  { name: "Support", value: 15 },
  { name: "Operations", value: 10 },
];

const COLORS = ["#8B5CF6", "#D946EF", "#F97316", "#0EA5E9"];
const MESSAGE_COLORS = ["#8B5CF6", "#D946EF"];

export function CostInsights() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Spend</CardTitle>
            <CardDescription>Current month cost summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="text-4xl font-bold">$970</div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>5.2% vs last month</span>
              </div>
              <div className="text-xs text-muted-foreground">
                $922 spent last month
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Message Type Breakdown</CardTitle>
            <CardDescription>Cost by message type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              sms: { label: "SMS", color: "#8B5CF6" },
              mms: { label: "MMS", color: "#D946EF" }
            }}>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={messageTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {messageTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={MESSAGE_COLORS[index % MESSAGE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="flex justify-center gap-4 mt-2">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: MESSAGE_COLORS[0] }}
                ></div>
                <span className="text-xs">SMS: $630</span>
              </div>
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: MESSAGE_COLORS[1] }}
                ></div>
                <span className="text-xs">MMS: $340</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Cost Breakdown</CardTitle>
            <CardDescription>Spending by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              sales: { label: "Sales", color: "#8B5CF6" },
              marketing: { label: "Marketing", color: "#D946EF" },
              support: { label: "Support", color: "#F97316" },
              operations: { label: "Operations", color: "#0EA5E9" }
            }}>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={teamBreakdownData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {teamBreakdownData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {teamBreakdownData.map((team, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-xs">
                    {team.name}: ${Math.round((team.value / 100) * 970)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Monthly Cost Trends</CardTitle>
            <CardDescription>Spending over the past 4 months</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{
            sms: { label: "SMS", color: "#8B5CF6" },
            mms: { label: "MMS", color: "#D946EF" }
          }}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyCostData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Bar dataKey="sms" name="SMS" fill="var(--color-sms)" />
                <Bar dataKey="mms" name="MMS" fill="var(--color-mms)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
