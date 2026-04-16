import type { DuckDBConnection } from "@duckdb/node-api";

/**
 * Creates all application tables if they don't already exist.
 * Mirrors the Lucid/PostgreSQL migrations but uses DuckDB-compatible SQL.
 */
export async function initializeSchema(db: DuckDBConnection): Promise<void> {
  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id            UUID    NOT NULL PRIMARY KEY,
      first_name    VARCHAR,
      last_name     VARCHAR,
      email         VARCHAR(254) NOT NULL UNIQUE,
      address       JSON,
      password      VARCHAR NOT NULL,
      role          VARCHAR NOT NULL DEFAULT 'USER',
      email_verified_at TIMESTAMP,
      created_at    TIMESTAMP NOT NULL DEFAULT current_timestamp,
      updated_at    TIMESTAMP DEFAULT current_timestamp
    )
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS reset_password_tokens (
      id         UUID      NOT NULL PRIMARY KEY,
      user_id    UUID      REFERENCES users(id),
      token      VARCHAR(255) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT current_timestamp,
      updated_at TIMESTAMP DEFAULT current_timestamp
    )
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS email_verification_tokens (
      id         UUID      NOT NULL PRIMARY KEY,
      user_id    UUID      REFERENCES users(id),
      token      VARCHAR(255) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT current_timestamp,
      updated_at TIMESTAMP DEFAULT current_timestamp
    )
  `);
}
