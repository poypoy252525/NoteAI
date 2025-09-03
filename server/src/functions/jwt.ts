import "dotenv/config";
import jwt from "jsonwebtoken";

export const generateAccessToken = (payload: Object): string => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });

  return token;
};

export const generateRefreshToken = (payload: Object): string => {
  const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "30d",
  });

  return token;
};
