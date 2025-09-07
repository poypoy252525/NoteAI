import type { Request, Response } from "express";
import NoteService from "../services/note.service";
import { z } from "zod";
import GenAIRepository from "../repositories/llm/genai.repository";
import OllamaRepository from "../repositories/llm/ollama.repository";

const noteService = new NoteService(new GenAIRepository());

const createNoteSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const createNoteController = async (req: Request, res: Response) => {
  try {
    const validation = createNoteSchema.safeParse(req.body);
    const { userId } = req.params;
    if (!validation.success) {
      return res.status(400).json({ error: z.prettifyError(validation.error) });
    }
    const { title, content } = validation.data;
    const note = await noteService.createNote({
      userId: userId!,
      title,
      content,
    });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getNotesByUserIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;
    const notes = await noteService.getNotesByUserId(userId!);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error });
  }
};
