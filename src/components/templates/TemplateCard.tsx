
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Copy } from "lucide-react";

interface TemplateCardProps {
  id: string;
  title: string;
  content: string;
  category: string;
  hasMedia: boolean;
}

export function TemplateCard({ id, title, content, category, hasMedia }: TemplateCardProps) {
  return (
    <Card className="shadow-sm h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{title}</CardTitle>
          <Badge variant={hasMedia ? "default" : "outline"}>
            {hasMedia ? "MMS" : "SMS"}
          </Badge>
        </div>
        <Badge variant="outline" className="mt-1 bg-primary/10 text-primary">
          {category}
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{content}</p>
        
        {hasMedia && (
          <div className="mt-3 bg-muted rounded-md h-20 flex items-center justify-center text-sm text-muted-foreground">
            Media Preview
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 border-t flex justify-between">
        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">
            <Copy className="h-4 w-4 mr-1" />
            Use
          </Button>
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
