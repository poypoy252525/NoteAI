import type { Request, Response } from "express";
import { z } from "zod";
import UserService from "../services/user.service";
import "dotenv/config";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../functions/jwt";

export const createUserSchema = z.object({
  email: z.email(),
  password: z.string(),
});

const userService = new UserService();

export const createUserController = async (req: Request, res: Response) => {
  try {
    const validation = createUserSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ error: z.prettifyError(validation.error) });
    }

    const { email, password } = validation.data;
    const existingUser = await userService.getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userService.createUser(email, hashedPassword);

    const token = generateAccessToken({ userId: user?.id, email: user?.email });
    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(201).json({ token });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
