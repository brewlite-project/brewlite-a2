/**
 * Pure policy for a future opt-in Render A2 demo seed. This module neither
 * reads environment variables nor connects to a database.
 */
export type RenderDemoSeedEnv = Record<string, string | undefined>;
export type RenderDemoSeedMode = "dry-run" | "apply";

export const RENDER_A2_DATABASE_HOST =
  "dpg-dbpjof942hec73crc7s0-a.singapore-postgres.render.com";
export const RENDER_A2_DATABASE_NAME = "brewlite_a2";
export const RENDER_A2_MANUAL_ENV = "render-a2-manual";
export const RENDER_A2_APPLY_CONFIRMATION = "APPLY_RENDER_DEMO_brewlite_a2";

export const renderDemoSeedPreconditions = [
  "no-delete-or-deactivate-existing-data",
  "preserve-product-stock",
  "preserve-coupon-quota-and-redemptions",
  "never-write-orders-payments-or-users",
  "catalog-must-match-the-approved-nine-product-set",
  "halt-when-state-is-unsafe-or-cannot-be-verified",
] as const;

export type RenderDemoSeedPolicy = {
  databaseName: typeof RENDER_A2_DATABASE_NAME;
  executionMode: RenderDemoSeedMode;
  readOnly: boolean;
  preconditions: typeof renderDemoSeedPreconditions;
};

const allowedConnectionParameters = new Set(["sslmode", "schema"]);

function getAllowedSingleQueryParameters(url: URL): Map<string, string> {
  const parameters = new Map<string, string>();
  for (const [rawKey, value] of url.searchParams) {
    const key = rawKey.toLowerCase();
    if (parameters.has(key)) {
      throw new Error(`Seed blocked: duplicate URL query parameter ${rawKey}`);
    }
    if (rawKey !== key) {
      throw new Error(`Seed blocked: URL query parameter ${rawKey} must use canonical casing`);
    }
    if (!allowedConnectionParameters.has(key)) {
      throw new Error(`Seed blocked: URL query parameter ${rawKey} is not allowed`);
    }
    if (key === "schema" && value !== "public") {
      throw new Error("Seed blocked: only schema=public is allowed");
    }
    parameters.set(key, value);
  }
  return parameters;
}

function parseRenderA2Url(connection: string): void {
  let url: URL;
  try {
    url = new URL(connection);
  } catch {
    throw new Error("Seed blocked: malformed DATABASE_URL");
  }

  if (url.protocol !== "postgresql:") {
    throw new Error("Seed blocked: PostgreSQL URL required");
  }
  if (!url.username || !url.password) {
    throw new Error("Seed blocked: DATABASE_URL must include username and password");
  }
  if (url.hostname !== RENDER_A2_DATABASE_HOST || url.port !== "5432") {
    throw new Error("Seed blocked: DATABASE_URL must target the exact Render A2 host and port");
  }
  if (decodeURIComponent(url.pathname.slice(1)) !== RENDER_A2_DATABASE_NAME) {
    throw new Error("Seed blocked: only the brewlite_a2 database is allowed");
  }

  const parameters = getAllowedSingleQueryParameters(url);
  if (parameters.get("sslmode") !== "verify-full") {
    throw new Error("Seed blocked: DATABASE_URL must use sslmode=verify-full");
  }
}

function resolveExecutionMode(env: RenderDemoSeedEnv): RenderDemoSeedMode {
  const mode = env.SEED_RENDER_DEMO_MODE ?? "dry-run";
  if (mode !== "dry-run" && mode !== "apply") {
    throw new Error("Seed blocked: SEED_RENDER_DEMO_MODE must be dry-run or apply");
  }
  return mode;
}

/**
 * Validates only connection target and explicit operator intent. It does not
 * inspect database state; a future execution script must enforce every
 * precondition before any write.
 */
export function validateRenderDemoSeedPolicy(
  env: RenderDemoSeedEnv,
): RenderDemoSeedPolicy {
  if (env.NODE_ENV !== "development") {
    throw new Error("Seed blocked: NODE_ENV must be development");
  }
  if (env.SEED_RENDER_DEMO_ENV !== RENDER_A2_MANUAL_ENV) {
    throw new Error("Seed blocked: SEED_RENDER_DEMO_ENV=render-a2-manual is required");
  }
  if (!env.DATABASE_URL) {
    throw new Error("Seed blocked: DATABASE_URL is missing");
  }

  parseRenderA2Url(env.DATABASE_URL);
  const executionMode = resolveExecutionMode(env);
  if (
    executionMode === "apply" &&
    env.SEED_RENDER_DEMO_CONFIRM !== RENDER_A2_APPLY_CONFIRMATION
  ) {
    throw new Error("Seed blocked: explicit A2 apply confirmation is required");
  }

  return {
    databaseName: RENDER_A2_DATABASE_NAME,
    executionMode,
    readOnly: executionMode === "dry-run",
    preconditions: renderDemoSeedPreconditions,
  };
}
