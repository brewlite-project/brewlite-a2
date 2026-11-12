import { PrismaPg } from '@prisma/adapter-pg';
import { Pool, type PoolConfig } from 'pg';

export type PrismaConnectionEnv = Record<string, string | undefined>;

export const RENDER_INTERNAL_PRISMA_MODE = 'render-a2-internal';
export const RENDER_INTERNAL_PRISMA_TARGET = 'brewlite-a2-postgres-internal';
const approvedDatabaseName = 'brewlite_a2';
const allowedQueryParameters = new Set(['sslmode', 'schema']);
const forbiddenHosts = new Set(['localhost', '127.0.0.1', '::1', 'postgres']);

export type DirectPrismaConnection = {
  kind: 'direct';
  connectionString: string;
  options: string;
};

export type RenderInternalPrismaConnection = {
  kind: 'render-internal';
  poolConfig: PoolConfig;
};

export type ResolvedPrismaConnection =
  | DirectPrismaConnection
  | RenderInternalPrismaConnection;

export type PrismaRuntimeAdapter = {
  adapter: PrismaPg;
  usesRenderInternalPool: boolean;
};

function required(env: PrismaConnectionEnv, name: string): string {
  const value = env[name];
  if (!value) throw new Error(`Prisma blocked: ${name} is required for Render Internal mode`);
  return value;
}

function decodeUrlComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    throw new Error('Prisma blocked: DATABASE_URL has malformed encoding');
  }
}

function parseRenderInternalTarget(env: PrismaConnectionEnv): {
  host: string;
  port: string;
  database: string;
  user: string;
} {
  const host = required(env, 'PRISMA_RENDER_INTERNAL_EXPECTED_HOST');
  const port = required(env, 'PRISMA_RENDER_INTERNAL_EXPECTED_PORT');
  const database = required(env, 'PRISMA_RENDER_INTERNAL_EXPECTED_DATABASE');
  const user = required(env, 'PRISMA_RENDER_INTERNAL_EXPECTED_USER');
  if (
    required(env, 'PRISMA_RENDER_INTERNAL_TARGET') !== RENDER_INTERNAL_PRISMA_TARGET ||
    host !== host.toLowerCase() ||
    forbiddenHosts.has(host) ||
    port !== '5432' ||
    database !== approvedDatabaseName
  ) {
    throw new Error('Prisma blocked: Render Internal target configuration is not approved');
  }
  return { host, port, database, user };
}

export function renderInternalPrismaPoolConfig(
  connectionString: string,
  env: PrismaConnectionEnv,
): PoolConfig {
  const target = parseRenderInternalTarget(env);
  let url: URL;
  try {
    url = new URL(connectionString);
  } catch {
    throw new Error('Prisma blocked: DATABASE_URL is malformed');
  }
  if (
    url.protocol !== 'postgresql:' ||
    url.hostname !== target.host ||
    url.port !== target.port ||
    decodeUrlComponent(url.pathname.slice(1)) !== target.database ||
    decodeUrlComponent(url.username) !== target.user ||
    !url.password ||
    url.hash
  ) {
    throw new Error('Prisma blocked: DATABASE_URL differs from the approved Render Internal target');
  }

  const parameters = new Map<string, string>();
  for (const [rawKey, value] of url.searchParams) {
    const key = rawKey.toLowerCase();
    if (parameters.has(key) || rawKey !== key || !allowedQueryParameters.has(key)) {
      throw new Error('Prisma blocked: DATABASE_URL has an unsupported or duplicate query parameter');
    }
    if (key === 'schema' && value !== 'public') {
      throw new Error('Prisma blocked: only schema=public is allowed for Render Internal mode');
    }
    parameters.set(key, value);
  }
  if (parameters.get('sslmode') !== 'require') {
    throw new Error('Prisma blocked: Render Internal DATABASE_URL must use sslmode=require');
  }

  // Do not pass connectionString to pg: URL parameters must not override these
  // explicit, narrowly scoped TLS and UTC session settings.
  return {
    host: url.hostname,
    port: Number(url.port),
    database: decodeUrlComponent(url.pathname.slice(1)),
    user: decodeUrlComponent(url.username),
    password: decodeUrlComponent(url.password),
    options: '-c timezone=UTC',
    // Render Internal PostgreSQL uses a self-signed certificate. This exception
    // is reachable only after the exact target and explicit mode checks above.
    ssl: { rejectUnauthorized: false },
  };
}

export function resolvePrismaConnection(
  env: PrismaConnectionEnv,
): ResolvedPrismaConnection {
  const connectionString = env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not configured.');

  const mode = env.PRISMA_RENDER_INTERNAL_MODE;
  if (mode === undefined || mode === '') {
    return { kind: 'direct', connectionString, options: '-c timezone=UTC' };
  }
  if (mode !== RENDER_INTERNAL_PRISMA_MODE) {
    throw new Error('Prisma blocked: unsupported PRISMA_RENDER_INTERNAL_MODE');
  }
  return {
    kind: 'render-internal',
    poolConfig: renderInternalPrismaPoolConfig(connectionString, env),
  };
}

export function createPrismaRuntimeAdapter(
  env: PrismaConnectionEnv,
  createPool: (config: PoolConfig) => Pool = (config) => new Pool(config),
): PrismaRuntimeAdapter {
  const connection = resolvePrismaConnection(env);
  if (connection.kind === 'direct') {
    return {
      adapter: new PrismaPg({
        connectionString: connection.connectionString,
        options: connection.options,
      }),
      usesRenderInternalPool: false,
    };
  }
  const pool = createPool(connection.poolConfig);
  return {
    adapter: new PrismaPg(pool, { disposeExternalPool: true }),
    usesRenderInternalPool: true,
  };
}
