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

const router = Router();

router.post("/chat", generateResponseController);
router.use("/auth", authRoutes);
router.get("/test", (req, res) => {
  res.json({ message: "Hello World" });
});
router.use("/users", usersRoutes);
router.use("/semantic-search", semanticSearchRoutes);

export default router;
