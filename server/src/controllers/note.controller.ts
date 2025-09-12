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

const updateNoteSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters long"),
  content: z.string().trim().min(3, "Content must be at least 3 characters long"),
  category: z.string().optional(),
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
    semanticSearchService
      .generateAndStoreEmbedding(note.id, textToEmbed)
      .catch((error) => {
        console.error(
          `Failed to generate embedding for note ${note.id}:`,
          error
        );
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

export const getNoteByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const note = await noteService.getNoteById(id!);
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error });
  }
};

export const deleteNoteController = async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.params;

    // First check if the note exists and belongs to the user
    const note = await noteService.getNoteById(id!);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    if (note.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You can only delete your own notes" });
    }

    await noteService.deleteNote(id!);
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error });
  }
};

export const updateNoteController = async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.params;
    
    // Validate input data
    const validation = updateNoteSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.issues });
    }

    const { title, content, category } = validation.data;

    // Check if the note exists and belongs to the user
    const existingNote = await noteService.getNoteById(id!);
    if (!existingNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    if (existingNote.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You can only update your own notes" });
    }

    // Update the note
    const updatedNote = await noteService.updateNote(id!, {
      title,
      content,
      category,
    });

    // Update embedding for semantic search in the background
    const textToEmbed = `${title}\n\n${content}`;
    semanticSearchService
      .updateNoteEmbedding(id!, textToEmbed)
      .catch((error) => {
        console.error(
          `Failed to update embedding for note ${id}:`,
          error
        );
      });

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error });
  }
};
