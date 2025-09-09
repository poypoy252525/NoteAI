import { Router } from "express";
import {
  loginController,
  logoutController,
  refreshTokenController,
} from "../controllers/auth.controller";
import { createUserController } from "../controllers/user.controller";

const router = Router();

router.post("/register", createUserController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/refresh", refreshTokenController);

export default router;
