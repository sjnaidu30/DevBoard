import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db/index.js";
import session from "express-session";
import passport from "./config/passport.js";
import connectPgSimple from "connect-pg-simple";
import authRouter from "./routes/auth.js";
import standupRouter from "./routes/standups.js";
import commitsRouter from "./routes/commits.js";
import { startDigestJob } from "./jobs/digestJob.js";
import rateLimit from "express-rate-limit";

dotenv.config({ path: "../.env" });

const PgSession = connectPgSimple(session);
const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiters
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Core middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
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
      sameSite: "lax",
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

// Apply rate limiters before routes
app.use("/api", limiter);
app.use("/auth", authLimiter);

// Routes
app.use("/auth", authRouter);
app.use("/api/standups", standupRouter);
app.use("/api/commits", commitsRouter);

// Base routes
app.get("/", (req, res) => {
  res.send("DevBoard API is running");
});

startDigestJob();
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
