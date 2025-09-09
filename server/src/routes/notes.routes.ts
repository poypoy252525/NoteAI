import { Router } from "express";
import { createNoteController } from "../controllers/note.controller";
import { getNotesByUserIdController } from "../controllers/note.controller";
import { getNoteByIdController } from "../controllers/note.controller";

const router = Router();

router.post("/notes", createNoteController);
router.get("/notes/:userId", getNotesByUserIdController);
router.get("/notes/:id", getNoteByIdController);

export default router;
