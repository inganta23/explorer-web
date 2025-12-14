import { sql } from "drizzle-orm";
import { db } from "./index";

async function setup() {
  console.log("⚙️  Ensuring Database Extensions are enabled...");

  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
  await db.execute(sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

  console.log("Database extensions configured.");
  process.exit(0);
}

setup().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});
