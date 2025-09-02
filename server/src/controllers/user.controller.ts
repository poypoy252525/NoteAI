import type { Request, Response } from "express";
import { z } from "zod";
import UserService from "../services/user.service";
import jwt from "jsonwebtoken";
import "dotenv/config";
import bcrypt from "bcrypt";

const createUserSchema = z.object({
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
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userService.createUser(email, hashedPassword);

    const token = jwt.sign(
      { userId: user?.id, email: user?.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1h",
      }
    );

    return res.status(201).json({ message: "User created", data: user, token });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
