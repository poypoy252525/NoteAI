import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import { readFileSync } from "fs";
import path from "path";
import LLMRepository from "./llm.interface";

const API_KEY = process.env.GENAI_API_KEY!;

const prompt = readFileSync(path.join(__dirname, "prompt.txt"), "utf-8");

class GenAIRepository implements LLMRepository {
  private genAI;

  constructor() {
    this.genAI = new GoogleGenAI({
      apiKey: API_KEY,
    });
  }

  async generateResponse(message: string): Promise<string | undefined> {
    const response = await this.genAI.models.generateContent({
      model: "gemma-3-27b-it",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${prompt}`,
            },
            {
              text: `${message}`,
            },
          ],
        },
      ],
    });

    return response.text;
  }
}

export default GenAIRepository;
