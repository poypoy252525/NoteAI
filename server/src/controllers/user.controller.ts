import type { Request, Response } from "express";
import { z } from "zod";
import UserService from "../services/user.service";

const createUserSchema = z.object({
  email: z.email(),
});

const userService = new UserService();

export const createUserController = async (req: Request, res: Response) => {
  try {
    const validation = createUserSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ error: z.prettifyError(validation.error) });
    }

    const { email } = validation.data;

    const user = await userService.createUser(email);

    return res.status(201).json({ message: "User created", data: user });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
