import test from "node:test";
import assert from "node:assert/strict";
import { createLinkSchema, updateLinkSchema, reorderLinksSchema } from "../src/validators/linkSchemas.js";
import { createProjectSchema, createCredentialSchema } from "../src/validators/projectSchemas.js";
import { registerSchema, loginSchema } from "../src/validators/authSchemas.js";

test("Input Validation & Attack Vector Rejection Suite", async (t) => {
  await t.test("rejects javascript: and pseudo-protocol URIs in links", () => {
    const maliciousUrls = [
      "javascript:alert(document.cookie)",
      "vbscript:msgbox('hacked')",
      "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==",
      "file:///etc/passwd",
    ];

    for (const url of maliciousUrls) {
      assert.throws(
        () => createLinkSchema.parse({ title: "Exploit", url }),
        /Invalid URL format/i,
        `Expected ${url} to be rejected`
      );
    }
  });

  await t.test("rejects javascript: URLs in showcase projects", () => {
    assert.throws(
      () => createProjectSchema.parse({ title: "Project", url: "javascript:evil()" }),
      /Must be a valid project URL/i
    );
  });

  await t.test("rejects oversized input payloads to prevent memory exhaustion", () => {
    const longTitle = "a".repeat(300); // max is 255
    assert.throws(
      () => createLinkSchema.parse({ title: longTitle, url: "https://example.com" }),
      /cannot exceed 255/i
    );

    const hugeBio = "b".repeat(5000);
    assert.throws(
      () => createProjectSchema.parse({ title: "Title", description: hugeBio }),
      /too long/i
    );
  });

  await t.test("enforces strict email formatting and rejects injection characters", () => {
    const invalidEmails = [
      "not-an-email",
      "user@domain..com",
      "user@localhost",
      "<script>alert(1)</script>@test.com",
    ];

    for (const email of invalidEmails) {
      assert.throws(
        () => loginSchema.parse({ email, password: "ValidPassword123!" }),
        /valid email/i,
        `Expected ${email} to be rejected`
      );
    }
  });

  await t.test("rejects reorder arrays containing negative, zero, or float IDs", () => {
    const invalidArrays = [
      [-1, 2, 3],
      [0, 1, 2],
      [1.5, 2.5],
      ["one", "two"],
    ];

    for (const arr of invalidArrays) {
      assert.throws(
        () => reorderLinksSchema.parse({ order: arr }),
        /(Expected (integer|number)|Number must be greater than 0|positive)/i
      );
    }
  });

  await t.test("validates credential graduation / award year boundaries", () => {
    assert.throws(
      () => createCredentialSchema.parse({ title: "Cert", year: 1800 }),
      /Number must be greater than or equal to 1950/i
    );
    assert.throws(
      () => createCredentialSchema.parse({ title: "Cert", year: 3000 }),
      /Number must be less than or equal to 2100/i
    );
  });
});
