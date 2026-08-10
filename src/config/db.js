import pg from "pg";
import config from "./env.js";

const { Pool } = pg;

const pool = new Pool({
  connectionString: config.DATABASE_URL,
});

export default pool;