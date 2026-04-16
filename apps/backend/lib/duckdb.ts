import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DuckDBInstance } from "@duckdb/node-api";

import type { DuckDBConnection } from "@duckdb/node-api";

let instance: DuckDBInstance | null = null;
let connection: DuckDBConnection | null = null;

/**
 * Opens (or creates) a DuckDB file and returns a ready connection.
 */
export async function initConnection(dbPath: string): Promise<DuckDBConnection> {
  mkdirSync(dirname(dbPath), { recursive: true });

  instance = await DuckDBInstance.create(dbPath);
  connection = await instance.connect();
  return connection;
}

/**
 * Returns the current connection. Throws if `initConnection` hasn't been called.
 */
export function getConnection(): DuckDBConnection {
  if (!connection) {
    throw new Error("DuckDB connection not initialized — call initConnection first");
  }
  return connection;
}

/**
 * Gracefully closes the connection and releases the instance.
 */
export async function closeConnection(): Promise<void> {
  if (connection) {
    connection.close();
    connection = null;
  }
  instance = null;
}
