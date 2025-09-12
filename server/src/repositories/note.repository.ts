import { PrismaClient } from "@prisma/client";

type CreateNoteParams = {
  userId: string;
  title: string;
  content: string;
  summary: string;
  category?: string;
};

type UpdateNoteParams = {
  title: string;
  content: string;
  category?: string;
};

class NoteRepository {
  private prisma = new PrismaClient();

  async createNote({
    userId,
    title,
    content,
    summary,
    category,
  }: CreateNoteParams) {
    const note = await this.prisma.note.create({
      data: {
        title,
        content,
        summary,
        userId,
        category: category || null,
      },
    });

    return note;
  }

  async getNotesByUserId(userId: string) {
    const notes = await this.prisma.note.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return notes;
  }

  async getNoteById(id: string) {
    const note = await this.prisma.note.findUnique({
      where: {
        id,
      },
    });

    return note;
  }

  async deleteNote(id: string) {
    const note = await this.prisma.note.delete({
      where: {
        id,
      },
    });

    return note;
  }

  async updateNote(id: string, data: UpdateNoteParams) {
    const note = await this.prisma.note.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        category: data.category || null,
        updatedAt: new Date(),
      },
    });

    return note;
  }
}

export default NoteRepository;
