import fs from "node:fs/promises";
import path from "node:path";
import pool from "../config/db.js";

const MIGRATIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS migrations (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL UNIQUE,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT now()
  );
`;

async function migrate() {
  const migrationsDir = path.join(
    process.cwd(),
    "src",
    "database",
    "migrations",
  );

  try {
    await pool.query(MIGRATIONS_TABLE);

    const files = (await fs.readdir(migrationsDir))
      .filter((file) => file.endsWith(".sql"))
      .sort();

    if (files.length === 0) {
      console.log("No migrations found.");
      return;
    }

    for (const filename of files) {
      const executed = await pool.query(
        "SELECT 1 FROM migrations WHERE filename = $1",
        [filename],
      );

      if (executed.rowCount && executed.rowCount > 0) {
        console.log(`Skipped: ${filename}`);
        continue;
      }

      const sql = await fs.readFile(path.join(migrationsDir, filename), "utf8");

      const client = await pool.connect();

      try {
        await client.query("BEGIN");
        await client.query(sql);
        await client.query("INSERT INTO migrations (filename) VALUES ($1)", [
          filename,
        ]);
        await client.query("COMMIT");

        console.log(`Applied: ${filename}`);
      } catch (error) {
        await client.query("ROLLBACK");
        console.error(`Failed to apply migration: ${filename}`);
        console.error(error);
        process.exitCode = 1;
        break;
      } finally {
        client.release();
      }
    }
  } catch (error) {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

migrate();
