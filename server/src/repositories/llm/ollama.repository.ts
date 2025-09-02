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
