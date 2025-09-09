import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Calendar, Tag, SortAsc } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    category?: string;
    dateRange?: {
      from: Date;
      to: Date;
    };
    sortBy: "relevance" | "date" | "title";
  };
  onFiltersChange: (filters: Partial<SearchFiltersProps["filters"]>) => void;
  className?: string;
}

export const SearchFilters = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  className,
}: SearchFiltersProps) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters = { sortBy: "relevance" as const };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  if (!isOpen) return null;

  return (
    <Card
      className={cn("absolute top-full left-0 right-0 z-50 mt-2", className)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Search Filters
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Filter */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium">
            Category
          </Label>
          <Input
            id="category"
            placeholder="Filter by category..."
            value={localFilters.category || ""}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                category: e.target.value || undefined,
              })
            }
          />
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <SortAsc className="h-3 w-3" />
            Sort By
          </Label>
          <div className="flex gap-2">
            {[
              { value: "relevance", label: "Relevance" },
              { value: "date", label: "Date" },
              { value: "title", label: "Title" },
            ].map((option) => (
              <Button
                key={option.value}
                variant={
                  localFilters.sortBy === option.value ? "default" : "outline"
                }
                size="sm"
                onClick={() =>
                  setLocalFilters({
                    ...localFilters,
                    sortBy: option.value as "relevance" | "date" | "title",
                  })
                }
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            Date Range
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label
                htmlFor="date-from"
                className="text-xs text-muted-foreground"
              >
                From
              </Label>
              <Input
                id="date-from"
                type="date"
                value={
                  localFilters.dateRange?.from
                    ? localFilters.dateRange.from.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => {
                  const date = e.target.value
                    ? new Date(e.target.value)
                    : undefined;
                  setLocalFilters({
                    ...localFilters,
                    dateRange: {
                      ...localFilters.dateRange,
                      from: date!,
                      to: localFilters.dateRange?.to || new Date(),
                    },
                  });
                }}
              />
            </div>
            <div>
              <Label
                htmlFor="date-to"
                className="text-xs text-muted-foreground"
              >
                To
              </Label>
              <Input
                id="date-to"
                type="date"
                value={
                  localFilters.dateRange?.to
                    ? localFilters.dateRange.to.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => {
                  const date = e.target.value
                    ? new Date(e.target.value)
                    : undefined;
                  setLocalFilters({
                    ...localFilters,
                    dateRange: {
                      from: localFilters.dateRange?.from || new Date(),
                      to: date!,
                    },
                  });
                }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleResetFilters}>
            Reset
          </Button>
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
        </div>
      </CardContent>
    </Card>
  );
};
