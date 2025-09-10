import { Router } from "express";
import { createNoteController } from "../controllers/note.controller";
import { getNotesByUserIdController } from "../controllers/note.controller";
import { getNoteByIdController } from "../controllers/note.controller";
import { deleteNoteController } from "../controllers/note.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/notes", authMiddleware, createNoteController);
router.get("/notes/:userId", authMiddleware, getNotesByUserIdController);
router.get("/notes/:id", authMiddleware, getNoteByIdController);
router.delete("/notes/:id", authMiddleware, deleteNoteController);

export default router;
