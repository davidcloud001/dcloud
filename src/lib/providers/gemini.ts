import "server-only";

import {
  generateGeminiContent,
  GeminiContent,
  GeminiFunctionDeclaration,
  GeminiPart,
} from "@/lib/gemini";

import {
  AIProvider,
  AIProviderRequest,
  AIResponse,
  AIToolCall,
} from "./types";

export const GEMINI_PROVIDER_MODEL = "gemini-3.6-flash";

function convertMessagesToGemini(
  messages: AIProviderRequest["messages"],
): GeminiContent[] {
  return messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [
      {
        text: message.content,
      },
    ],
  }));
}

function convertToolsToGemini(
  tools: AIProviderRequest["tools"],
): GeminiFunctionDeclaration[] {
  if (!tools) {
    return [];
  }

  return tools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    ...(tool.parameters
      ? {
          parameters: tool.parameters,
        }
      : {}),
  }));
}

function convertToolCallsToGemini(
  toolCalls: AIToolCall[],
): GeminiPart[] {
  return toolCalls.map((toolCall) => ({
    functionCall: {
      name: toolCall.name,
      args: toolCall.arguments,
      id: toolCall.id,
    },
  }));
}

function convertToolResultsToGemini(
  request: AIProviderRequest,
): GeminiPart[] {
  if (!request.toolResults || request.toolResults.length === 0) {
    return [];
  }

  const toolCalls = request.toolCalls ?? [];

  return request.toolResults.map((toolResult) => {
    const matchingToolCall = toolCalls.find(
      (toolCall) => toolCall.id === toolResult.toolCallId,
    );

    return {
      functionResponse: {
        name: matchingToolCall?.name ?? toolResult.name,
        id: toolResult.toolCallId,
        response: {
          result: toolResult.result,
        },
      },
    };
  });
}

export class GeminiProvider implements AIProvider {
  async generateResponse(
    request: AIProviderRequest,
  ): Promise<AIResponse> {
    const contents = convertMessagesToGemini(request.messages);

    if (request.toolCalls && request.toolCalls.length > 0) {
      contents.push({
        role: "model",
        parts: convertToolCallsToGemini(request.toolCalls),
      });
    }

    const toolResults = convertToolResultsToGemini(request);

    if (toolResults.length > 0) {
      contents.push({
        role: "user",
        parts: toolResults,
      });
    }

    const response = await generateGeminiContent({
      model: request.model,
      systemInstruction: request.systemInstruction,
      contents,
      tools: convertToolsToGemini(request.tools),
    });

    const candidate = response.candidates?.[0];
    const modelContent = candidate?.content;

    if (!modelContent) {
      throw new Error("Gemini returned an empty response.");
    }

    const toolCalls: AIToolCall[] = modelContent.parts
      .filter(
        (
          part,
        ): part is GeminiPart & {
          functionCall: {
            name: string;
            args?: Record<string, unknown>;
            id?: string;
          };
        } => Boolean(part.functionCall),
      )
      .map((part) => ({
        id: part.functionCall.id ?? crypto.randomUUID(),
        name: part.functionCall.name,
        arguments: part.functionCall.args ?? {},
      }));

    const content = modelContent.parts
      .filter(
        (part): part is GeminiPart & { text: string } =>
          typeof part.text === "string",
      )
      .map((part) => part.text)
      .join("\n")
      .trim();

    return {
      content: content || undefined,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
    };
  }
}