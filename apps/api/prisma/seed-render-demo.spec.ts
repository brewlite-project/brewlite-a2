import { describe, expect, it } from "vitest";
import { categories, products, toppings } from "./seed-catalog.fixtures.js";
import { promotionFixtures } from "./seed-compose-coupons.policy.js";
import {
  RENDER_A2_APPLY_CONFIRMATION,
  RENDER_A2_DATABASE_HOST,
} from "./seed-render-demo.policy.js";
import {
  RENDER_DEMO_TRANSACTION_OPTIONS,
  RenderDemoSeedDiagnosticError,
  createProductionRenderDemoDatabase,
  type ExistingCoupon,
  type RenderDemoCatalog,
  type RenderDemoDatabase,
  type RenderDemoSession,
  renderDemoPoolConfig,
  renderDemoSeedDiagnosticCode,
  renderDemoSeedDiagnosticMessage,
  renderInternalDemoPoolConfig,
  runRenderDemoSeed,
  runRenderDemoSeedWithPolicy,
} from "./seed-render-demo.js";

const now = new Date("2026-11-11T00:00:00.000Z");
const validEnv = {
  NODE_ENV: "development",
  SEED_RENDER_DEMO_ENV: "render-a2-manual",
  DATABASE_URL: `postgresql://seed_user:test_password@${RENDER_A2_DATABASE_HOST}:5432/brewlite_a2?sslmode=verify-full`,
};

type Shared = {
  identity: { databaseName: string; currentUser: string | null; serverAddress: string | null };
  locked: boolean;
  writes: number;
  failProductCreate: boolean;
};

class FakeSession implements RenderDemoSession {
  constructor(
    protected readonly shared: Shared,
    public state: { catalog: RenderDemoCatalog; coupons: ExistingCoupon[] },
  ) {}

  async identity() { return this.shared.identity; }
  async readCatalog() { return structuredClone(this.state.catalog); }
  async readCoupons() { return structuredClone(this.state.coupons); }
  async tryAcquireSeedLock() {
    if (this.shared.locked) return false;
    this.shared.locked = true;
    return true;
  }
  async createCategory(fixture: (typeof categories)[number]) {
    this.shared.writes += 1;
    const row = { id: `category-${fixture.code}`, ...fixture, isActive: true };
    this.state.catalog.categories.push(row);
    return { id: row.id };
  }
  async createTopping(fixture: (typeof toppings)[number]) {
    this.shared.writes += 1;
    this.state.catalog.toppings.push({ ...fixture, price: BigInt(fixture.price), isAvailable: true });
    return { id: fixture.id };
  }
  async createProduct(fixture: (typeof products)[number], categoryId: string) {
    this.shared.writes += 1;
    if (this.shared.failProductCreate) throw new Error("simulated product insert failure");
    const category = this.state.catalog.categories.find((row) => row.id === categoryId);
    if (!category) throw new Error("missing fake category");
    this.state.catalog.products.push({
      id: fixture.id,
      categoryCode: category.code,
      name: fixture.name,
      price: BigInt(fixture.price),
      image: fixture.image,
      sizePolicy: fixture.sizePolicy,
      isNew: fixture.isNew,
      isBestseller: fixture.isBestseller,
      toppingCodes: [],
    });
  }
  async createProductTopping(productId: string, toppingId: string) {
    this.shared.writes += 1;
    const product = this.state.catalog.products.find((row) => row.id === productId);
    const topping = this.state.catalog.toppings.find((row) => row.id === toppingId);
    if (!product || !topping) throw new Error("missing fake product topping reference");
    product.toppingCodes.push(topping.code);
  }
  async createCoupon(fixture: (typeof promotionFixtures)[number], startsAt: Date, expiresAt: Date) {
    this.shared.writes += 1;
    this.state.coupons.push({ ...fixture, startsAt, expiresAt, activeUsageCount: 0 });
  }
}

class FakeDatabase extends FakeSession implements RenderDemoDatabase {
  disconnected = false;
  transactions = 0;

  constructor(
    shared: Shared = {
      identity: { databaseName: "brewlite_a2", currentUser: "seed_user", serverAddress: null },
      locked: false,
      writes: 0,
      failProductCreate: false,
    },
    state: { catalog: RenderDemoCatalog; coupons: ExistingCoupon[] } = {
      catalog: { categories: [], toppings: [], products: [] },
      coupons: [],
    },
  ) {
    super(shared, state);
  }

  async transaction<T>(work: (transaction: RenderDemoSession) => Promise<T>): Promise<T> {
    this.transactions += 1;
    const staged = new FakeSession(this.shared, structuredClone(this.state));
    try {
      const result = await work(staged);
      this.state = staged.state;
      return result;
    } finally {
      this.shared.locked = false;
    }
  }
  async disconnect() { this.disconnected = true; }
  catalog() { return structuredClone(this.state.catalog); }
  coupons() { return structuredClone(this.state.coupons); }
  writes() { return this.shared.writes; }
}

function applyEnv() {
  return {
    ...validEnv,
    SEED_RENDER_DEMO_MODE: "apply",
    SEED_RENDER_DEMO_CONFIRM: RENDER_A2_APPLY_CONFIRMATION,
  };
}

describe("Render demo seed execution", () => {
  it("creates Pool from the validated URL with one explicit verify-full TLS configuration", () => {
    let capturedConfig: ReturnType<typeof renderDemoPoolConfig> | undefined;
    createProductionRenderDemoDatabase(validEnv.DATABASE_URL, (config) => {
      capturedConfig = config;
      return {} as import("pg").Pool;
    });
    expect(capturedConfig).toMatchObject({
      host: RENDER_A2_DATABASE_HOST,
      port: 5432,
      database: "brewlite_a2",
      user: "seed_user",
      ssl: { rejectUnauthorized: true },
    });
    expect(capturedConfig).not.toHaveProperty("connectionString");
    expect((capturedConfig?.ssl as { checkServerIdentity?: unknown }).checkServerIdentity).toBeTypeOf("function");
  });

  it("uses bounded Serializable interactive transaction options", () => {
    expect(RENDER_DEMO_TRANSACTION_OPTIONS).toEqual({
      isolationLevel: "Serializable",
      maxWait: 10_000,
      timeout: 60_000,
    });
  });

  it("limits self-signed TLS to the Internal adapter without weakening External TLS", () => {
    const internal = renderInternalDemoPoolConfig(
      "postgresql://internal_user:example_password@dpg-example-internal:5432/brewlite_a2?sslmode=require",
    );
    const external = renderDemoPoolConfig(validEnv.DATABASE_URL);
    expect(internal.ssl).toEqual({ rejectUnauthorized: false });
    expect(external.ssl).toMatchObject({ rejectUnauthorized: true });
    expect((external.ssl as { checkServerIdentity?: unknown }).checkServerIdentity).toBeTypeOf("function");
  });

  it("rejects an Internal current_user mismatch after connecting", async () => {
    const database = new FakeDatabase({
      identity: { databaseName: "brewlite_a2", currentUser: "unexpected_user", serverAddress: null },
      locked: false, writes: 0, failProductCreate: false,
    });
    await expect(runRenderDemoSeedWithPolicy(
      validEnv,
      () => ({ databaseName: "brewlite_a2", executionMode: "dry-run", expectedUser: "internal_user" }),
      () => database,
      now,
    )).rejects.toMatchObject({ diagnosticCode: "DATABASE_IDENTITY_MISMATCH" });
    expect(database.writes()).toBe(0);
  });

  it("requires an explicit :5432 URL before the database factory is called", async () => {
    let factoryCalls = 0;
    await expect(runRenderDemoSeed({
      ...validEnv,
      DATABASE_URL: validEnv.DATABASE_URL.replace(":5432", ""),
    }, () => {
      factoryCalls += 1;
      return new FakeDatabase();
    }, now)).rejects.toThrow();
    expect(factoryCalls).toBe(0);
  });

  it("dry-run performs only reads and reports planned inserts", async () => {
    const database = new FakeDatabase();
    await expect(runRenderDemoSeed(validEnv, () => database, now)).resolves.toMatchObject({
      mode: "dry-run",
      created: { categories: 4, toppings: 5, products: 9, productToppings: 13, coupons: 5 },
    });
    expect(database.writes()).toBe(0);
    expect(database.transactions).toBe(0);
    expect(database.disconnected).toBe(true);
  });

  it("rejects apply without confirmation before creating a database connection", async () => {
    let factoryCalls = 0;
    await expect(runRenderDemoSeed({ ...validEnv, SEED_RENDER_DEMO_MODE: "apply" }, () => {
      factoryCalls += 1;
      return new FakeDatabase();
    }, now)).rejects.toThrow();
    expect(factoryCalls).toBe(0);
  });

  it("rejects a connected database identity mismatch before writes", async () => {
    const database = new FakeDatabase({
      identity: { databaseName: "other_database", currentUser: "seed_user", serverAddress: "10.0.0.1" },
      locked: false, writes: 0, failProductCreate: false,
    });
    await expect(runRenderDemoSeed(validEnv, () => database, now)).rejects.toMatchObject({
      diagnosticCode: "DATABASE_IDENTITY_MISMATCH",
    });
    expect(database.writes()).toBe(0);
  });

  it("rejects an abnormal catalog before writes", async () => {
    const database = new FakeDatabase(undefined, {
      catalog: { categories: [], toppings: [], products: [{
        id: "unexpected-product", categoryCode: "traditional", name: "Unexpected", price: 1n,
        image: "unexpected", sizePolicy: "STANDARD", isNew: false, isBestseller: false, toppingCodes: [],
      }] },
      coupons: [],
    });
    await expect(runRenderDemoSeed(validEnv, () => database, now)).rejects.toMatchObject({
      diagnosticCode: "CATALOG_DRIFT",
    });
    expect(database.writes()).toBe(0);
  });

  it("is idempotent and preserves existing coupon quota and redemption count", async () => {
    const fixture = promotionFixtures[0]!;
    const database = new FakeDatabase(undefined, {
      catalog: { categories: [], toppings: [], products: [] },
      coupons: [{ ...fixture, startsAt: new Date("2026-11-01T00:00:00.000Z"), expiresAt: new Date("2026-12-01T00:00:00.000Z"), activeUsageCount: 73 }],
    });
    await runRenderDemoSeed(applyEnv(), () => database, now);
    const writesAfterFirstApply = database.writes();
    await runRenderDemoSeed(applyEnv(), () => database, now);
    expect(database.writes()).toBe(writesAfterFirstApply);
    expect(database.catalog().products).toHaveLength(9);
    expect(database.coupons()).toHaveLength(5);
    expect(database.coupons().find((coupon) => coupon.code === fixture.code)?.activeUsageCount).toBe(73);
  });

  it("rolls back all staged writes when an apply step fails", async () => {
    const database = new FakeDatabase({
      identity: { databaseName: "brewlite_a2", currentUser: "seed_user", serverAddress: null },
      locked: false, writes: 0, failProductCreate: true,
    });
    await expect(runRenderDemoSeed(applyEnv(), () => database, now)).rejects.toMatchObject({
      diagnosticCode: "SEED_RUNTIME_ERROR",
    });
    expect(database.catalog().categories).toHaveLength(0);
    expect(database.catalog().products).toHaveLength(0);
    expect(database.coupons()).toHaveLength(0);
  });

  it("prevents concurrent apply from double-inserting", async () => {
    const database = new FakeDatabase();
    const outcomes = await Promise.allSettled([
      runRenderDemoSeed(applyEnv(), () => database, now),
      runRenderDemoSeed(applyEnv(), () => database, now),
    ]);
    expect(outcomes.filter((outcome) => outcome.status === "fulfilled")).toHaveLength(1);
    expect(outcomes.filter((outcome) => outcome.status === "rejected")).toHaveLength(1);
    expect(database.catalog().products).toHaveLength(9);
    expect(database.coupons()).toHaveLength(5);
  });

  it("classifies an identity SQL error as runtime, not a connection failure", async () => {
    const database = new FakeDatabase();
    database.identity = async () => {
      const error = Object.assign(new Error("permission denied"), { code: "42501" });
      throw error;
    };
    await expect(runRenderDemoSeed(validEnv, () => database, now)).rejects.toMatchObject({
      diagnosticCode: "SEED_RUNTIME_ERROR",
    });
  });

  it("classifies an identity ECONNRESET as a database connection failure", async () => {
    const database = new FakeDatabase();
    database.identity = async () => {
      const error = Object.assign(new Error("connection reset"), { code: "ECONNRESET" });
      throw error;
    };
    await expect(runRenderDemoSeed(validEnv, () => database, now)).rejects.toMatchObject({
      diagnosticCode: "DATABASE_CONNECTION_FAILED",
    });
  });

  it("reports a successful apply with failed cleanup as possibly committed and does not roll it back", async () => {
    const database = new FakeDatabase();
    database.disconnect = async () => { throw new Error("cleanup failure"); };
    await expect(runRenderDemoSeed(applyEnv(), () => database, now)).rejects.toMatchObject({
      diagnosticCode: "APPLY_COMMITTED_CLEANUP_FAILED",
    });
    expect(database.catalog().products).toHaveLength(9);
    expect(renderDemoSeedDiagnosticMessage(
      new RenderDemoSeedDiagnosticError("APPLY_COMMITTED_CLEANUP_FAILED"),
    )).toContain("do not retry automatically");
  });

  it("preserves an execution failure when cleanup fails too", async () => {
    const database = new FakeDatabase({
      identity: { databaseName: "brewlite_a2", currentUser: "seed_user", serverAddress: null },
      locked: false, writes: 0, failProductCreate: true,
    });
    database.disconnect = async () => { throw new Error("cleanup failure"); };
    await expect(runRenderDemoSeed(applyEnv(), () => database, now)).rejects.toMatchObject({
      diagnosticCode: "SEED_RUNTIME_ERROR",
    });
    expect(database.catalog().products).toHaveLength(0);
  });

  it("classifies policy, connection, and coupon failures without exposing secrets", async () => {
    await expect(runRenderDemoSeedWithPolicy(
      validEnv,
      () => { throw new Error("postgresql://seed_user:secret_password@unsafe-host"); },
      () => new FakeDatabase(),
      now,
    )).rejects.toMatchObject({ diagnosticCode: "POLICY_REJECTED" });

    const unavailable = new FakeDatabase();
    unavailable.identity = async () => {
      const error = Object.assign(new Error("password=secret_password"), { code: "ECONNRESET" });
      throw error;
    };
    await expect(runRenderDemoSeed(validEnv, () => unavailable, now)).rejects.toMatchObject({
      diagnosticCode: "DATABASE_CONNECTION_FAILED",
    });

    const fixture = promotionFixtures[0]!;
    const couponDrift = new FakeDatabase(undefined, {
      catalog: { categories: [], toppings: [], products: [] },
      coupons: [{ ...fixture, value: fixture.value + 1, startsAt: new Date("2026-11-01"), expiresAt: new Date("2026-12-01"), activeUsageCount: 0 }],
    });
    await expect(runRenderDemoSeed(validEnv, () => couponDrift, now)).rejects.toMatchObject({
      diagnosticCode: "COUPON_DRIFT",
    });

    const secret = "postgresql://seed_user:secret_password@internal-host/brewlite_a2";
    const sensitiveError = new Error(secret);
    sensitiveError.stack = `stack trace ${secret}`;
    expect(renderDemoSeedDiagnosticMessage(sensitiveError)).toBe(
      "Render demo seed failed: SEED_RUNTIME_ERROR",
    );
    for (const code of [
      "POLICY_REJECTED",
      "DATABASE_CONNECTION_FAILED",
      "DATABASE_IDENTITY_MISMATCH",
      "CATALOG_DRIFT",
      "COUPON_DRIFT",
      "SEED_RUNTIME_ERROR",
    ] as const) {
      const error = new RenderDemoSeedDiagnosticError(code);
      expect(renderDemoSeedDiagnosticCode(error)).toBe(code);
      expect(renderDemoSeedDiagnosticMessage(error)).toBe(`Render demo seed failed: ${code}`);
      expect(renderDemoSeedDiagnosticMessage(error)).not.toContain("secret_password");
    }
    expect(renderDemoSeedDiagnosticMessage(sensitiveError)).not.toContain(secret);
    expect(renderDemoSeedDiagnosticMessage(sensitiveError)).not.toContain("stack trace");
  });
});
