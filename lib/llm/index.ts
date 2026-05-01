import { GeminiProvider } from "./gemini";
import { OllamaProvider } from "./ollama";
import type { LlmProvider } from "./types";

export function getLlmProvider(): LlmProvider {
  const provider = process.env.LLM_PROVIDER?.toLowerCase();

  if (provider === "ollama") {
    return new OllamaProvider();
  }

  if (provider === "gemini" || process.env.GEMINI_API_KEY) {
    return new GeminiProvider();
  }

  return new OllamaProvider();
}

export function parseJsonResponse<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return fallback;
    try {
      return JSON.parse(match[0]) as T;
    } catch {
      return fallback;
    }
  }
}
