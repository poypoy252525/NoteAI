import LLMRepository from "../repositories/llm/llm.interface";
import NoteRepository from "../repositories/note.repository";

type CreateNoteParams = {
  userId: string;
  title: string;
  content: string;
};

class NoteService {
  private noteRepository: NoteRepository = new NoteRepository();
  private llmRepository: LLMRepository;

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
}

export default NoteService;
