import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SearchInput } from "@/components/search/search-input";
import { SearchFilters } from "@/components/search/search-filters";
import { SearchResultsGrid } from "@/components/search/search-results-grid";
import { SearchEmptyState } from "@/components/search/search-empty-state";
import { SearchLoadingState } from "@/components/search/search-loading-state";
import {
  semanticSearchService,
  type SemanticSearchResult,
} from "@/services/semantic-search.service";

interface SearchFilters {
  category?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  sortBy: "relevance" | "date" | "title";
}

const SearchPage = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SemanticSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: "relevance",
  });

  const searchNotes = useCallback(
    async (
      searchQuery: string,
      options?: {
        limit?: number;
        threshold?: number;
      }
    ) => {
      if (!searchQuery.trim()) {
        handleClear();
        return;
      }

      try {
        setQuery(searchQuery);
        setLoading(true);
        setError(null);

        const searchResults = await semanticSearchService.searchNotes(
          searchQuery,
          options?.limit || 20,
          options?.threshold || 0.75
        );

        setResults(searchResults);
        setHasSearched(true);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Search failed";
        setError(errorMessage);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleSearch = async (searchQuery: string) => {
    await searchNotes(searchQuery);
  };

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setError(null);
    setHasSearched(false);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFiltersChange = (newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    // Re-search with new filters if we have a query
    if (query) {
      searchNotes(query);
    }
  };

  return (
    <div className="flex flex-col min-h-svh">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-6">
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
        </div>
        <div className="space-y-6">
          {/* Search Input */}
          <div className="relative">
            <SearchInput
              value={query}
              onChange={handleQueryChange}
              onSearch={handleSearch}
              onClear={handleClear}
              loading={loading}
              showFilters={true}
              onToggleFilters={toggleFilters}
              className="max-w-4xl mx-auto"
            />

            {/* Search Filters */}
            <div className="max-w-4xl mx-auto relative">
              <SearchFilters
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </div>

          {/* Search Results */}
          <div className="space-y-6">
            {error && (
              <div className="text-center py-8">
                <p className="text-destructive text-sm">{error}</p>
                <Button
                  variant="outline"
                  onClick={() => handleSearch(query)}
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            )}

            {loading ? (
              <SearchLoadingState />
            ) : results.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Found {results.length} note{results.length !== 1 ? "s" : ""}
                    {query && ` for "${query}"`}
                  </p>
                  {hasSearched && (
                    <Button variant="outline" size="sm" onClick={handleClear}>
                      Clear Search
                    </Button>
                  )}
                </div>
                <SearchResultsGrid results={results} />
              </div>
            ) : (
              <SearchEmptyState hasSearched={hasSearched} query={query} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
