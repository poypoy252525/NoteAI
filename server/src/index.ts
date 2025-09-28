import "dotenv/config";
import express from "express";
import router from "./routes";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({ origin: process.env.ALLOWED_ORIGIN!, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json("Welcome to the NoteAI API!");
});

app.use("/api", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
