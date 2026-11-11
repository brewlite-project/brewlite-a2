import { describe, expect, it } from "vitest";
import {
  RENDER_INTERNAL_APPLY_CONFIRMATION,
  validateRenderInternalSeedPolicy,
} from "./seed-render-internal.policy.js";

const host = "dpg-example-internal";
const user = "brewlite_a2_user";
const url = `postgresql://${user}:example_password@${host}:5432/brewlite_a2?sslmode=require`;
const valid = {
  NODE_ENV: "production",
  SEED_RENDER_INTERNAL_ENV: "render-a2-internal-manual",
  SEED_RENDER_INTERNAL_EXPECTED_HOST: host,
  SEED_RENDER_INTERNAL_EXPECTED_USER: user,
  DATABASE_URL: url,
};

describe("Render Internal demo seed policy", () => {
  it("accepts only a configured exact target in dry-run by default", () => {
    expect(validateRenderInternalSeedPolicy(valid)).toMatchObject({
      executionMode: "dry-run",
      readOnly: true,
      expectedHost: host,
      expectedUser: user,
    });
  });

  it("accepts apply only with the exact confirmation", () => {
    expect(validateRenderInternalSeedPolicy({
      ...valid,
      SEED_RENDER_INTERNAL_MODE: "apply",
      SEED_RENDER_INTERNAL_CONFIRM: RENDER_INTERNAL_APPLY_CONFIRMATION,
    })).toMatchObject({ executionMode: "apply", readOnly: false });
  });

  it.each([
    url.replace(":5432/", ":15432/"),
    url.replace(`@${host}`, "@other-internal"),
    url.replace(`/${"brewlite_a2"}`, "/other_database"),
    url.replace(user, "other_user"),
    url.replace("postgresql:", "postgres:"),
    url.replace("sslmode=require", "sslmode=disable"),
    url.replace("?sslmode=require", ""),
    `${url}&host=other-internal`,
    `${url}&sslmode=require`,
    `${url}&SSLMODE=require`,
  ])("rejects an unsafe or ambiguous Internal URL", (DATABASE_URL) => {
    expect(() => validateRenderInternalSeedPolicy({ ...valid, DATABASE_URL })).toThrow();
  });

  it.each([undefined, "localhost", "postgres"])("rejects missing or unsafe expected host %s", (SEED_RENDER_INTERNAL_EXPECTED_HOST) => {
    expect(() => validateRenderInternalSeedPolicy({ ...valid, SEED_RENDER_INTERNAL_EXPECTED_HOST })).toThrow();
  });

  it.each([undefined, "wrong_user"])("rejects missing or mismatched expected user %s", (SEED_RENDER_INTERNAL_EXPECTED_USER) => {
    expect(() => validateRenderInternalSeedPolicy({ ...valid, SEED_RENDER_INTERNAL_EXPECTED_USER })).toThrow();
  });

  it.each(["development", "test", undefined])("rejects an unapproved runtime %s", (NODE_ENV) => {
    expect(() => validateRenderInternalSeedPolicy({ ...valid, NODE_ENV })).toThrow();
  });

  it.each([undefined, "wrong", "APPLY_RENDER_INTERNAL_brewlite_other"])("rejects apply confirmation %s", (SEED_RENDER_INTERNAL_CONFIRM) => {
    expect(() => validateRenderInternalSeedPolicy({
      ...valid,
      SEED_RENDER_INTERNAL_MODE: "apply",
      SEED_RENDER_INTERNAL_CONFIRM,
    })).toThrow();
  });
});
