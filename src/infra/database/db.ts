import { Pool } from "pg";
import "dotenv/config";

// Strip ?sslmode from the URL to let the ssl option below take full effect.
// pg-connection-string otherwise overrides rejectUnauthorized with its own SSL mode.
const rawUrl = (process.env.DATABASE_URL || "").replace(/[?&]sslmode=[^&]*/g, "");

export const db = new Pool({
  connectionString: rawUrl,
  ssl: { rejectUnauthorized: false },
});



