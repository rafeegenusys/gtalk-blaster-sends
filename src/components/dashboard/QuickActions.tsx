
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export function QuickActions() {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <h3 className="font-medium mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Link to="/messages">
          <Button variant="outline" className="w-full justify-start">
            <MessageSquare className="mr-2 h-4 w-4" />
            New Message
          </Button>
        </Link>
        <Link to="/contacts">
          <Button variant="outline" className="w-full justify-start">
            <Users className="mr-2 h-4 w-4" />
            Add Contacts
          </Button>
        </Link>
        <Link to="/templates">
          <Button variant="outline" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </Link>
      </div>
    </div>
  );
}
