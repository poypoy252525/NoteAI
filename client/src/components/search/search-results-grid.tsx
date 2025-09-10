import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type SemanticSearchResult } from "@/services/semantic-search.service";
import { getHtmlPreview } from "@/utils/html-utils";
import { formatDistanceToNow } from "date-fns";
import { Clock, Hash, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface SearchResultsGridProps {
  results: SemanticSearchResult[];
  className?: string;
}

export const SearchResultsGrid = ({
  results,
  className,
}: SearchResultsGridProps) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 ${className}`}
    >
      {results.map((note) => (
        <Link
          key={note.id}
          to={`/notes/${note.id}`}
          className="transition-transform hover:scale-[1.015] h-full w-full"
        >
          <Card className="h-full w-full hover:shadow-md transition-shadow overflow-hidden">
            <CardHeader className="pb-3 flex flex-col">
              <CardTitle className="line-clamp-2 text-base leading-tight">
                {note.title}
              </CardTitle>
              <div className="flex items-center justify-between text-xs gap-2 w-full">
                <div className="flex items-center gap-1 text-muted-foreground flex-1 overflow-hidden">
                  <Hash className="size-3 shrink-0" />
                  <span className="truncate">{note.category || "General"}</span>
                </div>
                {note.similarity && (
                  <div className="flex items-center gap-1 text-primary font-medium">
                    <Sparkles className="size-3" />
                    <span>{Math.round(note.similarity * 100)}%</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="line-clamp-3 leading-relaxed text-sm text-muted-foreground mb-3">
                {note.summary || getHtmlPreview(note.content, 120)}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>
                  {formatDistanceToNow(new Date(note.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
