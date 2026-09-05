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