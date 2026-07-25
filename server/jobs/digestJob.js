import cron from "node-cron";
import pool from "../db/index.js";
import { sendDigestEmail } from "../services/emailService.js";

export const startDigestJob = () => {
  cron.schedule("0 9 * * *", async () => {
    console.log("Running daily digest job...");

    try {
      const today = new Date().toISOString().split("T")[0];

      const teamsResult = await pool.query(
        `SELECT t.id, t.name, u.email as manager_email 
                 FROM teams t
                 JOIN users u ON t.manager_id = u.id
                 WHERE t.is_active = true`,
      );

      for (const team of teamsResult.rows) {
        const standupsResult = await pool.query(
          `SELECT s.*, u.name, u.avatar_url
                     FROM standups s
                     JOIN users u ON s.user_id = u.id
                     WHERE s.team_id = $1 
                     AND s.standup_date = $2
                     AND s.is_active = true
                     ORDER BY u.name ASC`,
          [team.id, today],
        );

        if (standupsResult.rows.length === 0) {
          console.log(`No standups for team ${team.name} today, skipping`);
          continue;
        }

        await sendDigestEmail(
          team.manager_email,
          team.name,
          standupsResult.rows,
          today,
        );

        console.log(
          `Digest sent for team ${team.name} to ${team.manager_email}`,
        );
      }
    } catch (err) {
      console.error("Digest job error:", err.message);
    }
  });

  console.log("Digest job scheduled for 9 AM daily");
};
