import { Pool } from "pg";
import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { promotionFixtures } from "../prisma/seed-compose-coupons.policy.js";
import {
  createProductionRenderDemoDatabase,
  type RenderDemoExecutionPolicy,
  renderDemoSeedDiagnosticCode,
  runRenderDemoSeedWithPolicy,
} from "../prisma/seed-render-demo.js";

const enabled = process.env.SEED_RENDER_PG_INTEGRATION === "1";
const databaseUrl = process.env.SEED_RENDER_INTEGRATION_DATABASE_URL;
const testDatabaseName = "brewlite_seed_once_guard_test";
const now = new Date("2026-11-12T00:00:00.000Z");

function assertIsolatedLocalTestUrl(value: string): void {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error("SEED_RENDER_INTEGRATION_DATABASE_URL must be a valid PostgreSQL URL.");
  }
  const databaseName = decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
  if (
    !["postgres:", "postgresql:"].includes(parsed.protocol) ||
    parsed.hostname !== "127.0.0.1" ||
    parsed.port !== "15432" ||
    databaseName !== testDatabaseName ||
    !parsed.username ||
    !parsed.password
  ) {
    throw new Error(
      "REFUSE: integration target must be the isolated local 127.0.0.1:15432/brewlite_seed_once_guard_test database.",
    );
  }
}

describe.skipIf(!enabled)("Render demo seed one-shot guard on PostgreSQL", () => {
  let pool: Pool;
  let expectedUser: string;

  function policy(executionMode: "dry-run" | "apply"): RenderDemoExecutionPolicy {
    return { databaseName: testDatabaseName, executionMode, expectedUser };
  }

  async function run(executionMode: "dry-run" | "apply") {
    return runRenderDemoSeedWithPolicy(
      { DATABASE_URL: databaseUrl },
      () => policy(executionMode),
      (connectionString) => createProductionRenderDemoDatabase(
        connectionString,
        // The External adapter remains strict. This test-only local pool is plaintext
        // because the isolated recovery PostgreSQL listener does not terminate TLS.
        (config) => new Pool({ ...config, ssl: false }),
      ),
      now,
    );
  }

  async function apply() {
    return run("apply");
  }

  async function counts() {
    const [row] = (await pool.query<{
      categories: string;
      toppings: string;
      products: string;
      productToppings: string;
      coupons: string;
      markers: string;
    }>(`
      SELECT
        (SELECT count(*) FROM categories) AS "categories",
        (SELECT count(*) FROM toppings) AS "toppings",
        (SELECT count(*) FROM products) AS "products",
        (SELECT count(*) FROM product_toppings) AS "productToppings",
        (SELECT count(*) FROM coupons) AS "coupons",
        (SELECT count(*) FROM seed_executions WHERE seed_key = 'render-demo-v1') AS "markers"
    `)).rows;
    if (!row) throw new Error("Integration count query returned no row.");
    return Object.fromEntries(Object.entries(row).map(([key, value]) => [key, Number(value)]));
  }

  async function assertNoDependentRows(): Promise<void> {
    const [row] = (await pool.query<{
      orders: string;
      orderItems: string;
      orderItemToppings: string;
      couponRedemptions: string;
      payments: string;
      paymentGatewayEvents: string;
    }>(`
      SELECT
        (SELECT count(*) FROM orders) AS "orders",
        (SELECT count(*) FROM order_items) AS "orderItems",
        (SELECT count(*) FROM order_item_toppings) AS "orderItemToppings",
        (SELECT count(*) FROM coupon_redemptions) AS "couponRedemptions",
        (SELECT count(*) FROM payments) AS "payments",
        (SELECT count(*) FROM payment_gateway_events) AS "paymentGatewayEvents"
    `)).rows;
    if (!row || Object.values(row).some((count) => Number(count) !== 0)) {
      throw new Error("REFUSE: isolated test database contains Order, Payment, or Coupon redemption dependent rows.");
    }
  }

  async function removeMarkerFailureTrigger(): Promise<void> {
    try {
      await pool.query("DROP TRIGGER IF EXISTS reject_render_demo_seed_marker ON seed_executions");
    } finally {
      await pool.query("DROP FUNCTION IF EXISTS reject_render_demo_seed_marker()");
    }
  }

  async function resetSeedState(): Promise<void> {
    await assertNoDependentRows();
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      // Explicit child-to-parent deletion avoids TRUNCATE's FK restrictions and
      // does not touch Orders, Payments, Users, or the migration-created categories.
      await client.query("DELETE FROM product_toppings");
      await client.query("DELETE FROM products");
      await client.query("DELETE FROM toppings");
      await client.query("DELETE FROM coupons");
      await client.query("DELETE FROM seed_executions WHERE seed_key = 'render-demo-v1'");
      await client.query("DELETE FROM categories WHERE code = 'unexpected'");
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  beforeAll(async () => {
    if (!databaseUrl) {
      throw new Error("Set SEED_RENDER_INTEGRATION_DATABASE_URL only for the isolated local test database.");
    }
    assertIsolatedLocalTestUrl(databaseUrl);
    pool = new Pool({ connectionString: databaseUrl, ssl: false });
    const [identity] = (await pool.query<{ databaseName: string; currentUser: string }>(
      'SELECT current_database() AS "databaseName", current_user AS "currentUser"',
    )).rows;
    if (!identity || identity.databaseName !== testDatabaseName) {
      throw new Error("REFUSE: connected database identity did not match the isolated test database.");
    }
    expectedUser = identity.currentUser;
    const [{ count: migrationCount }] = (await pool.query<{ count: string }>(
      "SELECT count(*) FROM _prisma_migrations WHERE migration_name = '20261112153000_seed_executions_once_guard' AND finished_at IS NOT NULL AND rolled_back_at IS NULL",
    )).rows;
    if (Number(migrationCount) !== 1) {
      throw new Error("REFUSE: the isolated test database does not have completed migration 10.");
    }
    await removeMarkerFailureTrigger();
    await resetSeedState();
    const initial = await counts();
    if (
      initial.categories !== 4 ||
      initial.toppings !== 0 ||
      initial.products !== 0 ||
      initial.productToppings !== 0 ||
      initial.coupons !== 0 ||
      initial.markers !== 0
    ) {
      throw new Error("REFUSE: isolated test database does not contain only the expected four migration-created categories.");
    }
    const [{ count: markerCount }] = (await pool.query<{ count: string }>(
      "SELECT count(*) FROM seed_executions",
    )).rows;
    if (Number(markerCount) !== 0) {
      throw new Error("REFUSE: isolated test database contains an unexpected completion marker.");
    }
    await expect(run("dry-run")).resolves.toMatchObject({
      created: { categories: 0, toppings: 5, products: 9, productToppings: 13, coupons: 5 },
    });
  });

  beforeEach(async () => {
    // These operations run only after the beforeAll local-target identity gate.
    await removeMarkerFailureTrigger();
    await resetSeedState();
  });

  afterAll(async () => {
    if (!pool) return;
    try {
      await removeMarkerFailureTrigger();
    } finally {
      await pool.end();
    }
  });

  it("commits demo data and exactly one completion marker on first Apply", async () => {
    await expect(apply()).resolves.toMatchObject({
      created: { categories: 0, toppings: 5, products: 9, productToppings: 13, coupons: 5 },
    });
    expect(await counts()).toEqual({
      categories: 4, toppings: 5, products: 9, productToppings: 13, coupons: 5, markers: 1,
    });
  });

  it("performs zero additional writes on second Apply", async () => {
    await apply();
    const beforeRetry = await counts();
    await expect(apply()).resolves.toMatchObject({
      created: { categories: 0, toppings: 0, products: 0, productToppings: 0, coupons: 0 },
    });
    expect(await counts()).toEqual(beforeRetry);
  });

  it("rolls back staged data and marker when PostgreSQL rejects marker insertion", async () => {
    await pool.query(`
      CREATE FUNCTION reject_render_demo_seed_marker() RETURNS trigger LANGUAGE plpgsql AS $$
      BEGIN RAISE EXCEPTION 'test-only marker failure'; END;
      $$;
      CREATE TRIGGER reject_render_demo_seed_marker
      BEFORE INSERT ON seed_executions
      FOR EACH ROW EXECUTE FUNCTION reject_render_demo_seed_marker();
    `);
    try {
      await expect(apply()).rejects.toSatisfy((error: unknown) =>
        renderDemoSeedDiagnosticCode(error) === "SEED_RUNTIME_ERROR",
      );
      expect(await counts()).toEqual({
        categories: 4, toppings: 0, products: 0, productToppings: 0, coupons: 0, markers: 0,
      });
    } finally {
      await removeMarkerFailureTrigger();
    }
  });

  it("does not duplicate data or markers across concurrent Apply attempts", async () => {
    const results = await Promise.allSettled([apply(), apply()]);
    expect(results.some((result) => result.status === "fulfilled")).toBe(true);
    expect(await counts()).toEqual({
      categories: 4, toppings: 5, products: 9, productToppings: 13, coupons: 5, markers: 1,
    });
  });

  it("fails closed when a marker exists but expected data is missing", async () => {
    await pool.query("INSERT INTO seed_executions (seed_key) VALUES ('render-demo-v1')");
    await expect(apply()).rejects.toSatisfy((error: unknown) =>
      renderDemoSeedDiagnosticCode(error) === "SEED_RUNTIME_ERROR",
    );
    expect(await counts()).toEqual({
      categories: 4, toppings: 0, products: 0, productToppings: 0, coupons: 0, markers: 1,
    });
  });

  it("fails closed when a marker exists with catalog or coupon drift", async () => {
    await pool.query("INSERT INTO seed_executions (seed_key) VALUES ('render-demo-v1')");
    await pool.query(
      "INSERT INTO categories (id, code, name, is_active) VALUES ($1, 'unexpected', 'Unexpected', true)",
      [randomUUID()],
    );
    await expect(apply()).rejects.toSatisfy((error: unknown) =>
      renderDemoSeedDiagnosticCode(error) === "CATALOG_DRIFT",
    );
    expect(await counts()).toMatchObject({ categories: 5, markers: 1 });

    await pool.query("DELETE FROM categories WHERE code = 'unexpected'");
    await pool.query("DELETE FROM seed_executions WHERE seed_key = 'render-demo-v1'");
    await pool.query("INSERT INTO seed_executions (seed_key) VALUES ('render-demo-v1')");
    const fixture = promotionFixtures[0]!;
    await pool.query(
      "INSERT INTO coupons (id, code, type, value, min_subtotal_vnd, max_discount_vnd, usage_limit, per_user_limit, starts_at, expires_at, active_usage_count) VALUES ($1, $2, $3::coupon_type, $4, $5, $6, $7, $8, $9, $10, 0)",
      [randomUUID(), fixture.code, fixture.type, fixture.value + 1, fixture.minSubtotalVnd, fixture.maxDiscountVnd, fixture.usageLimit, fixture.perUserLimit, now, new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)],
    );
    await expect(apply()).rejects.toSatisfy((error: unknown) =>
      renderDemoSeedDiagnosticCode(error) === "COUPON_DRIFT",
    );
  });
});
