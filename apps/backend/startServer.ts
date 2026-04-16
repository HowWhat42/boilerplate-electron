/**
 * Boots the AdonisJS-based DevTools HTTP server with DuckDB
 * storage, OTLP ingestion, and the Studio UI.
 */
export async function startServer(options: DevToolsOptions = {}) {
  const port = options.port ?? 4200;
  const host = options.host ?? "0.0.0.0";
  const dbPath =
    options.dbPath ?? join(homedir(), ".config", "boilerplate", "backend.db");

  const APP_ROOT = new URL("./", import.meta.url);
  const IMPORTER = (filePath: string) => {
    if (filePath.startsWith("./") || filePath.startsWith("../")) {
      return import(new URL(filePath, APP_ROOT).href);
    }
    return import(filePath);
  };

  process.env.PORT = String(port);
  process.env.HOST = host;
  process.env.NODE_ENV = process.env.NODE_ENV || "development";
  process.env.APP_KEY =
    process.env.APP_KEY || "devtools-local-key-not-used-for-security";

  /**
   * Force exit on CTRL+C. Close DuckDB first.
   */
  process.on("SIGINT", async () => {
    console.log(`\n  ${pc.dim("Shutting down...")}`);
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
        const db = await initConnection(dbPath);
        await initializeSchema(db);
      });

      app.ready(async () => {
        printStartupBanner({ port, host });
      });
    })
    .httpServer()
    .start()
    .catch((error) => {
      process.exitCode = 1;
      prettyPrintError(error);
    });
}
