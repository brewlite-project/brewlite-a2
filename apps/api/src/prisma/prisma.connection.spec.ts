import { describe, expect, it, vi } from 'vitest';
import { Pool } from 'pg';
import {
  createPrismaRuntimeAdapter,
  RENDER_INTERNAL_PRISMA_MODE,
  RENDER_INTERNAL_PRISMA_TARGET,
  renderInternalPrismaPoolConfig,
  resolvePrismaConnection,
} from './prisma.connection.js';

const host = 'dpg-example-internal.singapore-postgres.render.com';
const user = 'render_user';
const password = 'test_password';
const validUrl = `postgresql://${user}:${password}@${host}:5432/brewlite_a2?sslmode=require&schema=public`;
const internalEnv = {
  DATABASE_URL: validUrl,
  PRISMA_RENDER_INTERNAL_MODE: RENDER_INTERNAL_PRISMA_MODE,
  PRISMA_RENDER_INTERNAL_TARGET: RENDER_INTERNAL_PRISMA_TARGET,
  PRISMA_RENDER_INTERNAL_EXPECTED_HOST: host,
  PRISMA_RENDER_INTERNAL_EXPECTED_PORT: '5432',
  PRISMA_RENDER_INTERNAL_EXPECTED_DATABASE: 'brewlite_a2',
  PRISMA_RENDER_INTERNAL_EXPECTED_USER: user,
};

describe('Prisma Render Internal connection configuration', () => {
  it('creates an explicit Internal Pool configuration with scoped TLS and UTC', () => {
    expect(renderInternalPrismaPoolConfig(validUrl, internalEnv)).toEqual({
      host,
      port: 5432,
      database: 'brewlite_a2',
      user,
      password,
      options: '-c timezone=UTC',
      ssl: { rejectUnauthorized: false },
    });
  });

  it.each([
    ['host', validUrl.replace(host, 'other.render.com')],
    ['port', validUrl.replace(':5432', ':5433')],
    ['database', validUrl.replace('/brewlite_a2', '/other_database')],
    ['user', validUrl.replace(user, 'other_user')],
  ])('rejects an incorrect Internal %s', (_field, databaseUrl) => {
    expect(() => renderInternalPrismaPoolConfig(databaseUrl, internalEnv)).toThrow('approved Render Internal target');
  });

  it.each([
    'PRISMA_RENDER_INTERNAL_EXPECTED_HOST',
    'PRISMA_RENDER_INTERNAL_EXPECTED_PORT',
    'PRISMA_RENDER_INTERNAL_EXPECTED_DATABASE',
    'PRISMA_RENDER_INTERNAL_EXPECTED_USER',
    'PRISMA_RENDER_INTERNAL_TARGET',
  ])('requires %s when Internal mode is selected', (name) => {
    const env = { ...internalEnv, [name]: undefined };
    expect(() => resolvePrismaConnection(env)).toThrow('is required');
  });

  it.each([
    `${validUrl}&host=other.render.com`,
    `${validUrl}&hostaddr=127.0.0.1`,
    `${validUrl}&service=other-service`,
    `${validUrl}&socket=/tmp/postgres.sock`,
    `${validUrl}&sslmode=require`,
    validUrl.replace('sslmode=require', 'SSLMODE=require'),
    validUrl.replace('sslmode=require', 'sslmode=disable'),
    `${validUrl}&application_name=unsafe`,
  ])('rejects URL SSL or destination override attempts', (databaseUrl) => {
    expect(() => renderInternalPrismaPoolConfig(databaseUrl, { ...internalEnv, DATABASE_URL: databaseUrl })).toThrow();
  });

  it.each([
    ['unsupported mode', { ...internalEnv, PRISMA_RENDER_INTERNAL_MODE: 'production' }],
    ['invalid protocol', { ...internalEnv, DATABASE_URL: validUrl.replace('postgresql:', 'postgres:') }],
    ['missing password', { ...internalEnv, DATABASE_URL: validUrl.replace(`:${password}@`, '@') }],
    ['URL fragment', { ...internalEnv, DATABASE_URL: `${validUrl}#fragment` }],
    ['non-public schema', { ...internalEnv, DATABASE_URL: validUrl.replace('schema=public', 'schema=private') }],
    ['malformed percent encoding', { ...internalEnv, DATABASE_URL: validUrl.replace(password, '%ZZ') }],
    ['wrong target profile', { ...internalEnv, PRISMA_RENDER_INTERNAL_TARGET: 'other-target' }],
  ])('rejects %s without exposing connection details', (_name, env) => {
    let received: unknown;
    try {
      resolvePrismaConnection(env);
    } catch (error) {
      received = error;
    }
    expect(received).toBeInstanceOf(Error);
    const message = (received as Error).message;
    expect(message).not.toContain(password);
    expect(message).not.toContain(validUrl);
  });

  it('keeps local development on the existing direct adapter configuration', () => {
    const localUrl = 'postgresql://local_user:local_password@127.0.0.1:15432/brewlite_a2?schema=public';
    expect(resolvePrismaConnection({ DATABASE_URL: localUrl })).toEqual({
      kind: 'direct',
      connectionString: localUrl,
      options: '-c timezone=UTC',
    });
  });

  it('does not enable Internal TLS for direct connections', () => {
    const connection = resolvePrismaConnection({ DATABASE_URL: validUrl });
    expect(connection.kind).toBe('direct');
    expect(connection).not.toHaveProperty('poolConfig');
  });

  it('constructs the pg pool only for an approved Internal connection', () => {
    const createPool = vi.fn(() => ({}) as import('pg').Pool);
    const result = createPrismaRuntimeAdapter(internalEnv, createPool);
    expect(result.usesRenderInternalPool).toBe(true);
    expect(createPool).toHaveBeenCalledWith(expect.objectContaining({
      options: '-c timezone=UTC',
      ssl: { rejectUnauthorized: false },
    }));
  });

  it('configures Prisma to dispose the approved external pool', async () => {
    const pool = new Pool({ host: '127.0.0.1', port: 1 });
    const end = vi.spyOn(pool, 'end').mockResolvedValue(undefined);
    const { adapter } = createPrismaRuntimeAdapter(internalEnv, () => pool);
    const connection = await adapter.connect();
    await connection.dispose();
    expect(end).toHaveBeenCalledOnce();
  });
});
