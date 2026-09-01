"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Repository = {
id: number;
name: string;
full_name: string;
description: string | null;
private: boolean;
language: string | null;
default_branch: string;
stargazers_count: number;
forks_count: number;
open_issues_count: number;
updated_at: string;
html_url: string;
};

export default function RepositoriesPage() {
const [repositories, setRepositories] = useState<Repository[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);

useEffect(() => {
async function loadRepositories() {
try {
const response = await fetch("/api/github/repositories");

    if (!response.ok) {
      throw new Error("Failed to fetch repositories");
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid repositories response");
    }

    setRepositories(data);
  } catch (error) {
    console.error("Failed to load repositories:", error);
    setError(true);
  } finally {
    setLoading(false);
  }
}

loadRepositories();

}, []);

return (
<div className="min-h-screen bg-zinc-50 text-zinc-900">
<header className="border-b border-zinc-200 bg-white">
<div className="mx-auto max-w-6xl px-6 py-6">
<Link
href="/"
className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
>
← Back to Dashboard
</Link>

      <h1 className="mt-4 text-3xl font-semibold">
        Repositories
      </h1>

      <p className="mt-1 text-sm text-zinc-500">
        Repositories accessible to the configured GitHub account.
      </p>
    </div>
  </header>

  <main className="mx-auto max-w-6xl px-6 py-8">
    {loading && (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-zinc-500">
          Loading repositories...
        </p>
      </div>
    )}

    {error && (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-700">
          Failed to load repositories from GitHub.
        </p>
      </div>
    )}

    {!loading && !error && repositories.length === 0 && (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-zinc-500">
          No repositories found.
        </p>
      </div>
    )}

    {!loading && !error && repositories.length > 0 && (
      <div className="grid gap-5 md:grid-cols-2">
        {repositories.map((repository) => (
          <Link
            key={repository.id}
            href={`/repositories/${repository.name}`}
            className="group rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold group-hover:underline">
                  {repository.name}
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  {repository.full_name}
                </p>
              </div>

              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                {repository.private ? "Private" : "Public"}
              </span>
            </div>

            <p className="mt-5 min-h-10 text-sm leading-6 text-zinc-600">
              {repository.description || "No description provided."}
            </p>

            <div className="mt-6 flex flex-wrap gap-4 border-t border-zinc-100 pt-4 text-xs text-zinc-500">
              <span>
                Branch:{" "}
                <strong className="text-zinc-700">
                  {repository.default_branch}
                </strong>
              </span>

              <span>
                Issues:{" "}
                <strong className="text-zinc-700">
                  {repository.open_issues_count}
                </strong>
              </span>

              <span>
                Stars:{" "}
                <strong className="text-zinc-700">
                  {repository.stargazers_count}
                </strong>
              </span>

              <span>
                Forks:{" "}
                <strong className="text-zinc-700">
                  {repository.forks_count}
                </strong>
              </span>
            </div>
          </Link>
        ))}
      </div>
    )}
  </main>
</div>

);
}