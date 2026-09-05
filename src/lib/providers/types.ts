export type AIMessageRole = "user" | "assistant";

export interface AIMessage {
  role: AIMessageRole;
  content: string;
}

export interface AITool {
  name: string;
  description: string;
  parameters?: Record<string, unknown>;
}

export interface AIToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface AIToolResult {
  toolCallId: string;
  name: string;
  result: unknown;
}

export interface AIResponse {
  content?: string;
  toolCalls?: AIToolCall[];
}

export interface AIProviderRequest {
  model: string;
  systemInstruction: string;
  messages: AIMessage[];
  tools?: AITool[];
  toolCalls?: AIToolCall[];
  toolResults?: AIToolResult[];
}

export interface AIProvider {
  generateResponse(request: AIProviderRequest): Promise<AIResponse>;
}