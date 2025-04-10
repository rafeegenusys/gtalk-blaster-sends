
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Download, 
  Upload, 
  Filter, 
  MoreVertical,
  Phone
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample contacts data
const contactsData = [
  { id: "1", name: "John Doe", phone: "+1 (555) 123-4567", group: "Customers", tags: ["VIP", "Active"] },
  { id: "2", name: "Jane Smith", phone: "+1 (555) 765-4321", group: "Leads", tags: ["New"] },
  { id: "3", name: "Robert Johnson", phone: "+1 (555) 987-6543", group: "Customers", tags: ["Active"] },
  { id: "4", name: "Sarah Williams", phone: "+1 (555) 456-7890", group: "Leads", tags: ["Potential", "Cold"] },
  { id: "5", name: "Michael Brown", phone: "+1 (555) 234-5678", group: "Customers", tags: ["VIP"] },
  { id: "6", name: "Emily Davis", phone: "+1 (555) 876-5432", group: "Internal", tags: ["Team"] },
  { id: "7", name: "David Wilson", phone: "+1 (555) 654-3210", group: "Leads", tags: ["Hot Lead"] },
  { id: "8", name: "Jennifer Garcia", phone: "+1 (555) 321-9876", group: "Customers", tags: ["Inactive"] },
];

const Contacts = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Contacts & Groups</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gtalkblue hover:bg-blue-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <Tabs defaultValue="all" className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="all">All Contacts</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="internal">Internal</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:w-80">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search contacts..." className="pl-8" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contactsData.map(contact => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                      {contact.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{contact.group}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {contact.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Contacts;
