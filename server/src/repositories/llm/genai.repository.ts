import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import { readFileSync } from "fs";
import path from "path";
import LLMRepository from "./llm.interface";

const API_KEY = process.env.GENAI_API_KEY!;

const prompt = readFileSync(path.join(__dirname, "prompt.txt"), "utf-8");

class GenAIRepository implements LLMRepository {
  private genAI;
  private readonly modelName: string = "gemini-2.5-flash-lite";

  constructor() {
    this.genAI = new GoogleGenAI({
      apiKey: API_KEY,
    });
  }
  async categorizeNote(note: string): Promise<string | undefined> {
    const response = await this.genAI.models.generateContent({
      model: this.modelName,
      config: {
        systemInstruction:
          "categorize this note without saying any explanation, the output must be the categorized version and nothing more. the category must not too long, perhaps 3 words at most you can exceed if really in need. \n\n",
      },
      contents: [
        {
          role: "user",
          parts: [{ text: note }],
        },
      ],
    });

    return response.text;
  }
  async summarizeNote(note: string): Promise<string | undefined> {
    const response = await this.genAI.models.generateContent({
      model: this.modelName,
      config: {
        systemInstruction:
          "summarize this note without saying any explanation, the output must be the summarized version and nothing more. respond with less than or equal 300 tokens. \n\n",
      },
      contents: [
        {
          role: "user",
          parts: [{ text: note }],
        },
      ],
    });

    return response.text;
  }

  async generateResponse(message: string): Promise<string | undefined> {
    const response = await this.genAI.models.generateContent({
      model: this.modelName,
      config: {
        systemInstruction: prompt,
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: message,
            },
          ],
        },
      ],
    });

    return response.text;
  }

  async generateEmbedding(text: string): Promise<number[] | undefined> {
    try {
      const response = await this.genAI.models.embedContent({
        model: "gemini-embedding-001",
        contents: [
          {
            parts: [{ text }],
          },
        ],
        config: {
          taskType: "SEMANTIC_SIMILARITY",
          outputDimensionality: 1536,
        },
      });

      return response.embeddings?.[0]?.values;
    } catch (error) {
      console.error("Error generating embedding:", error);
      return undefined;
    }
  }
}

export default GenAIRepository;
