import "server-only";

import { NextResponse } from "next/server";

import { getAIProvider } from "@/lib/providers";
import {
  AIMessage,
  AITool,
  AIToolResult,
} from "@/lib/providers/types";

import {
  getRepositories,
  getRepository,
  getBranches,
  getIssues,
  getPullRequests,
  getWorkflowRuns,
} from "@/lib/github";

interface ChatMessage {
  role: "user" | "model";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  activeRepository?: string | null;
  provider?: "openai" | "gemini";
  model?: string;
}

const MAX_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 10_000;
const MAX_TOOL_ROUNDS = 8;

const PROVIDER_MODELS = {
  openai: ["gpt-5.6-luna"],
  gemini: ["gemini-3.6-flash"],
} as const;

function isValidRepositoryName(repo: string): boolean {
  return /^[A-Za-z0-9._-]+$/.test(repo);
}

function isValidMessages(value: unknown): value is ChatMessage[] {
  if (!Array.isArray(value) || value.length === 0) {
    return false;
  }

  if (value.length > MAX_MESSAGES) {
    return false;
  }

  return value.every(
    (message) =>
      message &&
      typeof message === "object" &&
      (message.role === "user" || message.role === "model") &&
      typeof message.content === "string" &&
      message.content.trim().length > 0 &&
      message.content.length <= MAX_MESSAGE_LENGTH,
  );
}

function isValidProvider(
  provider: unknown,
): provider is "openai" | "gemini" {
  return provider === "openai" || provider === "gemini";
}

function isValidModel(
  provider: "openai" | "gemini",
  model: unknown,
): model is string {
  return (
    typeof model === "string" &&
    (PROVIDER_MODELS[provider] as readonly string[]).includes(
      model,
    )
  );
}

const githubTools: AITool[] = [
  {
    name: "listRepositories",
    description:
      "Retrieve all repositories accessible to the configured GitHub account.",
  },
  {
    name: "getRepositoryMetadata",
    description:
      "Retrieve metadata for a specific GitHub repository.",
    parameters: {
      type: "object",
      properties: {
        repo: {
          type: "string",
          description:
            "The repository name, for example dcloud.",
        },
      },
      required: ["repo"],
    },
  },
  {
    name: "listBranches",
    description:
      "Retrieve all branches for a specific GitHub repository.",
    parameters: {
      type: "object",
      properties: {
        repo: {
          type: "string",
          description: "The repository name.",
        },
      },
      required: ["repo"],
    },
  },
  {
    name: "listIssues",
    description:
      "Retrieve all issues for a specific GitHub repository.",
    parameters: {
      type: "object",
      properties: {
        repo: {
          type: "string",
          description: "The repository name.",
        },
      },
      required: ["repo"],
    },
  },
  {
    name: "listPullRequests",
    description:
      "Retrieve all pull requests for a specific GitHub repository.",
    parameters: {
      type: "object",
      properties: {
        repo: {
          type: "string",
          description: "The repository name.",
        },
      },
      required: ["repo"],
    },
  },
  {
    name: "listWorkflowRuns",
    description:
      "Retrieve GitHub Actions workflow runs for a specific GitHub repository.",
    parameters: {
      type: "object",
      properties: {
        repo: {
          type: "string",
          description: "The repository name.",
        },
      },
      required: ["repo"],
    },
  },
];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ChatRequest>;

    const {
      messages,
      activeRepository,
      provider,
      model,
    } = body;

    if (!isValidMessages(messages)) {
      return NextResponse.json(
        {
          error: "Invalid messages payload.",
        },
        { status: 400 },
      );
    }

    if (
      activeRepository !== undefined &&
      activeRepository !== null &&
      (typeof activeRepository !== "string" ||
        !isValidRepositoryName(activeRepository))
    ) {
      return NextResponse.json(
        {
          error: "Invalid activeRepository.",
        },
        { status: 400 },
      );
    }

    if (!isValidProvider(provider)) {
      return NextResponse.json(
        {
          error: "Invalid AI provider.",
        },
        { status: 400 },
      );
    }

    if (!isValidModel(provider, model)) {
      return NextResponse.json(
        {
          error: "Invalid AI model for the selected provider.",
        },
        { status: 400 },
      );
    }

    const normalizedRepository =
      activeRepository?.trim() || null;

    const systemInstruction = normalizedRepository
      ? [
          "You are DCloud, an AI coding and GitHub assistant for the davidcloud001 GitHub account.",
          `The currently active repository is "${normalizedRepository}".`,
          "When the user asks about a repository-specific resource without naming a repository, use the active repository.",
          "If the user explicitly names another repository, use that repository instead.",
          "You have read-only access to GitHub data through the provided tools.",
          "Never claim to create, modify, delete, merge, commit, push, trigger, or otherwise change anything on GitHub.",
          "If the requested operation requires a write action, explain that the current assistant is read-only.",
          "Use the GitHub tools when real repository data is required.",
        ].join(" ")
      : [
          "You are DCloud, an AI coding and GitHub assistant for the davidcloud001 GitHub account.",
          "You have read-only access to GitHub data through the provided tools.",
          "For account-level questions, use listRepositories when repository information is required.",
          "For repository-specific questions, use the repository named by the user.",
          "If a repository-specific request does not identify a repository and there is no active repository, ask the user which repository they mean.",
          "Never claim to create, modify, delete, merge, commit, push, trigger, or otherwise change anything on GitHub.",
          "If the requested operation requires a write action, explain that the current assistant is read-only.",
          "Use the GitHub tools when real repository data is required.",
        ].join(" ");

    const aiMessages: AIMessage[] = messages.map(
      (message) => ({
        role:
          message.role === "model"
            ? "assistant"
            : "user",
        content: message.content,
      }),
    );

    const providerInstance = getAIProvider(provider);

    let response =
      await providerInstance.generateResponse({
        model,
        systemInstruction,
        messages: aiMessages,
        tools: githubTools,
      });

    let toolRound = 0;

    while (true) {
      const toolCalls = response.toolCalls ?? [];

      if (toolCalls.length === 0) {
        return NextResponse.json({
          role: "model",
          content:
            response.content ||
            "I couldn't generate a response for that request.",
        });
      }

      toolRound += 1;

      if (toolRound > MAX_TOOL_ROUNDS) {
        return NextResponse.json(
          {
            error:
              "The assistant reached the maximum number of tool calls.",
          },
          { status: 500 },
        );
      }

      const toolResults: AIToolResult[] = [];

      for (const toolCall of toolCalls) {
        const repositoryArgument =
          typeof toolCall.arguments.repo === "string"
            ? toolCall.arguments.repo.trim()
            : null;

        const targetRepository =
          repositoryArgument || normalizedRepository;

        let result: unknown;

        try {
          switch (toolCall.name) {
            case "listRepositories": {
              result = await getRepositories();
              break;
            }

            case "getRepositoryMetadata": {
              if (!targetRepository) {
                throw new Error(
                  "A repository name is required for this operation.",
                );
              }

              if (!isValidRepositoryName(targetRepository)) {
                throw new Error(
                  "Invalid repository name.",
                );
              }

              result =
                await getRepository(targetRepository);
              break;
            }

            case "listBranches": {
              if (!targetRepository) {
                throw new Error(
                  "A repository name is required for this operation.",
                );
              }

              if (!isValidRepositoryName(targetRepository)) {
                throw new Error(
                  "Invalid repository name.",
                );
              }

              result =
                await getBranches(targetRepository);
              break;
            }

            case "listIssues": {
              if (!targetRepository) {
                throw new Error(
                  "A repository name is required for this operation.",
                );
              }

              if (!isValidRepositoryName(targetRepository)) {
                throw new Error(
                  "Invalid repository name.",
                );
              }

              result =
                await getIssues(targetRepository);
              break;
            }

            case "listPullRequests": {
              if (!targetRepository) {
                throw new Error(
                  "A repository name is required for this operation.",
                );
              }

              if (!isValidRepositoryName(targetRepository)) {
                throw new Error(
                  "Invalid repository name.",
                );
              }

              result =
                await getPullRequests(targetRepository);
              break;
            }

            case "listWorkflowRuns": {
              if (!targetRepository) {
                throw new Error(
                  "A repository name is required for this operation.",
                );
              }

              if (!isValidRepositoryName(targetRepository)) {
                throw new Error(
                  "Invalid repository name.",
                );
              }

              result =
                await getWorkflowRuns(targetRepository);
              break;
            }

            default: {
              throw new Error(
                `Unknown GitHub tool: ${toolCall.name}`,
              );
            }
          }
        } catch (error: unknown) {
          result = {
            error:
              error instanceof Error
                ? error.message
                : "GitHub operation failed.",
          };
        }

        toolResults.push({
          toolCallId: toolCall.id,
          name: toolCall.name,
          result,
        });
      }

      response =
        await providerInstance.generateResponse({
          model,
          systemInstruction,
          messages: aiMessages,
          tools: githubTools,
          toolCalls,
          toolResults,
        });
    }
  } catch (error: unknown) {
    console.error("Chat API Error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Internal Server Error.",
      },
      { status: 500 },
    );
  }
}