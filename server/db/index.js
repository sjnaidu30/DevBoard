import pg from "pg";
import dotenv from "dotenv";
console.log("Current directory:", process.cwd());
dotenv.config({ path: "../.env" });
console.log("DATABASE_URL:", process.env.DATABASE_URL);

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
