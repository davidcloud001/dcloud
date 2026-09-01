"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
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
watchers_count: number;
html_url: string;
updated_at: string;
};

type Branch = {
name: string;
protected: boolean;
};

type Issue = {
id: number;
number: number;
title: string;
state: string;
html_url: string;
};

type PullRequest = {
id: number;
number: number;
title: string;
state: string;
html_url: string;
};

type WorkflowRun = {
id: number;
name: string | null;
status: string;
conclusion: string | null;
html_url: string;
};

export default function RepositoryPage() {
const params = useParams();
const repo = params.repo as string;

const [repository, setRepository] = useState<Repository | null>(null);
const [branches, setBranches] = useState<Branch[]>([]);
const [issues, setIssues] = useState<Issue[]>([]);
const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
const [workflowRuns, setWorkflowRuns] = useState<WorkflowRun[]>([]);

const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);

useEffect(() => {
if (!repo) return;

async function loadRepository() {
  try {
    const [
      repositoryResponse,
      branchesResponse,
      issuesResponse,
      pullRequestsResponse,
      workflowRunsResponse,
    ] = await Promise.all([
      fetch(`/api/github/repositories/${repo}`),
      fetch(`/api/github/branches?repo=${encodeURIComponent(repo)}`),
      fetch(`/api/github/issues?repo=${encodeURIComponent(repo)}`),
      fetch(
        `/api/github/pull-requests?repo=${encodeURIComponent(repo)}`
      ),
      fetch(
        `/api/github/workflow-runs?repo=${encodeURIComponent(repo)}`
      ),
    ]);

    if (
      !repositoryResponse.ok ||
      !branchesResponse.ok ||
      !issuesResponse.ok ||
      !pullRequestsResponse.ok ||
      !workflowRunsResponse.ok
    ) {
      throw new Error("Failed to load repository data");
    }

    const repositoryData = await repositoryResponse.json();
    const branchesData = await branchesResponse.json();
    const issuesData = await issuesResponse.json();
    const pullRequestsData = await pullRequestsResponse.json();
    const workflowRunsData = await workflowRunsResponse.json();

    setRepository(repositoryData);
    setBranches(
      Array.isArray(branchesData) ? branchesData : []
    );
    setIssues(
      Array.isArray(issuesData) ? issuesData : []
    );
    setPullRequests(
      Array.isArray(pullRequestsData)
        ? pullRequestsData
        : []
    );
    setWorkflowRuns(
      Array.isArray(workflowRunsData)
        ? workflowRunsData
        : []
    );
  } catch (error) {
    console.error("Failed to load repository:", error);
    setError(true);
  } finally {
    setLoading(false);
  }
}

loadRepository();

}, [repo]);

if (loading) {
return (
<main className="min-h-screen bg-zinc-50 p-6">
<div className="mx-auto max-w-5xl rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
<p className="text-sm text-zinc-500">
Loading repository...
</p>
</div>
</main>
);
}

if (error || !repository) {
return (
<main className="min-h-screen bg-zinc-50 p-6">
<div className="mx-auto max-w-5xl">
<Link
href="/repositories"
className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
>
← Back to Repositories
</Link>

      <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-700">
          Failed to load this repository.
        </p>
      </div>
    </div>
  </main>
);

}

const openIssues = issues.filter(
(issue) => issue.state === "open"
);

const openPullRequests = pullRequests.filter(
(pullRequest) => pullRequest.state === "open"
);

return (
<main className="min-h-screen bg-zinc-50 text-zinc-900">
<header className="border-b border-zinc-200 bg-white">
<div className="mx-auto max-w-5xl px-6 py-6">
<Link
href="/repositories"
className="text-sm font-medium text-zinc-500 hover:text-zinc-900"
>
← Back to Repositories
</Link>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">
            {repository.name}
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            {repository.full_name}
          </p>
        </div>

        <a
          href={repository.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          View on GitHub
        </a>
      </div>
    </div>
  </header>

  <div className="mx-auto max-w-5xl px-6 py-8">
    <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <p className="text-zinc-600">
        {repository.description ||
          "No description provided."}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-zinc-50 p-4">
          <p className="text-xs font-medium text-zinc-500">
            Default branch
          </p>

          <p className="mt-1 font-semibold">
            {repository.default_branch}
          </p>
        </div>

        <div className="rounded-lg bg-zinc-50 p-4">
          <p className="text-xs font-medium text-zinc-500">
            Open issues
          </p>

          <p className="mt-1 font-semibold">
            {openIssues.length}
          </p>
        </div>

        <div className="rounded-lg bg-zinc-50 p-4">
          <p className="text-xs font-medium text-zinc-500">
            Stars
          </p>

          <p className="mt-1 font-semibold">
            {repository.stargazers_count}
          </p>
        </div>

        <div className="rounded-lg bg-zinc-50 p-4">
          <p className="text-xs font-medium text-zinc-500">
            Forks
          </p>

          <p className="mt-1 font-semibold">
            {repository.forks_count}
          </p>
        </div>
      </div>
    </section>

    <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        Branches
      </h2>

      <p className="mt-1 text-sm text-zinc-500">
        Branches available in this repository.
      </p>

      <div className="mt-5 divide-y divide-zinc-100">
        {branches.length === 0 ? (
          <p className="py-4 text-sm text-zinc-500">
            No branches found.
          </p>
        ) : (
          branches.map((branch) => (
            <div
              key={branch.name}
              className="flex items-center justify-between py-4"
            >
              <div>
                <p className="font-medium">
                  {branch.name}
                </p>

                {branch.name ===
                  repository.default_branch && (
                  <p className="mt-1 text-xs text-zinc-500">
                    Default branch
                  </p>
                )}
              </div>

              {branch.protected && (
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                  Protected
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </section>

    <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">
            Issues
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Issues belonging to this repository.
          </p>
        </div>

        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
          {openIssues.length} open
        </span>
      </div>

      <div className="mt-5 divide-y divide-zinc-100">
        {issues.length === 0 ? (
          <p className="py-4 text-sm text-zinc-500">
            No issues found.
          </p>
        ) : (
          issues.map((issue) => (
            <a
              key={issue.id}
              href={issue.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-4 hover:bg-zinc-50"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium hover:underline">
                    #{issue.number} {issue.title}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    {issue.state}
                  </p>
                </div>
              </div>
            </a>
          ))
        )}
      </div>
    </section>

    <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">
            Pull Requests
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Pull requests belonging to this repository.
          </p>
        </div>

        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
          {openPullRequests.length} open
        </span>
      </div>

      <div className="mt-5 divide-y divide-zinc-100">
        {pullRequests.length === 0 ? (
          <p className="py-4 text-sm text-zinc-500">
            No pull requests found.
          </p>
        ) : (
          pullRequests.map((pullRequest) => (
            <a
              key={pullRequest.id}
              href={pullRequest.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-4 hover:bg-zinc-50"
            >
              <p className="font-medium hover:underline">
                #{pullRequest.number}{" "}
                {pullRequest.title}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                {pullRequest.state}
              </p>
            </a>
          ))
        )}
      </div>
    </section>

    <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold">
          Actions
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          GitHub Actions workflow runs for this repository.
        </p>
      </div>

      <div className="mt-5 divide-y divide-zinc-100">
        {workflowRuns.length === 0 ? (
          <p className="py-4 text-sm text-zinc-500">
            No workflow runs found.
          </p>
        ) : (
          workflowRuns.map((workflowRun) => (
            <a
              key={workflowRun.id}
              href={workflowRun.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-4 hover:bg-zinc-50"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium hover:underline">
                    {workflowRun.name ||
                      "Unnamed workflow"}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Status: {workflowRun.status}
                  </p>
                </div>

                <span className="text-xs font-medium text-zinc-500">
                  {workflowRun.conclusion ||
                    "in progress"}
                </span>
              </div>
            </a>
          ))
        )}
      </div>
    </section>
  </div>
</main>

);
}