import pool from "../db/index.js";

export const createStandup = async (req, res) => {
  try {
    const { yesterday, today, blockers, team_id } = req.body;
    const user_id = req.user.id;
    const standup_date = new Date().toISOString().split("T")[0];

    if (!yesterday || !today || !team_id) {
      return res.status(400).json({
        error: "yesterday, today and team_id are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO standups 
             (user_id, team_id, yesterday, today, blockers, standup_date)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
      [user_id, team_id, yesterday, today, blockers || null, standup_date],
    );

    res.status(201).json({
      message: "Standup submitted successfully",
      standup: result.rows[0],
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({
        error: "You already submitted a standup today",
      });
    }
    res.status(500).json({ error: err.message });
  }
};

export const getTodayStandup = async (req, res) => {
  try {
    const user_id = req.user.id;
    const standup_date = new Date().toISOString().split("T")[0];

    const result = await pool.query(
      `SELECT * FROM standups 
             WHERE user_id = $1 AND standup_date = $2`,
      [user_id, standup_date],
    );

    if (result.rows.length === 0) {
      return res.json({ submitted: false, standup: null });
    }

    res.json({ submitted: true, standup: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTeamStandups = async (req, res) => {
  try {
    const { team_id } = req.params;
    const standup_date = new Date().toISOString().split("T")[0];

    const result = await pool.query(
      `SELECT s.*, u.name, u.avatar_url 
             FROM standups s
             JOIN users u ON s.user_id = u.id
             WHERE s.team_id = $1 AND s.standup_date = $2
             ORDER BY u.name ASC`,
      [team_id, standup_date],
    );

    res.json({
      date: standup_date,
      standups: result.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
