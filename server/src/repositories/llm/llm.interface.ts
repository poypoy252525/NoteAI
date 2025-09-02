interface LLMRepository {
  generateResponse(message: string): Promise<string | undefined>;
}

export default LLMRepository;
