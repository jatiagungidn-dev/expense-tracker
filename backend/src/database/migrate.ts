import fs from "fs";
import path from "path";
import pool from "../config/db";

async function runMigration() {
  const client = await pool.connect();

  try {
    console.log("Starting migrations...");

    const migrationDir = path.join(__dirname, "migrations");

    const files = fs
      .readdirSync(migrationDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    if (files.length === 0) {
      console.log("No migrations found");
      return;
    }

    await client.query("BEGIN");

    for (const file of files) {
      const filePath = path.join(migrationDir, file);
      const sql = fs.readFileSync(filePath, "utf-8");

      console.log(`Executing migration: ${file}`);
      await client.query(sql);
    }

    await client.query("COMMIT");
    console.log("Migrations successfully");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
  } finally {
    client.release();
    process.exit(0);
  }
}

runMigration();
