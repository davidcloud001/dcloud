import "server-only";

function getGeminiApiKey(): string {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    throw new Error("Missing GEMINI_API_KEY environment variable.");
  }

  return key;
}

const GEMINI_API_KEY = getGeminiApiKey();

export const GEMINI_MODEL = "gemini-3.6-flash";

export interface GeminiFunctionDeclaration {
  name: string;
  description: string;
  parameters?: Record<string, unknown>;
}

export interface GeminiContent {
  role: "user" | "model";
  parts: GeminiPart[];
}

export interface GeminiPart {
  text?: string;
  functionCall?: {
    name: string;
    args?: Record<string, unknown>;
    id?: string;
  };
  functionResponse?: {
    name: string;
    id?: string;
    response: {
      result: unknown;
    };
  };
}

export interface GeminiResponse {
  candidates?: Array<{
    content?: GeminiContent;
    finishReason?: string;
  }>;
  error?: {
    message?: string;
    status?: string;
    code?: number;
  };
}

interface GenerateGeminiContentOptions {
  model: string;
  systemInstruction: string;
  contents: GeminiContent[];
  tools?: GeminiFunctionDeclaration[];
}

export async function generateGeminiContent({
  model,
  systemInstruction,
  contents,
  tools = [],
}: GenerateGeminiContentOptions): Promise<GeminiResponse> {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  headers.set("x-goog-api-key", GEMINI_API_KEY);

  const geminiApiUrl =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const response = await fetch(geminiApiUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      systemInstruction: {
        parts: [
          {
            text: systemInstruction,
          },
        ],
      },
      contents,
      tools:
        tools.length > 0
          ? [
              {
                functionDeclarations: tools,
              },
            ]
          : undefined,
    }),
  });

  const data = (await response.json()) as GeminiResponse;

  if (!response.ok) {
    throw new Error(
      data.error?.message ||
        `Gemini API request failed with HTTP ${response.status}.`,
    );
  }

  return data;
}