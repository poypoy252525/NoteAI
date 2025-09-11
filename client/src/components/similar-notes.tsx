import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getHtmlPreview } from "@/utils/html-utils";
import { useSemanticSearch } from "@/hooks/use-semantic-search";
import type { SemanticSearchResult } from "@/services/semantic-search.service";

interface SimilarNotesProps {
  noteId: string;
  className?: string;
}

export const SimilarNotes = ({ noteId, className }: SimilarNotesProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { results, loading, error, findSimilarNotes } = useSemanticSearch();

  useEffect(() => {
    if (noteId && isExpanded) {
      findSimilarNotes(noteId, 5);
    }
  }, [noteId, isExpanded, findSimilarNotes]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  if (!noteId) return null;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle className="text-lg">Similar Notes</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            className="flex items-center gap-1"
          >
            {isExpanded ? "Hide" : "Show"}
            <ChevronRight
              className={`h-4 w-4 transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="max-h-[65vh] overflow-auto">
          {loading ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>Finding similar notes...</span>
              </div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <p className="text-destructive text-sm">{error}</p>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              {results.map((note: SemanticSearchResult) => (
                <Link
                  key={note.id}
                  to={`/notes/${note.id}`}
                  className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1 mb-1">
                        {note.title}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {note.summary || getHtmlPreview(note.content, 100)}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(note.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                        {note.similarity && (
                          <span className="text-xs text-primary font-medium">
                            {Math.round(note.similarity * 100)}% similar
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <Sparkles className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No similar notes found
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
