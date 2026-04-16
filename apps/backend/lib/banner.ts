interface BannerOptions {
  port: number;
  host: string;
}

/**
 * Prints a startup banner to stdout once the server is ready.
 */
export function printStartupBanner({ port, host }: BannerOptions): void {
  const url = `http://${host === "0.0.0.0" ? "localhost" : host}:${port}`;

  console.log("");
  console.log(`  ⚡ Server running at ${url}`);
  console.log("");
}
