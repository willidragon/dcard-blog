import { Octokit } from "@octokit/rest";

type GitHubClient = {
  octokit: Octokit;
  owner: string;
  repo: string;
};

/**
 * Creates a GitHub client configured for accessing a specific repository.
 *
 * @param token - The GitHub personal access token (PAT) used for authentication.
 *                This token should have the necessary scopes for the operations you intend to perform.
 * @returns An object containing the configured Octokit instance and the owner and repo names.
 *          This object can be used to perform API requests to GitHub.
 */
export const createGitHubClient = (token: string): GitHubClient => {
  const octokit = new Octokit({ auth: token });
  const owner = process.env.GITHUB_OWNER!;
  const repo = process.env.GITHUB_REPO!;
  
  return { octokit, owner, repo };
};
