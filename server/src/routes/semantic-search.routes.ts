import { Router } from "express";
import SemanticSearchController from "../controllers/semantic-search.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();
const semanticSearchController = new SemanticSearchController();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// POST /api/semantic-search/search - Search notes using semantic similarity
router.post("/search", semanticSearchController.searchNotes);

// GET /api/semantic-search/similar/:noteId - Find notes similar to a specific note
router.get("/similar/:noteId", semanticSearchController.findSimilarNotes);

// POST /api/semantic-search/generate-embeddings - Generate embeddings for all user notes
router.post(
  "/generate-embeddings",
  semanticSearchController.generateEmbeddings
);

// PUT /api/semantic-search/update-embedding/:noteId - Update embedding for a specific note
router.put(
  "/update-embedding/:noteId",
  semanticSearchController.updateNoteEmbedding
);

export default router;
