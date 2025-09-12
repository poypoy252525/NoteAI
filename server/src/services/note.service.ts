import LLMRepository from "../repositories/llm/llm.interface";
import NoteRepository from "../repositories/note.repository";
import { PrismaClient } from "@prisma/client";

type CreateNoteParams = {
  userId: string;
  title: string;
  content: string;
};

type UpdateNoteParams = {
  title: string;
  content: string;
  category?: string;
};

class NoteService {
  private noteRepository: NoteRepository = new NoteRepository();
  private llmRepository: LLMRepository;
  private prisma = new PrismaClient();

  constructor(llmRepository: LLMRepository) {
    this.llmRepository = llmRepository;
  }

  async createNote({ userId, title, content }: CreateNoteParams) {
    let summary: string = "";

    if (content.length > 80) {
      const result = await this.llmRepository.summarizeNote(content);
      if (result) summary = result;
    }

    const category = await this.llmRepository.categorizeNote(content);

    return this.noteRepository.createNote({
      userId,
      title,
      content,
      summary,
      category,
    });
  }

  async getNotesByUserId(userId: string) {
    return this.noteRepository.getNotesByUserId(userId);
  }

  async getNoteById(id: string) {
    return this.noteRepository.getNoteById(id);
  }

  async deleteNote(id: string) {
    return this.noteRepository.deleteNote(id);
  }

  async updateNote(id: string, data: UpdateNoteParams) {
    // Update the note first
    const updatedNote = await this.noteRepository.updateNote(id, data);

    // Background AI processing for content changes
    if (data.content && data.content.length > 80) {
      // Update summary asynchronously
      this.updateNoteSummaryAsync(id, data.content).catch((error) => {
        console.error(`Failed to update summary for note ${id}:`, error);
      });
    }

    // Update category if not explicitly provided
    if (!data.category) {
      this.updateNoteCategoryAsync(id, data.content).catch((error) => {
        console.error(`Failed to update category for note ${id}:`, error);
      });
    }

    return updatedNote;
  }

  private async updateNoteSummaryAsync(id: string, content: string): Promise<void> {
    try {
      const summary = await this.llmRepository.summarizeNote(content);
      if (summary) {
        // Direct database update for summary only
        await this.prisma.note.update({
          where: { id },
          data: { summary }
        });
      }
    } catch (error) {
      console.error('Error updating note summary:', error);
    }
  }

  private async updateNoteCategoryAsync(id: string, content: string): Promise<void> {
    try {
      const category = await this.llmRepository.categorizeNote(content);
      if (category) {
        // Direct database update for category only
        await this.prisma.note.update({
          where: { id },
          data: { category }
        });
      }
    } catch (error) {
      console.error('Error updating note category:', error);
    }
  }
}

export default NoteService;
