
import { Dashboard } from "@/components/layout/Dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Templates = () => {
  return (
    <Dashboard title="Templates">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Message Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Create and manage templates for quick messaging. Coming soon!
            </p>
          </CardContent>
        </Card>
      </div>
    </Dashboard>
  );
};

export default Templates;
