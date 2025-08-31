import { Ollama } from "ollama";
import LLMRepository from "./llm.interface";

class OllamaRepository implements LLMRepository {
  private ollama = new Ollama();
  private model: string;

  constructor(model: string = "gemma3:270m") {
    this.model = model;
  }
  async generateResponse(message: string): Promise<string> {
    const response = await this.ollama.chat({
      model: this.model,
      messages: [
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
