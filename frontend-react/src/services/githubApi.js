const GITHUB_API_URL = "https://api.github.com";

export async function getGithubRepositories(username) {
  if (!username || username.trim() === "") {
    throw new Error("GitHub username is required.");
  }

  const response = await fetch(
    `${GITHUB_API_URL}/users/${encodeURIComponent(
      username.trim()
    )}/repos?sort=updated&per_page=10`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("GitHub user not found.");
    }

    if (response.status === 403) {
      throw new Error("GitHub API rate limit reached.");
    }

    throw new Error("Unable to fetch GitHub repositories.");
  }

  return response.json();
}
