import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/test", async (req, res) => {
  const user = await prisma.user.create({
    data: {
      email: "carlj@noteai.com",
    },
  });

  res.json({ message: "User created", data: user });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
