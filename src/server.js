import "dotenv/config";

import app from "./app.js";
import pool from "./config/db.js";
import config from "./config/env.js";

const PORT = config.PORT;

async function startServer() {
  try {
    await pool.query("SELECT NOW()");
    console.log("✅ Database connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed");
    console.error(error.message);
    process.exit(1);
  }
}

startServer();