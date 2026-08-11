import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL");
});

pool.on("error", (err) => {
  console.log("Unexpected Database Error", err);
});

export default pool;
