import { Router } from "express";
import { generateResponseController } from "./controllers/llm.controller";
import authRoutes from "./routes/auth.routes";
import notesRoutes from "./routes/notes.routes";
import semanticSearchRoutes from "./routes/semantic-search.routes";
import usersRoutes from "./routes/users.routes";

const router = Router();

router.post("/chat", generateResponseController);
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/semantic-search", semanticSearchRoutes);
router.use("/notes", notesRoutes);

export default router;
