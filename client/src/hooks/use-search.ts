import { useCallback } from "react";
import { useSearchContext } from "@/hooks/use-search-context";
import { semanticSearchService } from "@/services/semantic-search.service";

export function useSearch() {
  const { state, actions } = useSearchContext();

  const searchNotes = useCallback(async (
    query: string,
    options?: {
      limit?: number;
      threshold?: number;
    }
  ) => {
    if (!query.trim()) {
      actions.clearSearch();
      return;
    }

    try {
      actions.setQuery(query);
      actions.setLoading(true);
      actions.setError(null);
      
      const results = await semanticSearchService.searchNotes(
        query,
        options?.limit || 20,
        options?.threshold || 0.7
      );
      
      actions.setResults(results);
      actions.setHasSearched(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Search failed";
      actions.setError(errorMessage);
      actions.setResults([]);
    }
  }, [actions]);

  const findSimilarNotes = useCallback(async (
    noteId: string,
    limit: number = 5
  ) => {
    try {
      actions.setLoading(true);
      actions.setError(null);
      
      const results = await semanticSearchService.findSimilarNotes(noteId, limit);
      actions.setResults(results);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to find similar notes";
      actions.setError(errorMessage);
      actions.setResults([]);
    }
  }, [actions]);

  const clearSearch = useCallback(() => {
    actions.clearSearch();
  }, [actions]);

  const setFilters = useCallback((filters: Parameters<typeof actions.setFilters>[0]) => {
    actions.setFilters(filters);
  }, [actions]);

  return {
    // State
    query: state.query,
    results: state.results,
    loading: state.loading,
    error: state.error,
    hasSearched: state.hasSearched,
    filters: state.filters,
    
    // Actions
    searchNotes,
    findSimilarNotes,
    clearSearch,
    setFilters,
  };
}
