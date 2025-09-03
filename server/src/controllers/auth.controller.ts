import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

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

export const loginController = async (req: Request, res: Response) => {};
