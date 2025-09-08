import { Request, Response } from "express";
import SemanticSearchService, { SemanticSearchResult } from "../services/semantic-search.service";

export class SemanticSearchController {
  private semanticSearchService: SemanticSearchService;

  constructor() {
    this.semanticSearchService = new SemanticSearchService();
  }

  // Search notes using semantic similarity
  searchNotes = async (req: Request, res: Response): Promise<void> => {
    try {
      const { query, limit = 10, threshold = 0.7 } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      if (!query || typeof query !== "string") {
        res.status(400).json({ error: "Query is required and must be a string" });
        return;
      }

      const results: SemanticSearchResult[] = await this.semanticSearchService.searchSimilarNotes(
        query,
        userId,
        parseInt(limit),
        parseFloat(threshold)
      );

      res.json({
        success: true,
        results,
        count: results.length,
      });
    } catch (error) {
      console.error("Error in semantic search:", error);
      res.status(500).json({ 
        error: "Failed to perform semantic search",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  // Find notes similar to a specific note
  findSimilarNotes = async (req: Request, res: Response): Promise<void> => {
    try {
      const { noteId } = req.params;
      const { limit = 5 } = req.query;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      if (!noteId) {
        res.status(400).json({ error: "Note ID is required" });
        return;
      }

      const results: SemanticSearchResult[] = await this.semanticSearchService.findSimilarNotesToNote(
        noteId,
        parseInt(limit as string)
      );

      res.json({
        success: true,
        results,
        count: results.length,
      });
    } catch (error) {
      console.error("Error finding similar notes:", error);
      res.status(500).json({ 
        error: "Failed to find similar notes",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  // Generate embeddings for all user notes that don't have them
  generateEmbeddings = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      // Start the batch process (this might take a while)
      this.semanticSearchService.batchGenerateEmbeddings(userId)
        .catch(error => {
          console.error("Background embedding generation failed:", error);
        });

      res.json({
        success: true,
        message: "Embedding generation started in background",
      });
    } catch (error) {
      console.error("Error starting embedding generation:", error);
      res.status(500).json({ 
        error: "Failed to start embedding generation",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };

  // Update embedding for a specific note
  updateNoteEmbedding = async (req: Request, res: Response): Promise<void> => {
    try {
      const { noteId } = req.params;
      const { content } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
      }

      if (!noteId || !content) {
        res.status(400).json({ error: "Note ID and content are required" });
        return;
      }

      await this.semanticSearchService.updateNoteEmbedding(noteId, content);

      res.json({
        success: true,
        message: "Note embedding updated successfully",
      });
    } catch (error) {
      console.error("Error updating note embedding:", error);
      res.status(500).json({ 
        error: "Failed to update note embedding",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };
}

export default SemanticSearchController;
