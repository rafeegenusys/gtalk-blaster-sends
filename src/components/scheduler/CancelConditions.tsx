
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface CancelConditionsProps {
  cancelIfResponse: boolean;
  onCancelIfResponseChange: (value: boolean) => void;
}

export function CancelConditions({ 
  cancelIfResponse,
  onCancelIfResponseChange
}: CancelConditionsProps) {
  return (
    <div className="mt-3 border-t pt-3">
      <div className="space-y-2">
        <div className="text-sm font-medium mb-2 flex items-center">
          Cancel Conditions
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground ml-1 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Set conditions that will cancel this scheduled message automatically
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="cancelIfResponse" 
            checked={cancelIfResponse}
            onCheckedChange={(checked) => {
              if (typeof checked === 'boolean') {
                onCancelIfResponseChange(checked);
              }
            }}
          />
          <Label htmlFor="cancelIfResponse" className="text-sm">
            Cancel if recipient responds before scheduled time
          </Label>
        </div>
      </div>
    </div>
  );
}
