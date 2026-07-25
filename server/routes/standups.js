import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  createStandup,
  getTodayStandup,
  getTeamStandups,
} from "../controllers/standupController.js";

const router = express.Router();

router.post("/", requireAuth, createStandup);
router.get("/today", requireAuth, getTodayStandup);
router.get("/team/:team_id", requireAuth, getTeamStandups);

export default router;
