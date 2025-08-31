import { Router } from "express";
import { createUserController } from "./controllers/user.controller";
import { createNoteController } from "./controllers/note.controller";
import { getNotesByUserIdController } from "./controllers/note.controller";
import { generateResponseController } from "./controllers/llm.controller";

const router = Router();

router.get("/api/test", (req, res) => {
  res.json({ message: "Hello World" });
});

router.post("/api/users", createUserController);
router.get("/api/users/:userId/notes", getNotesByUserIdController);

router.post("/api/notes", createNoteController);

router.post("/api/chat", generateResponseController);

export default router;
