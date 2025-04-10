
import { MessageComposer } from "@/components/messages/MessageComposer";
import { ContactsList } from "@/components/messages/ContactsList";

// Sample data
const contacts = [
  { id: "1", name: "John Doe", phone: "+1 (555) 123-4567", group: "Customers" },
  { id: "2", name: "Jane Smith", phone: "+1 (555) 765-4321", group: "Leads" },
  { id: "3", name: "Robert Johnson", phone: "+1 (555) 987-6543" },
  { id: "4", name: "Sarah Williams", phone: "+1 (555) 456-7890", group: "Customers" },
  { id: "5", name: "Michael Brown", phone: "+1 (555) 234-5678", group: "Leads" },
];

const Messages = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">New Message</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <MessageComposer />
        </div>
        <div>
          <ContactsList contacts={contacts} />
        </div>
      </div>
    </div>
  );
};

export default Messages;
