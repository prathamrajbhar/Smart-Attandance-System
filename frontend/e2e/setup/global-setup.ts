import { FullConfig } from "@playwright/test";

/**
 * Global Setup Guardrail:
 * Ensures all E2E tests run strictly and exclusively against a local test database.
 * Rejects remote hosts, production connection strings, and unverified environments.
 */
export default async function globalSetup(config: FullConfig): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/smart_attendance";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  const prohibitedRemoteHosts = [
    "supabase.co",
    "neon.tech",
    "rds.amazonaws.com",
    "elephantsql.com",
    "cockroachlabs.cloud",
    "render.com",
    "railway.app",
    "planetscale.com",
    "production",
    "prod-db",
  ];

  const isRemote = prohibitedRemoteHosts.some((host) => databaseUrl.toLowerCase().includes(host));
  const isLocal =
    databaseUrl.includes("localhost") ||
    databaseUrl.includes("127.0.0.1") ||
    databaseUrl.startsWith("file:") ||
    databaseUrl.includes("sqlite") ||
    databaseUrl.includes("test.db");

  if (isRemote || !isLocal) {
    throw new Error(
      `[SECURITY GUARDRAIL] E2E Suite execution blocked! DATABASE_URL (${databaseUrl}) does not point to a local test instance. Only local databases (localhost/127.0.0.1/test.db) are permitted.`
    );
  }

  // Health check to verify local test API availability and ensure it's not pointing to production
  try {
    const healthUrl = apiUrl.replace(/\/$/, "") + "/health";
    const response = await fetch(healthUrl);
    if (!response.ok) {
      console.warn(`[GLOBAL SETUP] Backend health check returned HTTP ${response.status} at ${healthUrl}`);
    } else {
      const data = (await response.json()) as { environment?: string; status?: string };
      if (data.environment && data.environment.toLowerCase() === "production") {
        throw new Error("[SECURITY GUARDRAIL] Backend reports environment='production'. E2E execution aborted.");
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("[SECURITY GUARDRAIL]")) {
      throw error;
    }
    console.warn("[GLOBAL SETUP] Note: Local backend check skipped or offline during initialization:", error);
  }
}
