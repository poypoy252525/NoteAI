import { Request, Response } from "express";
import { z } from "zod";
import LLMService from "../services/llm.service";
import OllamaRepository from "../repositories/llm/ollama.repository";

const generateResponseSchema = z.object({
  message: z.string(),
});

const llmService = new LLMService(new OllamaRepository());

export const generateResponseController = async (
  req: Request,
  res: Response
) => {
  try {
    const validation = generateResponseSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: z.prettifyError(validation.error) });
    }
    const { message } = validation.data;
    const response = await llmService.generateResponse(message);
    return res.status(200).json({ message: response });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
