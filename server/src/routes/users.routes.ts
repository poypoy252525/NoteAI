import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  createNoteController,
  deleteNoteController,
} from "../controllers/note.controller";
import { getNotesByUserIdController } from "../controllers/note.controller";
import { getNoteByIdController } from "../controllers/note.controller";

const router = Router();

router.get("/:userId/notes", authMiddleware, getNotesByUserIdController);
router.post("/:userId/notes", authMiddleware, createNoteController);
router.get("/:userId/notes/:id", authMiddleware, getNoteByIdController);
router.delete("/:userId/notes/:id", authMiddleware, deleteNoteController);

export default router;
