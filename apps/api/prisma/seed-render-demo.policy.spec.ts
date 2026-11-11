import { describe, expect, it } from "vitest";
import {
  RENDER_A2_APPLY_CONFIRMATION,
  RENDER_A2_DATABASE_HOST,
  renderDemoSeedPreconditions,
  validateRenderDemoSeedPolicy,
} from "./seed-render-demo.policy.js";

const safeUrl = `postgresql://seed_user:example_password@${RENDER_A2_DATABASE_HOST}:5432/brewlite_a2?sslmode=verify-full`;
const validEnv = {
  NODE_ENV: "development",
  SEED_RENDER_DEMO_ENV: "render-a2-manual",
  DATABASE_URL: safeUrl,
};

describe("Render A2 demo seed policy", () => {
  it("accepts a valid dry-run configuration by default", () => {
    expect(validateRenderDemoSeedPolicy(validEnv)).toEqual({
      databaseName: "brewlite_a2",
      executionMode: "dry-run",
      readOnly: true,
      preconditions: renderDemoSeedPreconditions,
    });
  });

  it("allows schema=public for a Prisma-compatible URL", () => {
    expect(
      validateRenderDemoSeedPolicy({
        ...validEnv,
        DATABASE_URL: `${safeUrl}&schema=public`,
      }),
    ).toMatchObject({ executionMode: "dry-run", readOnly: true });
  });

  it("accepts apply only when every condition and the exact confirmation are valid", () => {
    expect(
      validateRenderDemoSeedPolicy({
        ...validEnv,
        SEED_RENDER_DEMO_MODE: "apply",
        SEED_RENDER_DEMO_CONFIRM: RENDER_A2_APPLY_CONFIRMATION,
      }),
    ).toMatchObject({ executionMode: "apply", readOnly: false });
  });

  it.each([
    "postgresql://seed_user:example_password@other.render.com:5432/brewlite_a2?sslmode=verify-full",
    "postgresql://seed_user:example_password@localhost:5432/brewlite_a2?sslmode=verify-full",
    "postgresql://seed_user:example_password@127.0.0.1:5432/brewlite_a2?sslmode=verify-full",
    "postgresql://seed_user:example_password@postgres:5432/brewlite_a2?sslmode=verify-full",
  ])("rejects an unapproved hostname in dry-run", (DATABASE_URL) => {
    expect(() => validateRenderDemoSeedPolicy({ ...validEnv, DATABASE_URL })).toThrow();
  });

  it.each([
    safeUrl.replace(":5432/", ":15432/"),
    safeUrl.replace("/brewlite_a2", "/brewlite_other"),
    safeUrl.replace("postgresql:", "mysql:"),
    "not a URL",
    safeUrl.replace("seed_user:example_password@", "seed_user@"),
    safeUrl.replace("seed_user:example_password@", ":example_password@"),
  ])("rejects malformed or invalid connection targets in dry-run", (DATABASE_URL) => {
    expect(() => validateRenderDemoSeedPolicy({ ...validEnv, DATABASE_URL })).toThrow();
  });

  it.each([
    safeUrl.replace("sslmode=verify-full", "sslmode=disable"),
    safeUrl.replace("sslmode=verify-full", "sslmode=require"),
    safeUrl.replace("?sslmode=verify-full", ""),
  ])("rejects unsafe TLS configuration", (DATABASE_URL) => {
    expect(() => validateRenderDemoSeedPolicy({ ...validEnv, DATABASE_URL })).toThrow();
  });

  it.each([
    `${safeUrl}&host=localhost`,
    `${safeUrl}&socket=/tmp/postgres`,
    `${safeUrl}&service=other-service`,
    `${safeUrl}&sslcert=untrusted.pem`,
    `${safeUrl}&application_name=seed`,
    `${safeUrl}&schema=other`,
  ])("rejects URL query parameters outside the strict allowlist", (DATABASE_URL) => {
    expect(() => validateRenderDemoSeedPolicy({ ...validEnv, DATABASE_URL })).toThrow();
  });

  it.each([
    safeUrl.replace("sslmode", "SSLMODE"),
    safeUrl.replace("sslmode", "SslMode"),
    `${safeUrl}&Schema=public`,
  ])("rejects non-canonical query parameter casing", (DATABASE_URL) => {
    expect(() => validateRenderDemoSeedPolicy({ ...validEnv, DATABASE_URL })).toThrow();
  });

  it.each([
    `${safeUrl}&sslmode=verify-full`,
    `${safeUrl}&SSLMODE=verify-full`,
    `${safeUrl}&schema=public&SCHEMA=public`,
  ])("rejects duplicate query parameters regardless of casing", (DATABASE_URL) => {
    expect(() => validateRenderDemoSeedPolicy({ ...validEnv, DATABASE_URL })).toThrow();
  });

  it.each([undefined, "render-a2-automatic", "compose"])(
    "rejects missing or invalid SEED_RENDER_DEMO_ENV: %s",
    (SEED_RENDER_DEMO_ENV) => {
      expect(() =>
        validateRenderDemoSeedPolicy({ ...validEnv, SEED_RENDER_DEMO_ENV }),
      ).toThrow();
    },
  );

  it.each([undefined, "APPLY_RENDER_DEMO_brewlite_other", "apply"])(
    "rejects apply without the exact confirmation: %s",
    (SEED_RENDER_DEMO_CONFIRM) => {
      expect(() =>
        validateRenderDemoSeedPolicy({
          ...validEnv,
          SEED_RENDER_DEMO_MODE: "apply",
          SEED_RENDER_DEMO_CONFIRM,
        }),
      ).toThrow();
    },
  );

  it("rejects apply when the target is unsafe even with the exact confirmation", () => {
    expect(() =>
      validateRenderDemoSeedPolicy({
        ...validEnv,
        DATABASE_URL: safeUrl.replace(":5432/", ":15432/"),
        SEED_RENDER_DEMO_MODE: "apply",
        SEED_RENDER_DEMO_CONFIRM: RENDER_A2_APPLY_CONFIRMATION,
      }),
    ).toThrow();
  });

  it.each(["write", "production", "DRY-RUN"])(
    "rejects unsupported execution mode %s",
    (SEED_RENDER_DEMO_MODE) => {
      expect(() =>
        validateRenderDemoSeedPolicy({ ...validEnv, SEED_RENDER_DEMO_MODE }),
      ).toThrow();
    },
  );

  it.each(["production", "render-demo-manual", "test", undefined])(
    "rejects an unapproved NODE_ENV: %s",
    (NODE_ENV) => {
      expect(() => validateRenderDemoSeedPolicy({ ...validEnv, NODE_ENV })).toThrow();
    },
  );

  it("rejects a missing DATABASE_URL", () => {
    expect(() =>
      validateRenderDemoSeedPolicy({ ...validEnv, DATABASE_URL: undefined }),
    ).toThrow();
  });
});
