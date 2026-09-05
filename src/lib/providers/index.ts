import { GeminiProvider } from "./gemini";
import { OpenAIProvider } from "./openai";
import { AIProvider } from "./types";

export type AIProviderName = "gemini" | "openai";

export function getAIProvider(
  providerName: AIProviderName,
): AIProvider {
  switch (providerName) {
    case "openai":
      return new OpenAIProvider();

    case "gemini":
      return new GeminiProvider();

    default:
      throw new Error(
        `Unsupported AI provider: ${providerName}`,
      );
  }
}