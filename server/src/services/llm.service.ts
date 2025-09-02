import LLMRepository from "../repositories/llm/llm.interface";

class LLMService {
  private llmRepository: LLMRepository;
  constructor(llmRepository: LLMRepository) {
    this.llmRepository = llmRepository;
  }

  async generateResponse(message: string): Promise<string | undefined> {
    return this.llmRepository.generateResponse(message);
  }
}

export default LLMService;
