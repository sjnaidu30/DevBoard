import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { fetchYesterdayCommits } from "../services/githubService.js";

const router = express.Router();

router.get("/yesterday", requireAuth, async (req, res) => {
  try {
    const commits = await fetchYesterdayCommits(req.user.id);
    res.json({ commits });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
