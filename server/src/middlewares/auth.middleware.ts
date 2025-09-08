import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

// Extend Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export const authenticateToken = async (
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (!decoded) {
      return res.status(401).json({ error: "Invalid or expired access token" });
    }

    // Add user info to request object
    req.user = {
      id: decoded.id || decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired access token" });
  }
};

// Keep the original export for backward compatibility
export const authMiddleware = authenticateToken;
