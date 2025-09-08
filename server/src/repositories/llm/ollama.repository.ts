import { Ollama } from "ollama";
import LLMRepository from "./llm.interface";
import { readFileSync } from "fs";
import path from "path";

const prompt = readFileSync(path.join(__dirname, "prompt.txt"), "utf-8");

class OllamaRepository implements LLMRepository {
  private ollama = new Ollama();
  private model: string;

  constructor(model: string = "gemma3:270m") {
    this.model = model;
  }
  generateEmbedding(text: string): Promise<number[] | undefined> {
    throw new Error("Method not implemented.");
  }
  async categorizeNote(note: string): Promise<string | undefined> {
    const response = await this.ollama.chat({
      model: this.model,
      messages: [
        {
          role: "system",
          content:
            "categorize this note without saying any explanation, the output must be the categorized version and nothing more. the category must not too long, perhaps 3 words at most you can exceed if really in need. \n\n",
        },
        {
          role: "user",
          content: note,
        },
      ],
      options: {
        temperature: 0.1,
      },
    });

    return response.message.content;
  }
  async summarizeNote(note: string): Promise<string | undefined> {
    const response = await this.ollama.chat({
      model: this.model,
      messages: [
        {
          role: "system",
          content:
            "summarize this note without saying any explanation, the output must be the summarized version and nothing more. respond with less than or equal 300 tokens. \n\n",
        },
        {
          role: "user",
          content: note,
        },
      ],
    });

    return response.message.content;
  }

  async generateEmbeddingResponse(input: string) {
    const response = await this.ollama.embed({
      model: "embeddinggemma:latest",
      input: input,
    });

    return response.embeddings;
  }

  async generateResponse(message: string): Promise<string> {
    const response = await this.ollama.chat({
      model: this.model,

      // think: true,
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return response.message.content;
  }
}

export default OllamaRepository;
