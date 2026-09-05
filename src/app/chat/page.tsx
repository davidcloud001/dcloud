"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const suggestions = [
  "What repositories do I have?",
  "Show me the branches in dcloud",
  "Show my open issues",
  "Show recent Actions runs",
];

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

type GitHubRepository = {
  name: string;
};

type AIProvider = "openai" | "gemini";

type AIModel =
  | "gpt-5.6-luna"
  | "gemini-3.6-flash";

type ChatResponse = {
  role?: "model";
  content?: string;
  error?: string;
};

const providerModels: Record<
  AIProvider,
  { value: AIModel; label: string }[]
> = {
  openai: [
    {
      value: "gpt-5.6-luna",
      label: "GPT-5.6 Luna",
    },
  ],
  gemini: [
    {
      value: "gemini-3.6-flash",
      label: "Gemini 3.6 Flash",
    },
  ],
};

export default function ChatPage() {
  const [repositories, setRepositories] = useState<string[]>([]);

  const [activeRepository, setActiveRepository] =
    useState("All repositories");

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);

  const [repositoriesLoading, setRepositoriesLoading] =
    useState(true);

  const [repositoriesError, setRepositoriesError] =
    useState(false);

  const [chatLoading, setChatLoading] = useState(false);

  const [chatError, setChatError] = useState("");

  const [aiProvider, setAiProvider] =
    useState<AIProvider>("openai");

  const [aiModel, setAiModel] =
    useState<AIModel>("gpt-5.6-luna");

  useEffect(() => {
    async function loadRepositories() {
      try {
        const response = await fetch(
          "/api/github/repositories",
        );

        if (!response.ok) {
          throw new Error("Failed to load repositories");
        }

        const data: GitHubRepository[] =
          await response.json();

        const repositoryNames = Array.isArray(data)
          ? data
              .map((repository) => repository.name)
              .filter(Boolean)
          : [];

        setRepositories(repositoryNames);
      } catch (error) {
        console.error(
          "Failed to load GitHub repositories:",
          error,
        );

        setRepositoriesError(true);
      } finally {
        setRepositoriesLoading(false);
      }
    }

    loadRepositories();
  }, []);

  function handleProviderChange(
    provider: AIProvider,
  ) {
    setAiProvider(provider);

    const firstModel = providerModels[provider][0];

    if (firstModel) {
      setAiModel(firstModel.value);
    }
  }

  function handleSuggestion(prompt: string) {
    setMessage(prompt);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || chatLoading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: trimmedMessage,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setMessage("");
    setChatError("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map(
            (currentMessage) => ({
              role:
                currentMessage.role === "assistant"
                  ? "model"
                  : "user",
              content: currentMessage.content,
            }),
          ),
          activeRepository:
            activeRepository === "All repositories"
              ? undefined
              : activeRepository,
          provider: aiProvider,
          model: aiModel,
        }),
      });

      const responseText = await response.text();

      let data: ChatResponse = {};

      if (responseText.trim()) {
        try {
          data = JSON.parse(
            responseText,
          ) as ChatResponse;
        } catch {
          throw new Error(
            `DC~BOT server returned an invalid response (HTTP ${response.status}).`,
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            `DC~BOT request failed (HTTP ${response.status}).`,
        );
      }

      const assistantContent =
        data.content ||
        "DC~BOT did not return a response.";

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: assistantContent,
        },
      ]);
    } catch (error) {
      console.error("Chat request failed:", error);

      setChatError(
        error instanceof Error
          ? error.message
          : "Failed to get a response from DC~BOT.",
      );
    } finally {
      setChatLoading(false);
    }
  }

  const showEmptyState = messages.length === 0;

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-start justify-between gap-6 px-6 py-5">
          <div>
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
            >
              ← Dashboard
            </Link>

            <h1 className="mt-3 text-xl font-semibold tracking-tight">
              DC~BOT
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              Your coding &amp; GitHub assistant
            </p>
          </div>

          <div className="flex items-start gap-5">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="ai-provider"
                  className="text-xs font-medium text-zinc-500"
                >
                  Provider
                </label>

                <select
                  id="ai-provider"
                  value={aiProvider}
                  onChange={(event) =>
                    handleProviderChange(
                      event.target.value as AIProvider,
                    )
                  }
                  disabled={chatLoading}
                  className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm font-medium text-zinc-700 outline-none transition hover:border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="openai">
                    OpenAI
                  </option>

                  <option value="gemini">
                    Gemini
                  </option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="ai-model"
                  className="text-xs font-medium text-zinc-500"
                >
                  Model
                </label>

                <select
                  id="ai-model"
                  value={aiModel}
                  onChange={(event) =>
                    setAiModel(
                      event.target.value as AIModel,
                    )
                  }
                  disabled={chatLoading}
                  className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm font-medium text-zinc-700 outline-none transition hover:border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {providerModels[aiProvider].map(
                    (model) => (
                      <option
                        key={model.value}
                        value={model.value}
                      >
                        {model.label}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1.5 text-sm text-zinc-500">
              <span className="text-emerald-500">
                ●
              </span>
              <span>Read-only</span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-6 pt-5">
        <div className="flex items-center gap-3">
          <label
            htmlFor="repository"
            className="text-sm font-medium text-zinc-600"
          >
            Repository
          </label>

          <select
            id="repository"
            value={activeRepository}
            onChange={(event) =>
              setActiveRepository(event.target.value)
            }
            disabled={
              repositoriesLoading || chatLoading
            }
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 outline-none transition hover:border-zinc-300 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100 disabled:cursor-wait disabled:opacity-60"
          >
            <option value="All repositories">
              {repositoriesLoading
                ? "Loading repositories..."
                : "All repositories"}
            </option>

            {repositories.map((repository) => (
              <option
                key={repository}
                value={repository}
              >
                {repository}
              </option>
            ))}
          </select>
        </div>

        {repositoriesError && (
          <p className="mt-2 text-xs text-red-600">
            Failed to load GitHub repositories.
          </p>
        )}
      </div>

      <section className="flex min-h-0 flex-1">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6">
          <div className="flex-1 py-12">
            {showEmptyState ? (
              <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
                <div className="mb-5">
                  <h2 className="text-3xl font-semibold tracking-tight">
                    DC~BOT
                  </h2>

                  <p className="mt-3 text-lg text-zinc-600">
                    How can I help with DCloud?
                  </p>
                </div>

                <p className="max-w-lg text-sm leading-6 text-zinc-500">
                  I can inspect your repositories,
                  branches, issues, pull requests, and
                  GitHub Actions.
                </p>

                <div className="mt-8 grid w-full max-w-xl gap-3 sm:grid-cols-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() =>
                        handleSuggestion(suggestion)
                      }
                      disabled={chatLoading}
                      className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left text-sm text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {messages.map((currentMessage) => (
                  <div
                    key={currentMessage.id}
                    className="space-y-2"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      {currentMessage.role === "user"
                        ? "You"
                        : "DC~BOT"}
                    </p>

                    <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-800">
                      {currentMessage.content}
                    </p>
                  </div>
                ))}

                {chatLoading && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                      DC~BOT
                    </p>

                    <p className="text-sm text-zinc-400">
                      Thinking...
                    </p>
                  </div>
                )}

                {chatError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {chatError}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="sticky bottom-0 pb-5 pt-4">
            <form onSubmit={handleSubmit}>
              <div className="flex items-end gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition focus-within:border-zinc-300">
                <textarea
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  placeholder="Ask DC~BOT anything..."
                  rows={1}
                  disabled={chatLoading}
                  className="min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 disabled:opacity-60"
                />

                <button
                  type="submit"
                  disabled={
                    !message.trim() || chatLoading
                  }
                  aria-label="Send message"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-lg text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {chatLoading ? "…" : "↑"}
                </button>
              </div>
            </form>

            <p className="mt-3 text-center text-xs text-zinc-400">
              Read-only GitHub access
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}