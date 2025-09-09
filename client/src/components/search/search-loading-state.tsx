import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface SearchLoadingStateProps {
  className?: string;
}

export const SearchLoadingState = ({ className }: SearchLoadingStateProps) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4 animate-pulse" />
        <span>Searching with AI...</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="h-full animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-muted rounded w-1/3"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 mb-3">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-4/5"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
