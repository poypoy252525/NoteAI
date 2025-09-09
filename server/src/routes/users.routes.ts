import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createNoteController } from "../controllers/note.controller";
import { getNotesByUserIdController } from "../controllers/note.controller";

const router = Router();

router.get("/:userId/notes", authMiddleware, getNotesByUserIdController);
router.post("/:userId/notes", authMiddleware, createNoteController);

export default router;
