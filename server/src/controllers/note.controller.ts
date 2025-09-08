import type { Request, Response } from "express";
import NoteService from "../services/note.service";
import { z } from "zod";
import GenAIRepository from "../repositories/llm/genai.repository";
import OllamaRepository from "../repositories/llm/ollama.repository";
import SemanticSearchService from "../services/semantic-search.service";

const noteService = new NoteService(new GenAIRepository());
const semanticSearchService = new SemanticSearchService();

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

    // Generate embedding for the new note in the background
    const textToEmbed = `${title}\n\n${content}`;
    semanticSearchService.generateAndStoreEmbedding(note.id, textToEmbed)
      .catch(error => {
        console.error(`Failed to generate embedding for note ${note.id}:`, error);
      });

    res.json(note);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error });
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
