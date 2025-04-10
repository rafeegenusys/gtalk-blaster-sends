
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, Filter, Repeat } from "lucide-react";

// Sample data
const sentMessages = [
  {
    id: "1",
    recipient: "John Doe",
    recipientCount: 1,
    message: "Your appointment is confirmed for tomorrow at 2:00 PM. Reply Y to confirm or N to reschedule.",
    date: "Today, 11:15 AM",
    status: "Delivered",
  },
  {
    id: "2",
    recipient: "Customers Group",
    recipientCount: 15,
    message: "Thank you for your business! As a valued customer, enjoy 15% off your next purchase with code THANKYOU15.",
    date: "Yesterday, 3:15 PM",
    status: "Delivered",
  },
  {
    id: "3",
    recipient: "Mary Smith",
    recipientCount: 1,
    message: "We noticed you haven't completed your profile. Take 2 minutes to finish and get a special offer!",
    date: "Yesterday, 1:45 PM",
    status: "Failed",
  },
  {
    id: "4",
    recipient: "Leads Group",
    recipientCount: 8,
    message: "Interested in learning more about our services? Reply INFO for a detailed brochure.",
    date: "04/08/2025, 9:00 AM",
    status: "Pending",
  },
  {
    id: "5",
    recipient: "Robert Johnson",
    recipientCount: 1,
    message: "Your order #45678 has shipped and will arrive in 2-3 business days.",
    date: "04/07/2025, 2:30 PM",
    status: "Delivered",
  },
];

const Sent = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500";
      case "Failed":
        return "bg-gtalkred";
      case "Pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Sent Messages</h1>
      
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:w-80">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search sent messages..." className="pl-8" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recipient</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sentMessages.map((msg) => (
                <TableRow key={msg.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{msg.recipient}</p>
                      {msg.recipientCount > 1 && (
                        <p className="text-xs text-muted-foreground">{msg.recipientCount} recipients</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate">{msg.message}</p>
                  </TableCell>
                  <TableCell>{msg.date}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(msg.status)}>
                      {msg.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Resend">
                      <Repeat className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sent;
