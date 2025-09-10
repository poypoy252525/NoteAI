import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { getHtmlPreview } from "@/utils/html-utils";
import { type SemanticSearchResult } from "@/services/semantic-search.service";
import { Sparkles } from "lucide-react";

interface SemanticSearchResultsProps {
  results: SemanticSearchResult[];
  loading: boolean;
  error: string | null;
  query?: string;
}

export const SemanticSearchResults = ({
  results,
  loading,
  error,
  query,
}: SemanticSearchResultsProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 animate-pulse" />
          <span>Searching with AI...</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-full animate-pulse">
              <CardHeader>
                <div className="h-5 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive text-sm">{error}</p>
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <div className="text-center py-8 space-y-2">
        <Sparkles className="h-8 w-8 text-muted-foreground mx-auto" />
        <p className="text-muted-foreground">No notes found for "{query}"</p>
        <p className="text-xs text-muted-foreground">
          Try different keywords or create a new note
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {query && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          <span>
            Found {results.length} note{results.length !== 1 ? "s" : ""} for "{query}"
          </span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {results.map((note) => (
          <Link
            key={note.id}
            to={`/notes/${note.id}`}
            className="transition-transform hover:scale-[1.015] h-full"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="line-clamp-2">{note.title}</CardTitle>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground truncate">
                    {note.category || "General"}
                  </span>
                  {note.similarity && (
                    <span className="text-xs text-primary font-medium">
                      {Math.round(note.similarity * 100)}% match
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 leading-tight text-sm">
                  {note.summary || getHtmlPreview(note.content, 100)}
                </p>
                <p className="text-muted-foreground text-xs mt-2">
                  {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};
