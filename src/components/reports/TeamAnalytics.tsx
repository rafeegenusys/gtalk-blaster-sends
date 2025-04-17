
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
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Sample team analytics data
const teamMembersData = [
  { name: "John Doe", messages: 145, avatar: "/placeholder.svg", initials: "JD" },
  { name: "Jane Smith", messages: 123, avatar: "/placeholder.svg", initials: "JS" },
  { name: "Mark Johnson", messages: 98, avatar: "/placeholder.svg", initials: "MJ" },
  { name: "Sarah Williams", messages: 87, avatar: "/placeholder.svg", initials: "SW" },
  { name: "David Brown", messages: 64, avatar: "/placeholder.svg", initials: "DB" },
];

// Sample message volume data
const messageVolumeData = [
  { date: "Apr 10", count: 45 },
  { date: "Apr 11", count: 63 },
  { date: "Apr 12", count: 58 },
  { date: "Apr 13", count: 72 },
  { date: "Apr 14", count: 89 },
  { date: "Apr 15", count: 54 },
  { date: "Apr 16", count: 42 },
  { date: "Apr 17", count: 67 },
];

// Sample team members chart data
const teamChartData = [
  { name: "John", sales: 60, marketing: 45, support: 40 },
  { name: "Jane", sales: 40, marketing: 63, support: 20 },
  { name: "Mark", sales: 30, marketing: 25, support: 43 },
  { name: "Sarah", sales: 45, marketing: 30, support: 12 },
  { name: "David", sales: 25, marketing: 35, support: 4 },
];

export function TeamAnalytics() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Team Message Volume</CardTitle>
            <CardDescription>
              Message activity over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              count: { label: "Messages", color: "#8B5CF6" }
            }}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={messageVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="var(--color-count)" 
                    strokeWidth={2} 
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Member Activity</CardTitle>
            <CardDescription>
              Message volume by department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              sales: { label: "Sales", color: "#8B5CF6" },
              marketing: { label: "Marketing", color: "#D946EF" },
              support: { label: "Support", color: "#0EA5E9" }
            }}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={teamChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="var(--color-sales)" />
                  <Bar dataKey="marketing" fill="var(--color-marketing)" />
                  <Bar dataKey="support" fill="var(--color-support)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Most Active Team Members</CardTitle>
          <CardDescription>
            Team members ranked by message volume
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {teamMembersData.map((member, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.messages} messages
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-purple-600 h-2.5 rounded-full"
                      style={{
                        width: `${(member.messages / teamMembersData[0].messages) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
