import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Search, Plus, BookOpen } from "lucide-react";

interface SearchEmptyStateProps {
  hasSearched: boolean;
  query?: string;
  className?: string;
}

export const SearchEmptyState = ({
  hasSearched,
  query,
  className,
}: SearchEmptyStateProps) => {
  if (!hasSearched) {
    return (
      <div className={`text-center py-16 space-y-6 ${className}`}>
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Search className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">AI-Powered Search</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Search your notes using natural language. Find content by meaning,
            not just keywords.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline">
            <Link to="/">
              <BookOpen />
              Browse All Notes
            </Link>
          </Button>
          <Button asChild>
            <Link to="/notes/new">
              <Plus />
              Create New Note
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`text-center py-16 space-y-6 ${className}`}>
      <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">No Results Found</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          {query ? (
            <>
              No notes found for "<span className="font-medium">{query}</span>".
              Try different keywords or create a new note.
            </>
          ) : (
            "No notes found. Try different search terms or create a new note."
          )}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild variant="outline">
          <Link to="/">
            <BookOpen className="h-4 w-4 mr-2" />
            Browse All Notes
          </Link>
        </Button>
        <Button asChild>
          <Link to="/notes/new">
            <Plus className="h-4 w-4 mr-2" />
            Create New Note
          </Link>
        </Button>
      </div>
    </div>
  );
};
