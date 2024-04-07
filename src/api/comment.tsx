import { Comment } from "@/types/comment";
import { createGitHubClient } from "../utils/githubClient";

/**
 * Transforms the API response to a structured Comment object.
 *
 * @param apiResponse - The raw comment data from the GitHub API response.
 * @returns The transformed comment object.
 */
function transformApiResponseToComment(apiResponse: any): Comment {
  return {
    id: apiResponse.id,
    body: apiResponse.body,
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
 * @param per_page - The number of issues to fetch per page (default is 100).
 * @returns A promise that resolves to an array of Issue objects.
 */
export const fetchComments = async (
  token: string,
  issue_number: number,
  page: number = 1,
  per_page: number = 100
): Promise<Comment[]> => {
  const { octokit, owner, repo } = createGitHubClient(token);

  const response = await octokit.request(`GET /repos/${owner}/${repo}/issues/${issue_number}/comments`, {
    owner,
    repo,
    issue_number,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
  console.log('fetchComments')
  console.log(response.data)
  // Transform each comment in the response
  return response.data.map((comment: any) => transformApiResponseToComment(comment));
};