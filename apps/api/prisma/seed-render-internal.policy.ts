/** Pure policy for a manually invoked Render-internal demo seed. */
export type RenderInternalSeedEnv = Record<string, string | undefined>;
export type RenderInternalSeedMode = "dry-run" | "apply";

export const RENDER_INTERNAL_DATABASE_NAME = "brewlite_a2";
export const RENDER_INTERNAL_MANUAL_ENV = "render-a2-internal-manual";
export const RENDER_INTERNAL_APPLY_CONFIRMATION = "APPLY_RENDER_INTERNAL_brewlite_a2";

export type RenderInternalSeedPolicy = {
  databaseName: typeof RENDER_INTERNAL_DATABASE_NAME;
  executionMode: RenderInternalSeedMode;
  readOnly: boolean;
  expectedHost: string;
  expectedUser: string;
};

const allowedParameters = new Set(["sslmode", "schema"]);
const forbiddenHosts = new Set(["localhost", "127.0.0.1", "::1", "postgres"]);

function requiredTargetConfiguration(env: RenderInternalSeedEnv): {
  host: string;
  user: string;
} {
  const host = env.SEED_RENDER_INTERNAL_EXPECTED_HOST;
  const user = env.SEED_RENDER_INTERNAL_EXPECTED_USER;
  if (!host || !user) {
    throw new Error("Seed blocked: exact Internal hostname and database user must be configured");
  }
  if (forbiddenHosts.has(host.toLowerCase())) {
    throw new Error("Seed blocked: configured Internal hostname is not allowed");
  }
  return { host, user };
}

function parseInternalUrl(
  connection: string,
  expectedHost: string,
  expectedUser: string,
): void {
  let url: URL;
  try {
    url = new URL(connection);
  } catch {
    throw new Error("Seed blocked: malformed DATABASE_URL");
  }
  if (url.protocol !== "postgresql:") {
    throw new Error("Seed blocked: PostgreSQL URL required");
  }
  if (
    url.hostname !== expectedHost ||
    url.port !== "5432" ||
    decodeURIComponent(url.pathname.slice(1)) !== RENDER_INTERNAL_DATABASE_NAME ||
    decodeURIComponent(url.username) !== expectedUser ||
    !url.password
  ) {
    throw new Error("Seed blocked: DATABASE_URL differs from the approved Internal target");
  }

  const parameters = new Map<string, string>();
  for (const [rawKey, value] of url.searchParams) {
    const key = rawKey.toLowerCase();
    if (parameters.has(key)) {
      throw new Error(`Seed blocked: duplicate URL query parameter ${rawKey}`);
    }
    if (rawKey !== key || !allowedParameters.has(key)) {
      throw new Error(`Seed blocked: URL query parameter ${rawKey} is not allowed`);
    }
    if (key === "schema" && value !== "public") {
      throw new Error("Seed blocked: only schema=public is allowed");
    }
    parameters.set(key, value);
  }
  if (parameters.get("sslmode") !== "require") {
    throw new Error("Seed blocked: Internal DATABASE_URL must use sslmode=require");
  }
}

export function validateRenderInternalSeedPolicy(
  env: RenderInternalSeedEnv,
): RenderInternalSeedPolicy {
  if (env.NODE_ENV !== "production") {
    throw new Error("Seed blocked: Internal seed requires the Render production runtime");
  }
  if (env.SEED_RENDER_INTERNAL_ENV !== RENDER_INTERNAL_MANUAL_ENV) {
    throw new Error("Seed blocked: explicit Internal manual marker is required");
  }
  if (!env.DATABASE_URL) throw new Error("Seed blocked: DATABASE_URL is missing");
  const target = requiredTargetConfiguration(env);
  parseInternalUrl(env.DATABASE_URL, target.host, target.user);

  const mode = env.SEED_RENDER_INTERNAL_MODE ?? "dry-run";
  if (mode !== "dry-run" && mode !== "apply") {
    throw new Error("Seed blocked: mode must be dry-run or apply");
  }
  if (mode === "apply" && env.SEED_RENDER_INTERNAL_CONFIRM !== RENDER_INTERNAL_APPLY_CONFIRMATION) {
    throw new Error("Seed blocked: explicit Internal apply confirmation is required");
  }
  return {
    databaseName: RENDER_INTERNAL_DATABASE_NAME,
    executionMode: mode,
    readOnly: mode === "dry-run",
    expectedHost: target.host,
    expectedUser: target.user,
  };
}
