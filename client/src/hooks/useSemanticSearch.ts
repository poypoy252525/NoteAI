import { useState, useCallback } from "react";
import { api } from "@/services/axios-instance";
import { useAuth } from "@/stores/auth";

interface Note {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  category: string | null;
  similarity?: number;
  createdAt: string;
  updatedAt: string;
}

interface SemanticSearchResult {
  results: Note[];
  loading: boolean;
  error: string | null;
  searchNotes: (query: string, limit?: number) => Promise<void>;
  findSimilarNotes: (noteId: string, limit?: number) => Promise<void>;
  clearResults: () => void;
}

export const useSemanticSearch = (): SemanticSearchResult => {
  const [results, setResults] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const searchNotes = useCallback(async (query: string, limit = 10) => {
    if (!user?.userId) {
      setError("User not authenticated");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/semantic-search/search", {
        query,
        userId: user.userId,
        limit,
      });
      setResults(response.data.results || []);
    } catch (err) {
      setError("Failed to search notes");
      console.error("Semantic search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const findSimilarNotes = useCallback(async (noteId: string, limit = 5) => {
    if (!noteId) {
      setError("Note ID is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/semantic-search/similar/${noteId}`, {
        params: { limit },
      });
      setResults(response.data.results || []);
    } catch (err) {
      setError("Failed to find similar notes");
      console.error("Find similar notes error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    searchNotes,
    findSimilarNotes,
    clearResults,
  };
};
