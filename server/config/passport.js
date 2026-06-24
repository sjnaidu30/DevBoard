import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv";
import pool from "../db/index.js";

dotenv.config({ path: "../.env" });

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await pool.query(
          "SELECT * FROM users WHERE github_id = $1",
          [profile.id],
        );

        if (existingUser.rows.length > 0) {
          return done(null, existingUser.rows[0]);
        }

        const newUser = await pool.query(
          `INSERT INTO users (github_id, github_access_token, name, email, avatar_url)
                     VALUES ($1, $2, $3, $4, $5)
                     RETURNING *`,
          [
            profile.id,
            accessToken,
            profile.displayName || profile.username,
            profile.emails?.[0]?.value || null,
            profile.photos?.[0]?.value || null,
          ],
        );

        return done(null, newUser.rows[0]);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
