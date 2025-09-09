import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2 } from "lucide-react";
import { useSemanticSearch } from "@/hooks/use-semantic-search";
import { cn } from "@/lib/utils";

interface SemanticSearchInputProps {
  onResultsChange?: (hasResults: boolean) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SemanticSearchInput = ({
  onResultsChange,
  onSearch,
  placeholder = "Search notes with AI...",
  className,
}: SemanticSearchInputProps) => {
  const [query, setQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const { searchNotes, loading, results, clearResults } = useSemanticSearch();

  useEffect(() => {
    onResultsChange?.(results.length > 0);
  }, [results.length, onResultsChange]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearchMode(true);
    if (onSearch) {
      onSearch(query);
    } else {
      await searchNotes(query);
    }
  };

  const handleClear = () => {
    setQuery("");
    setIsSearchMode(false);
    clearResults();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
    if (e.key === "Escape") {
      handleClear();
    }
  };

  return (
    <div className={cn("relative flex items-center gap-2", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {(query || isSearchMode) && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      <Button
        onClick={handleSearch}
        disabled={!query.trim() || loading}
        className="min-w-[100px]"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
            Searching
          </>
        ) : (
          "Search"
        )}
      </Button>
    </div>
  );
};
