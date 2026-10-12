import app from "./app.js";
import { env } from "./config/env.js";
import pool from "./config/db.js";

async function startServer() {
  try {
    await pool.query("SELECT 1");
    console.log("Database connected");

    app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect database:", err);
    process.exit(1);
  }
}

startServer();
