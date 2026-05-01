import type { LlmGenerateOptions, LlmMessage, LlmProvider } from "./types";

type GeminiPart = {
  text?: string;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: GeminiPart[];
    };
    finishReason?: string;
  }>;
  error?: {
    message?: string;
  };
};

export class GeminiProvider implements LlmProvider {
  name = "gemini";
  model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  private apiKey = process.env.GEMINI_API_KEY;

  async generate(messages: LlmMessage[], options: LlmGenerateOptions = {}) {
    if (!this.apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    const systemText = messages
      .filter((message) => message.role === "system")
      .map((message) => message.content)
      .join("\n\n");

    const contents = messages
      .filter((message) => message.role !== "system")
      .map((message) => ({
        role: message.role === "assistant" ? "model" : "user",
        parts: [{ text: message.content }]
      }));

    const modelName = this.model.replace(/^models\//, "");
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(this.apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: systemText ? { parts: [{ text: systemText }] } : undefined,
          contents,
          generationConfig: {
            temperature: options.temperature ?? 0.4,
            responseMimeType: options.format === "json" ? "application/json" : "text/plain"
          }
        })
      }
    );

    const data = (await response.json()) as GeminiResponse;
    if (!response.ok) {
      throw new Error(`Gemini returned ${response.status}: ${data.error?.message ?? "Unknown Gemini error"}`);
    }

    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
    if (!text) {
      throw new Error(`Gemini returned an empty response. Finish reason: ${data.candidates?.[0]?.finishReason ?? "unknown"}`);
    }

    return text;
  }
}
