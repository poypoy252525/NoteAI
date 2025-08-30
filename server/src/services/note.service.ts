import NoteRepository from "../repositories/note.repository";

type CreateNoteParams = {
  userId: string;
  title: string;
  content: string;
};

class NoteService {
  private noteRepository: NoteRepository = new NoteRepository();

  async createNote({ userId, title, content }: CreateNoteParams) {
    return this.noteRepository.createNote({ userId, title, content });
  }
}

export default NoteService;
