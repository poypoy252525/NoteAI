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
    return res.status(401).json({ error: "No refresh token" });
  }

  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET!
  ) as jwt.JwtPayload;

  if (!decoded) return res.status(403).json({ error: "Invalid refresh token" });

  const payload = { userId: decoded.userId, email: decoded.email };
  const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });

  res.json({ accessToken: newAccessToken, user: payload });
};

export const loginController = async (req: Request, res: Response) => {
  try {
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
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({ token: accessToken, user: payload });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Internal server error, triggered at login" });
  }
};

export const logoutController = async (req: Request, res: Response) => {
  try {
    res.clearCookie("refreshToken");
    return res.json({ message: "Logout successful" });
  } catch (error) {
    return res
      .status(500)
      .json({
        error: "Internal server error, triggered at logout",
        details: error,
      });
  }
};
