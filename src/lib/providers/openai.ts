import "server-only";

import OpenAI from "openai";

import {
  AIProvider,
  AIProviderRequest,
  AIResponse,
  AIToolCall,
} from "./types";

function getOpenAIApiKey(): string {
  const key = process.env.OPENAI_API_KEY;

  if (!key) {
    throw new Error("Missing OPENAI_API_KEY environment variable.");
  }

  return key;
}

const openai = new OpenAI({
  apiKey: getOpenAIApiKey(),
});

export const OPENAI_MODEL = "gpt-5.6-luna";

export class OpenAIProvider implements AIProvider {
  async generateResponse(
    request: AIProviderRequest,
  ): Promise<AIResponse> {
    const input: OpenAI.Responses.ResponseInput = [];

    for (const message of request.messages) {
      input.push({
        role: message.role,
        content: message.content,
      });
    }

    if (request.toolCalls) {
      for (const toolCall of request.toolCalls) {
        input.push({
          type: "function_call",
          call_id: toolCall.id,
          name: toolCall.name,
          arguments: JSON.stringify(toolCall.arguments),
        });
      }
    }

    if (request.toolResults) {
      for (const toolResult of request.toolResults) {
        input.push({
          type: "function_call_output",
          call_id: toolResult.toolCallId,
          output: JSON.stringify(toolResult.result),
        });
      }
    }

    const tools = request.tools?.map((tool) => ({
      type: "function" as const,
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters ?? {
        type: "object",
        properties: {},
      },
      strict: false,
    }));

    const response = await openai.responses.create({
      model: request.model,
      instructions: request.systemInstruction,
      input,
      tools,
      tool_choice: tools?.length ? "auto" : undefined,
    });

    const toolCalls: AIToolCall[] = response.output
      .filter(
        (item): item is OpenAI.Responses.ResponseFunctionToolCall =>
          item.type === "function_call",
      )
      .map((item) => ({
        id: item.call_id,
        name: item.name,
        arguments: JSON.parse(item.arguments) as Record<string, unknown>,
      }));

    return {
      content: response.output_text || undefined,
      toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
    };
  }
}