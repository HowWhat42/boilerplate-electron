import { homedir } from "node:os";
import { join } from "node:path";
import { Ignitor, prettyPrintError } from "@adonisjs/core";
import "reflect-metadata";

import { printStartupBanner } from "./lib/banner.ts";
import { closeConnection, initConnection } from "./lib/duckdb.ts";
import { initializeSchema } from "./lib/schema.ts";

interface DevToolsOptions {
  port?: number;
  host?: string;
  dbPath?: string;
}

const APP_ROOT = new URL("./", import.meta.url);

const IMPORTER = (filePath: string) => {
  if (filePath.startsWith("./") || filePath.startsWith("../")) {
    return import(new URL(filePath, APP_ROOT).href);
  }
  return import(filePath);
};

/**
 * Boots the AdonisJS HTTP server.
 * Called from the Electron main process to embed the backend.
 */
export async function startServer(options: DevToolsOptions = {}) {
  const port = options.port ?? 4200;
  const host = options.host ?? "0.0.0.0";
  const dbPath =
    options.dbPath ?? join(homedir(), ".config", "boilerplate", "backend.db");

  process.env.PORT = String(port);
  process.env.HOST = host;
  process.env.NODE_ENV = process.env.NODE_ENV || "development";
  process.env.APP_KEY =
    process.env.APP_KEY || "devtools-local-key-not-used-for-security";

  process.on("SIGINT", async () => {
    await closeConnection();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await closeConnection();
    process.exit(0);
  });

  new Ignitor(APP_ROOT, { importer: IMPORTER })
    .tap((app) => {
      app.booting(async () => {
        await import("#start/env");
        const db = await initConnection(dbPath);
        await initializeSchema(db);
      });

      app.ready(async () => {
        printStartupBanner({ port, host });
      });

      app.listen("SIGTERM", () => app.terminate());
      app.listenIf(app.managedByPm2, "SIGINT", () => app.terminate());
    })
    .httpServer()
    .start()
    .catch((error) => {
      process.exitCode = 1;
      prettyPrintError(error);
    });
}
