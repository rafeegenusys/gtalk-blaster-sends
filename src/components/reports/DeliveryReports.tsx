
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, FileDown } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

// Sample delivery status data
const deliveryStatusData = [
  { status: "Delivered", count: 285, percentage: "85%" },
  { status: "Failed", count: 35, percentage: "10%" },
  { status: "Pending", count: 15, percentage: "5%" },
];

// Sample detailed failure reasons
const failureReasonsData = [
  { reason: "Invalid Number", count: 15, percentage: "42.9%" },
  { reason: "Network Error", count: 8, percentage: "22.9%" },
  { reason: "Carrier Blocked", count: 7, percentage: "20.0%" },
  { reason: "Rate Limited", count: 3, percentage: "8.6%" },
  { reason: "Unknown Error", count: 2, percentage: "5.7%" },
];

// Chart data
const chartData = [
  { name: "Delivered", value: 285 },
  { name: "Failed", value: 35 },
  { name: "Pending", value: 15 },
];

const COLORS = ["#8B5CF6", "#F97316", "#0EA5E9"];

export function DeliveryReports() {
  const [period, setPeriod] = useState("today");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Status Overview</CardTitle>
            <CardDescription>
              Summary of message delivery statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {deliveryStatusData.map((item) => (
                <div
                  key={item.status}
                  className="flex flex-col items-center justify-center p-4 rounded-lg border"
                >
                  <div
                    className={`text-2xl font-bold ${
                      item.status === "Delivered"
                        ? "text-purple-600"
                        : item.status === "Failed"
                        ? "text-orange-600"
                        : "text-blue-600"
                    }`}
                  >
                    {item.count}
                  </div>
                  <div className="text-sm text-gray-600">{item.status}</div>
                  <div className="text-xs text-gray-500">{item.percentage}</div>
                </div>
              ))}
            </div>

            <ChartContainer config={{
              delivered: { label: "Delivered", color: "#8B5CF6" },
              failed: { label: "Failed", color: "#F97316" },
              pending: { label: "Pending", color: "#0EA5E9" }
            }}>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Failure Analysis</CardTitle>
              <CardDescription>
                Common reasons for message delivery failures
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Failure Reason</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {failureReasonsData.map((item) => (
                    <TableRow key={item.reason}>
                      <TableCell>{item.reason}</TableCell>
                      <TableCell>{item.count}</TableCell>
                      <TableCell>{item.percentage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Message Delivery Details</CardTitle>
            <CardDescription>
              Detailed breakdown of each message delivery attempt
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <FileDown className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" size="sm">
              <FileDown className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Message ID</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Sent Time</TableHead>
                  <TableHead className="hidden md:table-cell">Delivery Time</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono text-xs">MSG-12345-6789</TableCell>
                  <TableCell>+1234567890</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                      Delivered
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">10:30 AM</TableCell>
                  <TableCell className="hidden md:table-cell">10:31 AM</TableCell>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-xs">MSG-12345-6790</TableCell>
                  <TableCell>+0987654321</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">
                      Failed
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">11:15 AM</TableCell>
                  <TableCell className="hidden md:table-cell">-</TableCell>
                  <TableCell>Invalid Number</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono text-xs">MSG-12345-6791</TableCell>
                  <TableCell>+1122334455</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">11:45 AM</TableCell>
                  <TableCell className="hidden md:table-cell">-</TableCell>
                  <TableCell>Awaiting carrier</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
