import test from "node:test";
import assert from "node:assert/strict";
import {
  createCredentialSchema,
  updateCredentialSchema,
} from "../src/validators/projectSchemas.js";

test("Credentials Architecture & Validation Suite", async (t) => {
  await t.test("accepts valid certification payload", () => {
    const valid = {
      title: "Google Cloud Certified Professional Cloud Architect",
      issuer: "Google Cloud",
      year: 2025,
      url: "https://google.accredible.com/123456",
    };
    const parsed = createCredentialSchema.parse(valid);
    assert.equal(parsed.title, valid.title);
    assert.equal(parsed.issuer, "Google Cloud");
    assert.equal(parsed.year, 2025);
  });

  await t.test("allows optional url and issuer", () => {
    const minimal = {
      title: "Bachelor of Science in Computer Science",
    };
    const parsed = createCredentialSchema.parse(minimal);
    assert.equal(parsed.title, minimal.title);
    assert.equal(parsed.year, undefined);
  });

  await t.test("updateCredentialSchema allows partial updates", () => {
    const update = {
      year: 2026,
    };
    const parsed = updateCredentialSchema.parse(update);
    assert.equal(parsed.year, 2026);
    assert.equal(parsed.title, undefined);
  });
});
