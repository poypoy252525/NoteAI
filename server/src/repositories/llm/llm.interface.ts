interface LLMRepository {
  generateResponse(message: string): Promise<string | undefined>;
  summarizeNote(note: string): Promise<string | undefined>;
  categorizeNote(note: string): Promise<string | undefined>;
  generateEmbedding(text: string): Promise<number[] | undefined>;
}

export default LLMRepository;
