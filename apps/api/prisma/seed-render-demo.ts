import { PrismaPg } from "@prisma/adapter-pg";
import { Pool, type PoolConfig } from "pg";
import { resolve } from "node:path";
import { checkServerIdentity } from "node:tls";
import { pathToFileURL } from "node:url";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { categories, products, toppings } from "./seed-catalog.fixtures.js";
import {
  describePromotionDrift,
  promotionFixtures,
} from "./seed-compose-coupons.policy.js";
import {
  type RenderDemoSeedEnv,
  type RenderDemoSeedMode,
  validateRenderDemoSeedPolicy,
} from "./seed-render-demo.policy.js";

export type RenderDemoIdentity = {
  databaseName: string;
  currentUser: string | null;
  serverAddress: string | null;
};

type ExistingCategory = { id: string; code: string; name: string; isActive: boolean };
type ExistingTopping = {
  id: string;
  code: string;
  name: string;
  price: bigint;
  isAvailable: boolean;
};
type ExistingProduct = {
  id: string;
  categoryCode: string;
  name: string;
  price: bigint;
  image: string;
  sizePolicy: "STANDARD" | "ONE_SIZE";
  isNew: boolean;
  isBestseller: boolean;
  toppingCodes: string[];
};
export type ExistingCoupon = {
  code: string;
  type: string;
  value: number;
  minSubtotalVnd: bigint;
  maxDiscountVnd: bigint | null;
  usageLimit: number;
  perUserLimit: number;
  startsAt: Date;
  expiresAt: Date;
  activeUsageCount: number;
};

export type RenderDemoCatalog = {
  categories: ExistingCategory[];
  toppings: ExistingTopping[];
  products: ExistingProduct[];
};

export type RenderDemoSeedCounts = {
  categories: number;
  toppings: number;
  products: number;
  productToppings: number;
  coupons: number;
};

export type RenderDemoSeedResult = {
  mode: RenderDemoSeedMode;
  status: "dry-run" | "applied";
  created: RenderDemoSeedCounts;
};

export interface RenderDemoSession {
  identity(): Promise<RenderDemoIdentity>;
  readCatalog(): Promise<RenderDemoCatalog>;
  readCoupons(): Promise<ExistingCoupon[]>;
  tryAcquireSeedLock(): Promise<boolean>;
  createCategory(category: (typeof categories)[number]): Promise<{ id: string }>;
  createTopping(topping: (typeof toppings)[number]): Promise<{ id: string }>;
  createProduct(
    product: (typeof products)[number],
    categoryId: string,
  ): Promise<void>;
  createProductTopping(productId: string, toppingId: string): Promise<void>;
  createCoupon(
    coupon: (typeof promotionFixtures)[number],
    startsAt: Date,
    expiresAt: Date,
  ): Promise<void>;
}

export interface RenderDemoDatabase extends RenderDemoSession {
  transaction<T>(work: (transaction: RenderDemoSession) => Promise<T>): Promise<T>;
  disconnect(): Promise<void>;
}

export type RenderDemoDatabaseFactory = (connectionString: string) => RenderDemoDatabase;

export type RenderDemoExecutionPolicy = {
  databaseName: string;
  executionMode: RenderDemoSeedMode;
  expectedUser?: string;
};

export const RENDER_DEMO_TRANSACTION_OPTIONS = {
  isolationLevel: "Serializable" as const,
  maxWait: 10_000,
  timeout: 60_000,
};

const emptyCounts = (): RenderDemoSeedCounts => ({
  categories: 0,
  toppings: 0,
  products: 0,
  productToppings: 0,
  coupons: 0,
});

function sameCodes(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((code) => right.includes(code));
}

function failDrift(scope: string, key: string): never {
  throw new Error(`Seed blocked: ${scope} drift for ${key}`);
}

function inspectCatalog(catalog: RenderDemoCatalog): RenderDemoSeedCounts {
  const counts = emptyCounts();
  const categoryByCode = new Map(catalog.categories.map((category) => [category.code, category]));
  const toppingByCode = new Map(catalog.toppings.map((topping) => [topping.code, topping]));
  const productById = new Map(catalog.products.map((product) => [product.id, product]));

  for (const category of catalog.categories) {
    if (!categories.some((fixture) => fixture.code === category.code)) {
      failDrift("category", category.code);
    }
  }
  for (const topping of catalog.toppings) {
    if (!toppings.some((fixture) => fixture.code === topping.code)) {
      failDrift("topping", topping.code);
    }
  }
  for (const product of catalog.products) {
    if (!products.some((fixture) => fixture.id === product.id)) {
      failDrift("product", product.id);
    }
  }

  for (const fixture of categories) {
    const existing = categoryByCode.get(fixture.code);
    if (!existing) {
      counts.categories += 1;
      continue;
    }
    if (existing.name !== fixture.name || !existing.isActive) failDrift("category", fixture.code);
  }
  for (const fixture of toppings) {
    const existing = toppingByCode.get(fixture.code);
    if (!existing) {
      counts.toppings += 1;
      continue;
    }
    if (
      existing.id !== fixture.id ||
      existing.name !== fixture.name ||
      existing.price !== BigInt(fixture.price) ||
      !existing.isAvailable
    ) {
      failDrift("topping", fixture.code);
    }
  }
  for (const fixture of products) {
    const existing = productById.get(fixture.id);
    if (!existing) {
      counts.products += 1;
      counts.productToppings += fixture.toppingCodes.length;
      continue;
    }
    if (
      existing.categoryCode !== fixture.categoryCode ||
      existing.name !== fixture.name ||
      existing.price !== BigInt(fixture.price) ||
      existing.image !== fixture.image ||
      existing.sizePolicy !== fixture.sizePolicy ||
      existing.isNew !== fixture.isNew ||
      existing.isBestseller !== fixture.isBestseller ||
      !sameCodes(existing.toppingCodes, fixture.toppingCodes)
    ) {
      failDrift("product", fixture.id);
    }
  }
  return counts;
}

function inspectCoupons(coupons: ExistingCoupon[], now: Date): number {
  const couponByCode = new Map(coupons.map((coupon) => [coupon.code, coupon]));
  let missing = 0;
  for (const fixture of promotionFixtures) {
    const existing = couponByCode.get(fixture.code);
    if (!existing) {
      missing += 1;
      continue;
    }
    if (describePromotionDrift(existing, fixture, now).length > 0) {
      failDrift("coupon", fixture.code);
    }
  }
  return missing;
}

function assertIdentity(
  identity: RenderDemoIdentity,
  policy: RenderDemoExecutionPolicy,
): void {
  if (
    identity.databaseName !== policy.databaseName ||
    !identity.currentUser ||
    (policy.expectedUser !== undefined && identity.currentUser !== policy.expectedUser)
  ) {
    throw new Error("Seed blocked: connected database identity differs from approved target");
  }
  // serverAddress is diagnostic only: a Render hostname can legitimately resolve to
  // different IPs, so it must never be treated as the sole security identifier.
}

async function inspect(
  session: RenderDemoSession,
  now: Date,
  policy: RenderDemoExecutionPolicy,
): Promise<RenderDemoSeedCounts> {
  assertIdentity(await session.identity(), policy);
  const counts = inspectCatalog(await session.readCatalog());
  counts.coupons = inspectCoupons(await session.readCoupons(), now);
  return counts;
}

async function apply(
  transaction: RenderDemoSession,
  now: Date,
  policy: RenderDemoExecutionPolicy,
): Promise<RenderDemoSeedCounts> {
  if (!(await transaction.tryAcquireSeedLock())) {
    throw new Error("Seed blocked: another Render demo seed apply is in progress");
  }
  const planned = await inspect(transaction, now, policy);
  const catalog = await transaction.readCatalog();
  const categoryIds = new Map(catalog.categories.map((category) => [category.code, category.id]));
  const toppingIds = new Map(catalog.toppings.map((topping) => [topping.code, topping.id]));

  for (const fixture of categories) {
    if (!categoryIds.has(fixture.code)) {
      categoryIds.set(fixture.code, (await transaction.createCategory(fixture)).id);
    }
  }
  for (const fixture of toppings) {
    if (!toppingIds.has(fixture.code)) {
      toppingIds.set(fixture.code, (await transaction.createTopping(fixture)).id);
    }
  }
  const existingProducts = new Set(catalog.products.map((product) => product.id));
  for (const fixture of products) {
    if (existingProducts.has(fixture.id)) continue;
    const categoryId = categoryIds.get(fixture.categoryCode);
    if (!categoryId) throw new Error(`Seed blocked: missing category ${fixture.categoryCode}`);
    await transaction.createProduct(fixture, categoryId);
    for (const code of fixture.toppingCodes) {
      const toppingId = toppingIds.get(code);
      if (!toppingId) throw new Error(`Seed blocked: missing topping ${code}`);
      await transaction.createProductTopping(fixture.id, toppingId);
    }
  }
  const existingCoupons = new Set((await transaction.readCoupons()).map((coupon) => coupon.code));
  const expiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
  for (const fixture of promotionFixtures) {
    if (!existingCoupons.has(fixture.code)) {
      await transaction.createCoupon(fixture, now, expiresAt);
    }
  }
  return planned;
}

export async function runRenderDemoSeedWithPolicy<Env extends Record<string, string | undefined>>(
  env: Env,
  validatePolicy: (configuration: Env) => RenderDemoExecutionPolicy,
  createDatabase: RenderDemoDatabaseFactory,
  now = new Date(),
): Promise<RenderDemoSeedResult> {
  const policy = validatePolicy(env);
  const connectionString = env.DATABASE_URL;
  if (!connectionString) throw new Error("Seed blocked: DATABASE_URL is missing");
  const database = createDatabase(connectionString);
  try {
    if (policy.executionMode === "dry-run") {
      return { mode: "dry-run", status: "dry-run", created: await inspect(database, now, policy) };
    }
    return {
      mode: "apply",
      status: "applied",
      created: await database.transaction((transaction) => apply(transaction, now, policy)),
    };
  } finally {
    await database.disconnect();
  }
}

export function runRenderDemoSeed(
  env: RenderDemoSeedEnv,
  createDatabase: RenderDemoDatabaseFactory,
  now = new Date(),
): Promise<RenderDemoSeedResult> {
  return runRenderDemoSeedWithPolicy(env, validateRenderDemoSeedPolicy, createDatabase, now);
}

type PrismaSeedClient = {
  $queryRaw<T>(strings: TemplateStringsArray, ...values: unknown[]): Promise<T>;
  category: { findMany(args: unknown): Promise<unknown>; create(args: unknown): Promise<unknown> };
  topping: { findMany(args: unknown): Promise<unknown>; create(args: unknown): Promise<unknown> };
  product: { findMany(args: unknown): Promise<unknown>; create(args: unknown): Promise<unknown> };
  productTopping: { create(args: unknown): Promise<unknown> };
  coupon: { findMany(args: unknown): Promise<unknown>; create(args: unknown): Promise<unknown> };
};

class PrismaRenderDemoSession implements RenderDemoSession {
  constructor(private readonly prisma: PrismaSeedClient) {}

  async identity(): Promise<RenderDemoIdentity> {
    const rows = await this.prisma.$queryRaw<
      Array<{ databaseName: string; currentUser: string | null; serverAddress: string | null }>
    >`SELECT current_database() AS "databaseName", current_user AS "currentUser", inet_server_addr()::text AS "serverAddress"`;
    if (rows.length !== 1) throw new Error("Seed blocked: database identity query was inconclusive");
    return rows[0]!;
  }

  async readCatalog(): Promise<RenderDemoCatalog> {
    const [categoryRows, toppingRows, productRows] = await Promise.all([
      this.prisma.category.findMany({ select: { id: true, code: true, name: true, isActive: true } }),
      this.prisma.topping.findMany({ select: { id: true, code: true, name: true, priceVnd: true, isAvailable: true } }),
      this.prisma.product.findMany({
        select: {
          id: true, name: true, basePriceVnd: true, imageUrl: true, sizePolicy: true, isNew: true, isBestseller: true,
          category: { select: { code: true } },
          productToppings: { select: { topping: { select: { code: true } } } },
        },
      }),
    ]);
    return {
      categories: categoryRows as ExistingCategory[],
      toppings: (toppingRows as Array<{ id: string; code: string; name: string; priceVnd: bigint; isAvailable: boolean }>).map((row) => ({ ...row, price: row.priceVnd })),
      products: (productRows as Array<{ id: string; name: string; basePriceVnd: bigint; imageUrl: string; sizePolicy: "STANDARD" | "ONE_SIZE"; isNew: boolean; isBestseller: boolean; category: { code: string }; productToppings: Array<{ topping: { code: string } }> }>).map((row) => ({
        id: row.id, categoryCode: row.category.code, name: row.name, price: row.basePriceVnd,
        image: row.imageUrl.replace(/^\/images\//, "").replace(/\.jpg$/, ""), sizePolicy: row.sizePolicy,
        isNew: row.isNew, isBestseller: row.isBestseller, toppingCodes: row.productToppings.map((link) => link.topping.code),
      })),
    };
  }

  async readCoupons(): Promise<ExistingCoupon[]> {
    return (await this.prisma.coupon.findMany({
      where: { code: { in: promotionFixtures.map((fixture) => fixture.code) } },
      select: { code: true, type: true, value: true, minSubtotalVnd: true, maxDiscountVnd: true, usageLimit: true, perUserLimit: true, startsAt: true, expiresAt: true, activeUsageCount: true },
    })) as ExistingCoupon[];
  }

  async tryAcquireSeedLock(): Promise<boolean> {
    const rows = await this.prisma.$queryRaw<Array<{ acquired: boolean }>>`SELECT pg_try_advisory_xact_lock(hashtextextended(${"brewlite:render-demo-seed:v1"}, 0)) AS acquired`;
    return rows[0]?.acquired === true;
  }

  async createCategory(fixture: (typeof categories)[number]): Promise<{ id: string }> {
    return (await this.prisma.category.create({ data: { ...fixture, isActive: true }, select: { id: true } })) as { id: string };
  }
  async createTopping(fixture: (typeof toppings)[number]): Promise<{ id: string }> {
    return (await this.prisma.topping.create({ data: { id: fixture.id, code: fixture.code, name: fixture.name, priceVnd: BigInt(fixture.price), isAvailable: true }, select: { id: true } })) as { id: string };
  }
  async createProduct(fixture: (typeof products)[number], categoryId: string): Promise<void> {
    await this.prisma.product.create({ data: { id: fixture.id, name: fixture.name, categoryId, description: null, basePriceVnd: BigInt(fixture.price), imageUrl: `/images/${fixture.image}.jpg`, stock: fixture.stock, sizePolicy: fixture.sizePolicy, isNew: fixture.isNew, isBestseller: fixture.isBestseller, rating: null } });
  }
  async createProductTopping(productId: string, toppingId: string): Promise<void> {
    await this.prisma.productTopping.create({ data: { productId, toppingId } });
  }
  async createCoupon(fixture: (typeof promotionFixtures)[number], startsAt: Date, expiresAt: Date): Promise<void> {
    await this.prisma.coupon.create({ data: { ...fixture, startsAt, expiresAt, activeUsageCount: 0 } });
  }
}

/**
 * The approved policy requires an explicit :5432 and sslmode=verify-full URL.
 * Parse that exact URL once into pg fields so pg-connection-string cannot
 * overwrite our sole TLS configuration from the connectionString option.
 */
export function renderDemoPoolConfig(connectionString: string): PoolConfig {
  const url = new URL(connectionString);
  return {
    host: url.hostname,
    port: Number(url.port),
    database: decodeURIComponent(url.pathname.slice(1)),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    ssl: { rejectUnauthorized: true, checkServerIdentity },
  };
}

export function createProductionRenderDemoDatabase(
  connectionString: string,
  createPool: (config: PoolConfig) => Pool = (config) => new Pool(config),
): RenderDemoDatabase {
  const pool = createPool(renderDemoPoolConfig(connectionString));
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool, { disposeExternalPool: true }) });
  const session = new PrismaRenderDemoSession(prisma as unknown as PrismaSeedClient);
  return {
    identity: () => session.identity(),
    readCatalog: () => session.readCatalog(),
    readCoupons: () => session.readCoupons(),
    tryAcquireSeedLock: () => session.tryAcquireSeedLock(),
    createCategory: (fixture) => session.createCategory(fixture),
    createTopping: (fixture) => session.createTopping(fixture),
    createProduct: (fixture, categoryId) => session.createProduct(fixture, categoryId),
    createProductTopping: (productId, toppingId) => session.createProductTopping(productId, toppingId),
    createCoupon: (fixture, startsAt, expiresAt) => session.createCoupon(fixture, startsAt, expiresAt),
    transaction: (work) => prisma.$transaction(
      (tx) => work(new PrismaRenderDemoSession(tx as unknown as PrismaSeedClient)),
      RENDER_DEMO_TRANSACTION_OPTIONS,
    ),
    disconnect: () => prisma.$disconnect(),
  };
}

/**
 * Render documents Internal PostgreSQL TLS as self-signed and supports only
 * sslmode=require. This adapter is intentionally separate from the External
 * adapter above; its caller must first validate the Internal-only policy.
 */
export function renderInternalDemoPoolConfig(connectionString: string): PoolConfig {
  const url = new URL(connectionString);
  return {
    host: url.hostname,
    port: Number(url.port),
    database: decodeURIComponent(url.pathname.slice(1)),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    ssl: { rejectUnauthorized: false },
  };
}

export function createInternalRenderDemoDatabase(
  connectionString: string,
  createPool: (config: PoolConfig) => Pool = (config) => new Pool(config),
): RenderDemoDatabase {
  const pool = createPool(renderInternalDemoPoolConfig(connectionString));
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool, { disposeExternalPool: true }) });
  const session = new PrismaRenderDemoSession(prisma as unknown as PrismaSeedClient);
  return {
    identity: () => session.identity(),
    readCatalog: () => session.readCatalog(),
    readCoupons: () => session.readCoupons(),
    tryAcquireSeedLock: () => session.tryAcquireSeedLock(),
    createCategory: (fixture) => session.createCategory(fixture),
    createTopping: (fixture) => session.createTopping(fixture),
    createProduct: (fixture, categoryId) => session.createProduct(fixture, categoryId),
    createProductTopping: (productId, toppingId) => session.createProductTopping(productId, toppingId),
    createCoupon: (fixture, startsAt, expiresAt) => session.createCoupon(fixture, startsAt, expiresAt),
    transaction: (work) => prisma.$transaction(
      (tx) => work(new PrismaRenderDemoSession(tx as unknown as PrismaSeedClient)),
      RENDER_DEMO_TRANSACTION_OPTIONS,
    ),
    disconnect: () => prisma.$disconnect(),
  };
}

function isMainModule(): boolean {
  const entrypoint = process.argv[1];
  return typeof entrypoint === "string" && import.meta.url === pathToFileURL(resolve(entrypoint)).href;
}

if (isMainModule()) {
  runRenderDemoSeed(process.env, createProductionRenderDemoDatabase)
    .then((result) => console.log(`Render demo seed ${result.status}: ${JSON.stringify(result.created)}`))
    .catch(() => { console.error("Render demo seed failed."); process.exitCode = 1; });
}
