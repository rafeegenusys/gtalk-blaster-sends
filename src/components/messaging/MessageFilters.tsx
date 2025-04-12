
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  ChevronDown, 
  Clock, 
  Filter, 
  MessagesSquare, 
  Users
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DateRange } from "react-day-picker";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

type FilterType = "all" | "unread" | "unresponded" | "archived";
type DateRangeFilter = DateRange | undefined;

export function MessageFilters({ 
  onFilterChange 
}: { 
  onFilterChange: (filter: FilterType, dateRange?: DateRangeFilter, group?: string) => void 
}) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [dateRange, setDateRange] = useState<DateRangeFilter>(undefined);
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>(undefined);
  const [filtersApplied, setFiltersApplied] = useState(0);

  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(filter);
    onFilterChange(filter, dateRange, selectedGroup);
  };

  const handleDateRangeChange = (range: DateRangeFilter) => {
    setDateRange(range);
    let count = 0;
    if (range?.from) count++;
    if (selectedGroup) count++;
    if (activeFilter !== "all") count++;
    setFiltersApplied(count);
    onFilterChange(activeFilter, range, selectedGroup);
  };

  const handleGroupChange = (value: string) => {
    const group = value === "none" ? undefined : value;
    setSelectedGroup(group);
    let count = 0;
    if (dateRange?.from) count++;
    if (group) count++;
    if (activeFilter !== "all") count++;
    setFiltersApplied(count);
    onFilterChange(activeFilter, dateRange, group);
  };

  return (
    <div className="p-2 sm:p-3 border-b">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 mb-2">
        <div className="flex flex-wrap gap-1">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterClick("all")}
            className="text-xs h-8 flex-grow sm:flex-grow-0"
          >
            <MessagesSquare className="mr-1 h-3 w-3" />
            All
          </Button>
          <Button
            variant={activeFilter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterClick("unread")}
            className="text-xs h-8 flex-grow sm:flex-grow-0"
          >
            Unread
          </Button>
          <Button
            variant={activeFilter === "unresponded" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterClick("unresponded")}
            className="text-xs h-8 flex-grow sm:flex-grow-0"
          >
            Unresponded
          </Button>
          <Button
            variant={activeFilter === "archived" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterClick("archived")}
            className="text-xs h-8 flex-grow sm:flex-grow-0"
          >
            Archived
          </Button>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs h-8">
                <Users className="mr-1 h-3 w-3" />
                Group
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2">
              <Select onValueChange={handleGroupChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Group</SelectItem>
                  <SelectItem value="group1">Customers</SelectItem>
                  <SelectItem value="group2">Leads</SelectItem>
                  <SelectItem value="group3">VIP Clients</SelectItem>
                </SelectContent>
              </Select>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs h-8">
                <Calendar className="mr-1 h-3 w-3" />
                Date
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={new Date()}
                selected={dateRange}
                onSelect={handleDateRangeChange}
                numberOfMonths={1}
              />
              <div className="p-3 border-t">
                <div className="flex justify-between items-center">
                  <div className="text-xs sm:text-sm">
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      "Select date range"
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDateRangeChange(undefined)}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {filtersApplied > 0 && (
            <Badge variant="secondary" className="ml-1">
              {filtersApplied} filters
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
