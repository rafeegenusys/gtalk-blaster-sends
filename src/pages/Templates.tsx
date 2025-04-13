
import { useState } from "react";
import { Dashboard } from "@/components/layout/Dashboard";
import { TemplateGrid } from "@/components/templates/TemplateGrid";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogAddTemplate } from "@/components/templates/DialogAddTemplate";

const Templates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <Dashboard title="Templates">
      <div className="space-y-4">
        <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0 sm:space-x-4">
          <div className="flex-1 max-w-md">
            <Input 
              placeholder="Search templates..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="bg-gtalk-primary text-white hover:bg-gtalk-primary/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </div>
        
        <TemplateGrid searchQuery={searchQuery} />

        <DialogAddTemplate 
          open={showAddDialog} 
          onOpenChange={setShowAddDialog} 
        />
      </div>
    </Dashboard>
  );
};

export default Templates;
