import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { createUserSchema } from "./user.controller";
import z from "zod";
import { userRepository } from "../repositories/user.repository";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../functions/jwt";

export const refreshTokenController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET!
  ) as jwt.JwtPayload;

  if (!decoded) return res.status(403).json({ error: "Invalid refresh token" });

  const newAccessToken = jwt.sign(
    { userId: decoded.userId, email: decoded.email },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  res.json({ accessToken: newAccessToken });
};

export const loginController = async (req: Request, res: Response) => {
  try {
    console.log("first");
    const validation = createUserSchema.safeParse(req.body);
    if (!validation.success)
      return res.status(400).json({ error: z.prettifyError(validation.error) });

    const { email, password } = validation.data;

    const user = await userRepository.getUserByEmail(email);

    if (!user)
      return res
        .status(400)
        .json({ error: "User with the given email was not found" });

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) return res.status(400).json({ error: "Password incorrect" });

    const payload = {
      email: user.email,
      userId: user.id,
    };

    const accessToken = generateAccessToken(payload);

    const refreshToken = generateRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({ token: accessToken, user });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error, triggered at login" });
  }
};
