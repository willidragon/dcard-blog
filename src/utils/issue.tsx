import { Issue } from "@/types/Issue";
import { createGitHubClient } from "./githubClient";

// export async function fetchGitHubIssues(token: string) {
//   const octokit = new Octokit({ auth: token });
//   const owner = process.env.GITHUB_OWNER;
//   const repo = process.env.GITHUB_REPO;
//   // const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
//   //   method: 'GET',
//   //   headers: {
//   //     'Accept': 'application/vnd.github+json',
//   //     'Authorization': `Bearer ${token}`,
//   //     'X-GitHub-Api-Version': '2022-11-28'
//   //   }
//   // });
//   const response = await octokit.request(`GET /repos/${owner}/${repo}/issues`, {
//     owner,
//     repo,
//     state: "open",
//     headers: {
//       'X-GitHub-Api-Version': '2022-11-28'
//     }
//   });
//   // console.log(`response: ${response}`)
//   // console.log('123~~')
//   // if (!response.ok) {
//   //   throw new Error(`Error fetching issues: ${response.statusText}`);
//   // }

//   // const issues: GitHubIssueList = await response.json();
//   if (response.data) {
//     console.log(response.data);
//     return response.data;
//   } else {
//     throw new Error('Network response was not ok.');
//     return [];
//   }
  
//   // const octokit = new Octokit({ auth: accessToken });

//   // const owner = process.env.GITHUB_OWNER!;
//   // const repo = process.env.GITHUB_REPO!;

//   // const response = await octokit.request(`GET /repos/${owner}/${repo}/issues`, {
//   //   owner,
//   //   repo,
//   //   state: "open",
//   //   headers: {
//   //     'X-GitHub-Api-Version': '2022-11-28'
//   //   }
//   // });
//   // console.log(response)
//   // return response.data.map((issue: any) => {
//   //   const { number, title, body, comments, labels, created_at, user } = issue;
//   //   let short_body = body
//   //     .split(" ")
//   //     .filter((word: string) => word !== "")
//   //     .slice(0, 16)
//   //     .join(" ");
//   //   if (body.length > short_body.length) {
//   //     short_body += "...";
//   //   }
//   //   const createdAt = new Date(created_at).toLocaleString();
//   //   return {
//   //     number,
//   //     title,
//   //     body: short_body,
//   //     comments,
//   //     labels,
//   //     createdAt,
//   //     user: {
//   //       id: user.id,
//   //       username: user.login,
//   //       avatar_url: user.avatar_url,
//   //     },
//   //   };
//   // });
// }

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
  const response = await octokit.request(`GET /repos/${owner}/${repo}/issues`, {
    owner,
    repo,
    per_page,
    page,
    state: "open",
  });

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