"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = runMigrations;
const db_1 = require("./db");
async function runMigrations() {
    await db_1.db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name        TEXT NOT NULL,
      email       TEXT UNIQUE NOT NULL,
      cpf         TEXT UNIQUE NOT NULL,
      birth_date  DATE,
      phone_number TEXT,
      avatar_url  TEXT,
      role        TEXT NOT NULL DEFAULT 'user',
      password    TEXT NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS complaints (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title       TEXT NOT NULL,
      description TEXT NOT NULL,
      category    TEXT NOT NULL,
      priority    INT NOT NULL DEFAULT 0,
      visibility  TEXT NOT NULL DEFAULT 'public',
      status      TEXT NOT NULL DEFAULT 'pending',
      lat         DOUBLE PRECISION NOT NULL,
      lng         DOUBLE PRECISION NOT NULL,
      address     TEXT,
      created_by  UUID NOT NULL REFERENCES users(id),
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      resolved_at TIMESTAMPTZ
    );

    CREATE TABLE IF NOT EXISTS complaint_media (
      id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
      type         TEXT NOT NULL,
      url          TEXT NOT NULL,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS complaint_votes (
      user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (user_id, complaint_id)
    );

    CREATE TABLE IF NOT EXISTS complaint_comments (
      id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
      user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content      TEXT NOT NULL,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS petitions (
      id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title               TEXT NOT NULL,
      description         TEXT NOT NULL,
      category            TEXT NOT NULL,
      goal                INT NOT NULL,
      signatures_count    INT NOT NULL DEFAULT 0,
      scope               TEXT NOT NULL,
      city_ibge_code      TEXT,
      visibility          TEXT NOT NULL DEFAULT 'public',
      status              TEXT NOT NULL DEFAULT 'active',
      latitude            DOUBLE PRECISION NOT NULL,
      longitude           DOUBLE PRECISION NOT NULL,
      address             TEXT NOT NULL,
      neighborhood        TEXT NOT NULL,
      formal_document_url TEXT,
      created_by          UUID NOT NULL,
      created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      expires_at          TIMESTAMPTZ
    );

    CREATE TABLE IF NOT EXISTS petition_signatures (
      id                         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      petition_id                UUID NOT NULL REFERENCES petitions(id) ON DELETE CASCADE,
      user_id                    UUID NOT NULL,
      voter_registration_number  TEXT,
      full_name                  TEXT NOT NULL,
      cpf_hash                   TEXT NOT NULL,
      ip_address                 TEXT NOT NULL,
      user_agent                 TEXT NOT NULL,
      created_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (petition_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS petition_comments (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      petition_id UUID NOT NULL REFERENCES petitions(id) ON DELETE CASCADE,
      user_id     UUID NOT NULL,
      content     TEXT NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
    console.log("[DB] Migrations applied successfully.");
}
