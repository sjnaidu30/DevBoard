import express, { response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db/index.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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
