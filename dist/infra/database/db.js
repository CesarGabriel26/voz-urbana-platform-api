"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_1 = require("pg");
require("dotenv/config");
// Strip ?sslmode from the URL to let the ssl option below take full effect.
// pg-connection-string otherwise overrides rejectUnauthorized with its own SSL mode.
const rawUrl = (process.env.DATABASE_URL || "").replace(/[?&]sslmode=[^&]*/g, "");
exports.db = new pg_1.Pool({
    connectionString: rawUrl,
    ssl: { rejectUnauthorized: false },
});
