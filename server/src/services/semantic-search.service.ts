import { PrismaClient } from "@prisma/client";
import GenAIRepository from "../repositories/llm/genai.repository";

export interface SemanticSearchResult {
  id: string;
  title: string;
  content: string;
  category?: string;
  summary?: string;
  similarity: number;
  createdAt: Date;
  updatedAt: Date;
}

export class SemanticSearchService {
  private prisma: PrismaClient;
  private llmRepository: GenAIRepository;

  constructor() {
    this.prisma = new PrismaClient();
    this.llmRepository = new GenAIRepository();
  }

  async generateAndStoreEmbedding(
    noteId: string,
    content: string
  ): Promise<void> {
    try {
      const embedding = await this.llmRepository.generateEmbedding(content);

      if (!embedding) {
        throw new Error("Failed to generate embedding");
      }

      // Convert the embedding array to the format expected by pgvector
      const embeddingString = `[${embedding.join(",")}]`;

      await this.prisma.$executeRaw`
        UPDATE "Note" 
        SET embedding = ${embeddingString}::vector 
        WHERE id = ${noteId}::uuid
      `;
    } catch (error) {
      console.error("Error generating and storing embedding:", error);
      throw error;
    }
  }

  async searchSimilarNotes(
    query: string,
    userId: string,
    limit: number = 10,
    threshold: number = 0.7
  ): Promise<SemanticSearchResult[]> {
    try {
      const queryEmbedding = await this.llmRepository.generateEmbedding(query);

      if (!queryEmbedding) {
        throw new Error("Failed to generate query embedding");
      }

      const embeddingString = `[${queryEmbedding.join(",")}]`;

      // Use cosine similarity for semantic search
      const results = await this.prisma.$queryRaw<
        Array<{
          id: string;
          title: string;
          content: string;
          category: string | null;
          summary: string | null;
          similarity: number;
          createdAt: Date;
          updatedAt: Date;
        }>
      >`
        SELECT 
          id,
          title,
          content,
          category,
          summary,
          (1 - (embedding <=> ${embeddingString}::vector)) as similarity,
          "createdAt",
          "updatedAt"
        FROM "Note"
        WHERE "userId" = ${userId}::uuid
          AND embedding IS NOT NULL
          AND (1 - (embedding <=> ${embeddingString}::vector)) > ${threshold}
        ORDER BY embedding <=> ${embeddingString}::vector
        LIMIT ${limit}
      `;

      return results.map((result) => ({
        ...result,
        category: result.category || undefined,
        summary: result.summary || undefined,
      }));
    } catch (error) {
      console.error("Error performing semantic search:", error);
      throw error;
    }
  }

  async updateNoteEmbedding(noteId: string, newContent: string): Promise<void> {
    await this.generateAndStoreEmbedding(noteId, newContent);
  }

  async batchGenerateEmbeddings(userId: string): Promise<void> {
    try {
      // Get all notes without embeddings for the user using raw SQL
      const notesWithoutEmbeddings = await this.prisma.$queryRaw<
        Array<{
          id: string;
          title: string;
          content: string;
        }>
      >`
        SELECT id, title, content 
        FROM "Note" 
        WHERE "userId" = ${userId}::uuid 
          AND embedding IS NULL
      `;

      console.log(
        `Processing ${notesWithoutEmbeddings.length} notes for embeddings...`
      );

      for (const note of notesWithoutEmbeddings) {
        try {
          // Combine title and content for better embedding representation
          const textToEmbed = `${note.title}\n\n${note.content}`;
          await this.generateAndStoreEmbedding(note.id, textToEmbed);
          console.log(`Generated embedding for note: ${note.id}`);
        } catch (error) {
          console.error(
            `Failed to generate embedding for note ${note.id}:`,
            error
          );
        }
      }

      console.log("Batch embedding generation completed");
    } catch (error) {
      console.error("Error in batch embedding generation:", error);
      throw error;
    }
  }

  async findSimilarNotesToNote(
    noteId: string,
    limit: number = 5
  ): Promise<SemanticSearchResult[]> {
    try {
      // Get the note's embedding and user info using raw SQL
      const noteInfo = await this.prisma.$queryRaw<
        Array<{
          embedding: string;
          userId: string;
        }>
      >`
        SELECT embedding::text AS embedding, "userId"
        FROM "Note"
        WHERE id = ${noteId}::uuid
          AND embedding IS NOT NULL
      `;

      // If the note doesn't exist or has no embedding yet, return empty results instead of throwing
      if (!noteInfo.length) {
        return [];
      }

      const noteData = noteInfo[0];
      if (!noteData) {
        return [];
      }
      const { embedding, userId } = noteData;

      const results = await this.prisma.$queryRaw<
        Array<{
          id: string;
          title: string;
          content: string;
          category: string | null;
          summary: string | null;
          similarity: number;
          createdAt: Date;
          updatedAt: Date;
        }>
      >`
        SELECT 
          id,
          title,
          content,
          category,
          summary,
          (1 - (embedding <=> ${embedding}::vector)) as similarity,
          "createdAt",
          "updatedAt"
        FROM "Note"
        WHERE "userId" = ${userId}::uuid
          AND id != ${noteId}::uuid
          AND embedding IS NOT NULL
        ORDER BY embedding <=> ${embedding}::vector
        LIMIT ${limit}
      `;

      return results.map((result) => ({
        ...result,
        category: result.category || undefined,
        summary: result.summary || undefined,
      }));
    } catch (error) {
      console.error("Error finding similar notes:", error);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

export default SemanticSearchService;
