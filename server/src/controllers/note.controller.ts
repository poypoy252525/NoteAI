import type { Request, Response } from "express";
import NoteService from "../services/note.service";
import { z } from "zod";

const noteService = new NoteService();

const createNoteSchema = z.object({
  userId: z.string(),
  title: z.string(),
  content: z.string(),
});

export const createNoteController = async (req: Request, res: Response) => {
  try {
    const validation = createNoteSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.format() });
    }
    const { userId, title, content } = validation.data;
    const note = await noteService.createNote({ userId, title, content });
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
