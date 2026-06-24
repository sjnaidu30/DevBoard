import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db/index.js";
import session from "express-session";
import passport from "./config/passport.js";
import connectPgSimple from "connect-pg-simple";
import authRouter from "./routes/auth.js";

dotenv.config({ path: "../.env" });
const PgSession = connectPgSimple(session);
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(
  session({
    store: new PgSession({
      pool: pool,
      tableName: "session",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("DevBoard API is running");
});
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
