import { api } from "./axios-instance";

export interface SemanticSearchResult {
  id: string;
  title: string;
  content: string;
  category: string | null;
  summary: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  similarity?: number;
}

export interface SemanticSearchResponse {
  success: boolean;
  results: SemanticSearchResult[];
  count: number;
}

export class SemanticSearchService {
  /**
   * Search notes using semantic similarity
   */
  async searchNotes(
    query: string,
    limit: number = 10,
    threshold: number = 0.7
  ): Promise<SemanticSearchResult[]> {
    try {
      const response = await api.post<SemanticSearchResponse>(
        "/semantic-search/search",
        {
          query,
          limit,
          threshold,
        }
      );
      return response.data.results;
    } catch (error) {
      console.error("Error performing semantic search:", error);
      throw new Error("Failed to search notes");
    }
  }

  /**
   * Find notes similar to a specific note
   */
  async findSimilarNotes(
    noteId: string,
    limit: number = 5
  ): Promise<SemanticSearchResult[]> {
    try {
      const response = await api.get<SemanticSearchResponse>(
        `/semantic-search/similar/${noteId}`,
        {
          params: { limit },
        }
      );
      return response.data.results;
    } catch (error) {
      console.error("Error finding similar notes:", error);
      throw new Error("Failed to find similar notes");
    }
  }

  /**
   * Generate embeddings for all user notes
   */
  async generateEmbeddings(): Promise<void> {
    try {
      await api.post("/semantic-search/generate-embeddings");
    } catch (error) {
      console.error("Error generating embeddings:", error);
      throw new Error("Failed to generate embeddings");
    }
  }

  /**
   * Update embedding for a specific note
   */
  async updateNoteEmbedding(noteId: string, content: string): Promise<void> {
    try {
      await api.put(`/semantic-search/update-embedding/${noteId}`, {
        content,
      });
    } catch (error) {
      console.error("Error updating note embedding:", error);
      throw new Error("Failed to update note embedding");
    }
  }
}

export const semanticSearchService = new SemanticSearchService();
