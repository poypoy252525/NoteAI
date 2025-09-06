import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: "No access token provided" });
  }

  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (!decoded) {
      return res.status(401).json({ error: "Invalid or expired access token" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired access token" });
  }
};
