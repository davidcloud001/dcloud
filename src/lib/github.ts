import "server-only";

import { Octokit } from "octokit";

const token = process.env.GITHUB_TOKEN;
const owner = process.env.GITHUB_OWNER;

if (!token) {
  throw new Error("Missing GITHUB_TOKEN environment variable");
}

if (!owner) {
  throw new Error("Missing GITHUB_OWNER environment variable");
}

const githubToken: string = token;
const githubOwner: string = owner;

const octokit = new Octokit({
  auth: githubToken,
});

/**
 * Retrieve all repositories accessible to the configured GitHub owner.
 */
export async function getRepositories() {
  return octokit.paginate(octokit.rest.repos.listForUser, {
    username: githubOwner,
    per_page: 100,
    type: "all",
    sort: "updated",
  });
}

/**
 * Retrieve metadata for a specific repository.
 */
export async function getRepository(repo: string) {
  return octokit.rest.repos.get({
    owner: githubOwner,
    repo,
  });
}

/**
 * Retrieve all branches for a specific repository.
 */
export async function getBranches(repo: string) {
  return octokit.paginate(octokit.rest.repos.listBranches, {
    owner: githubOwner,
    repo,
    per_page: 100,
  });
}

/**
 * Retrieve actual issues for a specific repository.
 *
 * GitHub's issues endpoint can also return pull requests because
 * pull requests are represented as issue-like objects by GitHub.
 * Filter out those pull-request items so this function returns
 * actual issues only.
 */
export async function getIssues(repo: string) {
  const items = await octokit.paginate(octokit.rest.issues.listForRepo, {
    owner: githubOwner,
    repo,
    state: "all",
    per_page: 100,
  });

  return items.filter((issue) => !issue.pull_request);
}

/**
 * Retrieve all pull requests for a specific repository.
 */
export async function getPullRequests(repo: string) {
  return octokit.paginate(octokit.rest.pulls.list, {
    owner: githubOwner,
    repo,
    state: "all",
    per_page: 100,
  });
}

/**
 * Retrieve all GitHub Actions workflow runs for a specific repository.
 */
export async function getWorkflowRuns(repo: string) {
  return octokit.paginate(
    octokit.rest.actions.listWorkflowRunsForRepo,
    {
      owner: githubOwner,
      repo,
      per_page: 100,
    },
  );
}

/**
 * Retrieve the contents of a specific file from a GitHub repository.
 *
 * An optional ref can be provided to read the file from a specific
 * branch, tag, or commit.
 */
export async function getRepositoryFile(
  repo: string,
  path: string,
  ref?: string,
) {
  const response = await octokit.rest.repos.getContent({
    owner: githubOwner,
    repo,
    path,
    ...(ref ? { ref } : {}),
  });

  if (Array.isArray(response.data)) {
    throw new Error(
      "The requested path is a directory, not a file.",
    );
  }

  if (response.data.type !== "file") {
    throw new Error(
      "The requested path is not a regular file.",
    );
  }

  if (!response.data.content) {
    throw new Error(
      "GitHub did not return file content.",
    );
  }

  const content = Buffer.from(
    response.data.content,
    "base64",
  ).toString("utf-8");

  return {
    name: response.data.name,
    path: response.data.path,
    sha: response.data.sha,
    size: response.data.size,
    url: response.data.html_url,
    content,
  };
}