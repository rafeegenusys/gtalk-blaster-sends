
import { useState, useMemo } from "react";
import { TemplateCard } from "./TemplateCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Template types with sample data
export interface Template {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  hasImage?: boolean;
}

// Sample template data - exported so it can be used in other components
export const sampleTemplates: Template[] = [
  {
    id: "1",
    title: "Welcome Message",
    content: "Hi {{name}}, welcome to our service! How can we help you today?",
    tags: ["welcome", "intro"],
    category: "General",
    color: "#8B5CF6", // Purple
    createdAt: "2025-04-01",
    updatedAt: "2025-04-01"
  },
  {
    id: "2",
    title: "Appointment Reminder",
    content: "Hello {{name}}, this is a reminder about your appointment on {{date}} at {{time}}. Please reply to confirm.",
    tags: ["appointment", "reminder"],
    category: "Scheduling",
    color: "#0EA5E9", // Blue
    createdAt: "2025-04-02",
    updatedAt: "2025-04-05"
  },
  {
    id: "3",
    title: "Follow-up",
    content: "Hi {{name}}, just following up on our conversation about {{topic}}. Do you have any questions?",
    tags: ["follow-up", "sales"],
    category: "Sales",
    color: "#F97316", // Orange
    createdAt: "2025-04-03",
    updatedAt: "2025-04-06"
  },
  {
    id: "4",
    title: "Thank You",
    content: "Thank you for your business, {{name}}! We appreciate your support.",
    tags: ["gratitude", "general"],
    category: "General",
    color: "#10B981", // Green
    createdAt: "2025-04-04",
    updatedAt: "2025-04-04"
  },
  {
    id: "5",
    title: "Promo Announcement",
    content: "{{name}}, for a limited time, enjoy 20% off our services! Use code {{promo_code}} at checkout.",
    tags: ["promo", "marketing"],
    category: "Marketing",
    color: "#D946EF", // Pink
    createdAt: "2025-04-05",
    updatedAt: "2025-04-07",
    hasImage: true
  }
];

interface TemplateGridProps {
  searchQuery: string;
}

export function TemplateGrid({ searchQuery }: TemplateGridProps) {
  const [activeTab, setActiveTab] = useState("all");
  
  // Get unique categories for tabs
  const categories = useMemo(() => {
    const allCategories = sampleTemplates.map(template => template.category);
    return ["All", ...Array.from(new Set(allCategories))];
  }, []);

  // Filter templates based on search query and active tab
  const filteredTemplates = useMemo(() => {
    return sampleTemplates.filter(template => {
      const matchesSearch = 
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = 
        activeTab === "all" || 
        template.category.toLowerCase() === activeTab.toLowerCase();
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeTab]);

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 bg-muted/80 p-1 overflow-x-auto flex w-full gap-1 sm:gap-2">
          {categories.map((category) => (
            <TabsTrigger 
              key={category.toLowerCase()} 
              value={category.toLowerCase()}
              className="text-xs sm:text-sm px-3 py-1.5"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTemplates.map(template => (
            <TemplateCard key={template.id} template={template} />
          ))}
          
          {filteredTemplates.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No templates found matching your search.</p>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}
