export type LlmMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type LlmGenerateOptions = {
  temperature?: number;
  format?: "json" | "text";
};

export interface LlmProvider {
  name: string;
  model: string;
  generate(messages: LlmMessage[], options?: LlmGenerateOptions): Promise<string>;
}
