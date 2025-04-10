
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ActivityItem {
  id: string;
  recipient: string;
  messageType: "SMS" | "MMS";
  date: string;
  status: "Delivered" | "Failed" | "Pending";
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
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
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h3 className="font-medium">Recent Activity</h3>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recipient</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-medium">{activity.recipient}</TableCell>
                <TableCell>
                  <Badge variant="outline">{activity.messageType}</Badge>
                </TableCell>
                <TableCell>{activity.date}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
