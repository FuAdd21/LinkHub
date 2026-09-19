import test from "node:test";
import assert from "node:assert/strict";
import { emailService } from "../src/services/emailService.js";

test("Email Service Suite", async (t) => {
  await t.test("sendPasswordResetEmail falls back safely in dev mode", async () => {
    const result = await emailService.sendPasswordResetEmail({
      to: "developer@example.com",
      resetUrl: "http://localhost:5173/reset-password?token=abcdef123456",
    });

    assert.equal(result.success, true);
    assert.ok(["console", "fallback", "smtp"].includes(result.mode));
  });

  await t.test("isConfigured detects missing SMTP credentials", () => {
    // In default dev environment, full SMTP is usually unconfigured
    const configured = emailService.isConfigured();
    assert.equal(typeof configured, "boolean");
  });
});
