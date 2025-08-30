import { PrismaClient } from "@prisma/client";

type CreateNoteParams = {
  userId: string;
  title: string;
  content: string;
};

class NoteRepository {
  private prisma = new PrismaClient();

  async createNote({ userId, title, content }: CreateNoteParams) {
    const note = await this.prisma.note.create({
      data: {
        title,
        content,
        userId,
      },
    });

    return note;
  }
}

export default NoteRepository;
