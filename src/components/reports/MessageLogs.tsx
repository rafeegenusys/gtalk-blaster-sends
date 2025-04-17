
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download, Search } from "lucide-react";

// Sample message log data
const messageLogData = [
  {
    id: "1",
    timestamp: "2025-04-17T10:30:00",
    sender: "John Doe",
    recipient: "+1234567890",
    content: "Your appointment is confirmed for tomorrow at 2 PM",
    type: "SMS",
    status: "Delivered",
  },
  {
    id: "2",
    timestamp: "2025-04-17T11:15:00",
    sender: "Jane Smith",
    recipient: "+0987654321",
    content: "Please review the attached document",
    type: "MMS",
    status: "Failed",
  },
  {
    id: "3",
    timestamp: "2025-04-17T09:45:00",
    sender: "Mark Johnson",
    recipient: "+1122334455",
    content: "Your order has shipped and will arrive in 2-3 days",
    type: "SMS",
    status: "Delivered",
  },
  {
    id: "4",
    timestamp: "2025-04-17T13:20:00",
    sender: "Sarah Williams",
    recipient: "+5566778899",
    content: "Reminder: Team meeting at 3 PM today",
    type: "SMS",
    status: "Pending",
  },
  {
    id: "5",
    timestamp: "2025-04-17T14:05:00",
    sender: "David Brown",
    recipient: "+2233445566",
    content: "Your account verification code is 123456",
    type: "SMS",
    status: "Delivered",
  },
];

export function MessageLogs() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Message Logs</CardTitle>
          <CardDescription>
            Detailed logs of all messages sent and received
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search messages..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="mms">MMS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[190px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date/Time</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead className="hidden md:table-cell">Message</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messageLogData.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>
                      {format(new Date(message.timestamp), "MMM d, h:mm a")}
                    </TableCell>
                    <TableCell>{message.sender}</TableCell>
                    <TableCell>{message.recipient}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                      {message.content}
                    </TableCell>
                    <TableCell>{message.type}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          message.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : message.status === "Failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {message.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
