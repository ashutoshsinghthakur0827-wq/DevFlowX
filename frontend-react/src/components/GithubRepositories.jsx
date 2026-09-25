import { useState } from "react";
import { getGithubRepositories } from "../services/githubApi";

function GithubRepositories() {
  const [username, setUsername] = useState("");
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(event) {
    event.preventDefault();

    setError("");
    setRepositories([]);

    if (!username.trim()) {
      setError("Please enter a GitHub username.");
      return;
    }

    try {
      setLoading(true);

      const data = await getGithubRepositories(username);

      setRepositories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="analytics-card github-card">
      <h2>GitHub Repositories</h2>

      <p>Search public repositories using a GitHub username.</p>

      <form className="github-search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <div className="github-repository-list">
        {repositories.map((repository) => (
          <div className="github-repository-item" key={repository.id}>
            <div>
              <h3>{repository.name}</h3>

              <p>
                {repository.description || "No description available."}
              </p>

              <span>
                Language: {repository.language || "Not specified"}
              </span>

              <span> ⭐ {repository.stargazers_count} stars</span>
            </div>

            <a
              href={repository.html_url}
              target="_blank"
              rel="noreferrer"
            >
              View
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default GithubRepositories;