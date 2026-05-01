import type { LlmGenerateOptions, LlmMessage, LlmProvider } from "./types";

export class OllamaProvider implements LlmProvider {
  name = "ollama";
  model = process.env.OLLAMA_MODEL ?? "mistral";
  private baseUrl = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";

  async generate(messages: LlmMessage[], options: LlmGenerateOptions = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.model,
          messages,
          stream: false,
          format: options.format === "json" ? "json" : undefined,
          options: {
            temperature: options.temperature ?? 0.4
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama returned ${response.status}: ${await response.text()}`);
      }

      const data = (await response.json()) as { message?: { content?: string } };
      return data.message?.content ?? "";
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown Ollama error";
      throw new Error(
        `Could not reach Ollama at ${this.baseUrl}. Make sure Ollama is running and the '${this.model}' model is pulled. Details: ${message}`
      );
    }
  }
}
