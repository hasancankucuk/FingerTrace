import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyAlwfQAySyrxIxrnpxN0hf9knbi0q7UUhY';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  }

  async generateResponse(message: string): Promise<string> {
    try {
      const result = await this.model.generateContent(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('Failed to generate response from Gemini');
    }
  }

  async generateStreamResponse(message: string): Promise<AsyncGenerator<string, void, unknown>> {
    try {
      const result = await this.model.generateContentStream(message);
      
      async function* streamGenerator() {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          yield chunkText;
        }
      }
      
      return streamGenerator();
    } catch (error) {
      console.error('Error generating stream response:', error);
      throw new Error('Failed to generate stream response from Gemini');
    }
  }
}

export const geminiService = new GeminiService();