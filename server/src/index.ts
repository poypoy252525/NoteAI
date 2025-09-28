import "dotenv/config";
import express from "express";
import router from "./routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});

const app = express();

app.use(cors({ origin: process.env.ALLOWED_ORIGIN!, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(limiter);

app.get("/", (req, res) => {
  res.json("Welcome to the NoteAI API!");
});

app.use("/api", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
