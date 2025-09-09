import { useState, useCallback } from "react";
import { semanticSearchService, type SemanticSearchResult } from "@/services/semantic-search.service";

export interface UseSemanticSearchReturn {
  results: SemanticSearchResult[];
  loading: boolean;
  error: string | null;
  searchNotes: (query: string, limit?: number, threshold?: number) => Promise<void>;
  findSimilarNotes: (noteId: string, limit?: number) => Promise<void>;
  clearResults: () => void;
  clearError: () => void;
}

export const useSemanticSearch = (): UseSemanticSearchReturn => {
  const [results, setResults] = useState<SemanticSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchNotes = useCallback(async (
    query: string,
    limit: number = 10,
    threshold: number = 0.7
  ) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const searchResults = await semanticSearchService.searchNotes(query, limit, threshold);
      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const findSimilarNotes = useCallback(async (
    noteId: string,
    limit: number = 5
  ) => {
    try {
      setLoading(true);
      setError(null);
      const similarNotes = await semanticSearchService.findSimilarNotes(noteId, limit);
      setResults(similarNotes);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to find similar notes");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    searchNotes,
    findSimilarNotes,
    clearResults,
    clearError,
  };
};
