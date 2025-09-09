import { Router } from "express";
import { createUserController } from "./controllers/user.controller";
import { createNoteController } from "./controllers/note.controller";
import { getNotesByUserIdController } from "./controllers/note.controller";
import { generateResponseController } from "./controllers/llm.controller";
import { authMiddleware } from "./middlewares/auth.middleware";
import {
  loginController,
  refreshTokenController,
  logoutController,
} from "./controllers/auth.controller";
import semanticSearchRoutes from "./routes/semantic-search.routes";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";
import notesRoutes from "./routes/notes.routes";

const router = Router();

router.post("/chat", generateResponseController);
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/semantic-search", semanticSearchRoutes);
router.use("/notes", notesRoutes);

export default router;
