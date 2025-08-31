interface LLMRepository {
  generateResponse(message: string): Promise<string>;
}

export default LLMRepository;
