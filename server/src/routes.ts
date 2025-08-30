import { Router } from "express";
import { createUserController } from "./controllers/user.controller";
import { createNoteController } from "./controllers/note.controller";

const router = Router();

router.post("/api/users", createUserController);
router.post("/api/notes", createNoteController);

export default router;
