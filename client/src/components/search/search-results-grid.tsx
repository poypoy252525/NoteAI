import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { type SemanticSearchResult } from "@/services/semantic-search.service";
import { Sparkles, Clock, Hash } from "lucide-react";

interface SearchResultsGridProps {
  results: SemanticSearchResult[];
  className?: string;
}

export const SearchResultsGrid = ({ results, className }: SearchResultsGridProps) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 ${className}`}>
      {results.map((note) => (
        <Link
          key={note.id}
          to={`/notes/${note.id}`}
          className="transition-transform hover:scale-[1.015] h-full"
        >
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="line-clamp-2 text-base leading-tight">
                {note.title}
              </CardTitle>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Hash className="h-3 w-3" />
                  <span className="truncate">
                    {note.category || "General"}
                  </span>
                </div>
                {note.similarity && (
                  <div className="flex items-center gap-1 text-primary font-medium">
                    <Sparkles className="h-3 w-3" />
                    <span>{Math.round(note.similarity * 100)}%</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="line-clamp-3 leading-relaxed text-sm text-muted-foreground mb-3">
                {note.summary || note.content.substring(0, 120) + "..."}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>
                  {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
