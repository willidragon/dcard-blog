import { Issue } from "@/types/Issue";
import { createGitHubClient } from "../utils/githubClient";

/**
 * Transforms the API response to a structured Issue object.
 *
 * @param apiResponse - The raw issue data from the GitHub API response.
 * @returns The transformed issue object.
 */
function transformApiResponseToIssue(apiResponse: any): Issue {
  return {
    id: apiResponse.id,
    number: apiResponse.number,
    title: apiResponse.title,
    body: apiResponse.body,
    labels: apiResponse.labels.map((label: any) => ({
      id: label.id,
      name: label.name,
      description: label.description || "", // Providing a fallback for optional fields
      color: label.color,
    })),
    state: apiResponse.state,
    user: {
      id: apiResponse.user.id,
      name: apiResponse.user.login, // 'login' is mapped to 'name' for consistency
      avatar_url: apiResponse.user.avatar_url,
      home_url: apiResponse.user.html_url,
    },
    reactions: apiResponse.reactions, // Direct mapping assumed to be correct
    created_at: new Date(apiResponse.created_at),
    updated_at: new Date(apiResponse.updated_at),
    url: apiResponse.html_url, // Mapping 'html_url' to 'url'
  };
}

/**
 * Fetches a list of issues for a specific repository.
 *
 * @param token - The GitHub API token for authentication.
 * @param page - The page number of issues to fetch (default is 1).
 * @param per_page - The number of issues to fetch per page (default is 10).
 * @returns A promise that resolves to an array of Issue objects.
 */
export const fetchIssues = async (
  token: string,
  page: number = 1,
  per_page: number = 10
): Promise<Issue[]> => {
  const { octokit, owner, repo } = createGitHubClient(token);
  const nocache = new Date().getTime();

  const response = await octokit.request(`GET /repos/${owner}/${repo}/issues`, {
    owner,
    repo,
    per_page,
    page,
    state: "open",
    nocache // avoid cache
  });

  console.log('fetchIssues')
  console.log(response.data)
  // Transform each issue in the response
  return response.data.map((issue: any) => transformApiResponseToIssue(issue));
};

/**
 * Fetches details of a single issue by its number.
 *
 * @param token - The GitHub API token for authentication.
 * @param issue_number - The number of the issue to fetch.
 * @returns A promise that resolves to a single Issue object.
 */
export const fetchIssue = async (token: string, issue_number: number): Promise<Issue> => {
  const { octokit, owner, repo } = createGitHubClient(token);
  const response = await octokit.request(`GET /repos/${owner}/${repo}/issues/${issue_number}`, {
    owner,
    repo,
    issue_number,
  });
  
  return transformApiResponseToIssue(response.data);
};

/**
 * Creates a new issue in a repository.
 *
 * @param token - The GitHub API token for authentication.
 * @param title - The title of the new issue.
 * @param body - The body content of the new issue.
 * @returns A promise that resolves to the status and message of the operation.
 */
export const createIssue = async (
  token: string,
  title: string,
  body: string
): Promise<{ status: string; message: string; }> => {
  const { octokit, owner, repo } = createGitHubClient(token);

  try {
    const response = await octokit.request(`POST /repos/${owner}/${repo}/issues`, {
      owner,
      repo,
      title,
      body,
    });

    if (response.status !== 201) throw new Error("Failed to create issue!");

    return { status: "success", message: "Issue created successfully." };
  } catch (e: any) {
    console.error(e);
    return { status: "error", message: e.message };
  }
};

/**
 * Closes an existing issue by its number.
 *
 * @param token - The GitHub API token for authentication.
 * @param issue_number - The number of the issue to close.
 * @returns A promise that resolves to the status and message of the operation.
 */
export const closeIssue = async (
  token: string,
  issue_number: number
): Promise<{ status: string; message: string; }> => {
  const { octokit, owner, repo } = createGitHubClient(token);

  try {
    const response = await octokit.request(`PATCH /repos/${owner}/${repo}/issues/${issue_number}`, {
      owner,
      repo,
      state: "closed",
    });

    if (response.status !== 200) throw new Error("Failed to close issue!");

    return { status: "success", message: "Issue closed successfully." };
  } catch (e: any) {
    console.error(e);
    return { status: "error", message: e.message };
  }
};

/**
 * Updates an existing issue's title and body.
 *
 * @param token - The GitHub API token for authentication.
 * @param issue_number - The number of the issue to update.
 * @param title - The new title for the issue.
 * @param body - The new body content for the issue.
 * @returns A promise that resolves to the status and message of the operation.
 */
export const updateIssue = async (
  token: string,
  issue_number: number,
  title: string,
  body: string
): Promise<{ status: string; message: string; }> => {
  const { octokit, owner, repo } = createGitHubClient(token);

  try {
    const response = await octokit.request(`PATCH /repos/${owner}/${repo}/issues/${issue_number}`, {
      owner,
      repo,
      title,
      body,
    });

    if (response.status !== 200) throw new Error("Failed to update issue!");

    return { status: "success", message: "Issue updated successfully." };
  } catch (e: any) {
    console.error(e);
    return { status: "error", message: e.message };
  }
};