import axios from "axios";
import pool from "../db/index.js";

export const fetchYesterdayCommits = async (userId) => {
  try {
    const userResult = await pool.query(
      "SELECT github_access_token, username FROM users WHERE id = $1",
      [userId],
    );

    if (userResult.rows.length === 0) {
      throw new Error("User not found");
    }

    const { github_access_token, username } = userResult.rows[0];

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const response = await axios.get(
      `https://api.github.com/users/${encodeURIComponent(username)}/events`,
      {
        headers: {
          Authorization: `Bearer ${github_access_token}`,
          Accept: "application/vnd.github.v3+json",
        },
      },
    );

    const commits = [];

    for (const event of response.data) {
      if (event.type !== "PushEvent") continue;

      const eventDate = new Date(event.created_at);
      if (eventDate < yesterday || eventDate >= today) continue;

      if (!event.payload.commits || event.payload.commits.length === 0) continue;

      for (const commit of event.payload.commits) {
        commits.push({
          sha: commit.sha,
          message: commit.message,
          repo: event.repo.name,
          commit_url: `https://github.com/${event.repo.name}/commit/${commit.sha}`,
          committed_at: event.created_at,
        });
      }
    }

    return commits;
  } catch (err) {
    throw new Error(`GitHub API error: ${err.message}`);
  }
};