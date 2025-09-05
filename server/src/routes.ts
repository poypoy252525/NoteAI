import { Router } from "express";
import { createUserController } from "./controllers/user.controller";
import { createNoteController } from "./controllers/note.controller";
import { getNotesByUserIdController } from "./controllers/note.controller";
import { generateResponseController } from "./controllers/llm.controller";
import { authMiddleware } from "./middlewares/auth.middleware";
import {
  loginController,
  refreshTokenController,
} from "./controllers/auth.controller";

const router = Router();

router.get("/api/test", (req, res) => {
  res.json({ message: "Hello World" });
});

router.get(
  "/api/users/:userId/notes",
  authMiddleware,
  getNotesByUserIdController
);
router.post("/api/users/:userId/notes", authMiddleware, createNoteController);

router.post("/api/chat", generateResponseController);

router.post("/api/auth/refresh", refreshTokenController);
router.post("/api/auth/register", createUserController);
router.post("/api/auth/login", loginController);

export default router;
