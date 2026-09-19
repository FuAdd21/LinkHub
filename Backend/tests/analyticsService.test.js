import test from "node:test";
import assert from "node:assert/strict";
import { hashIp, detectDevice, analyticsService } from "../src/services/analyticsService.js";
import { AppError } from "../src/errors/AppError.js";

test("Analytics Service Suite", async (t) => {
  await t.test("hashIp produces deterministic 32-char hex string", () => {
    const hash1 = hashIp("192.168.1.1");
    const hash2 = hashIp("192.168.1.1");
    const hash3 = hashIp("10.0.0.1");

    assert.equal(typeof hash1, "string");
    assert.equal(hash1.length, 32);
    assert.equal(hash1, hash2);
    assert.notEqual(hash1, hash3);
    assert.equal(hashIp(null), null);
    assert.equal(hashIp(""), null);
  });

  await t.test("detectDevice correctly classifies User-Agent strings", () => {
    assert.equal(
      detectDevice("Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15"),
      "mobile"
    );
    assert.equal(
      detectDevice("Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15"),
      "tablet"
    );
    assert.equal(
      detectDevice("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0"),
      "desktop"
    );
    assert.equal(detectDevice(""), "desktop");
  });

  await t.test("trackClick rejects invalid linkId with AppError", async () => {
    await assert.rejects(
      async () => analyticsService.trackClick("not-a-number", { ip: "127.0.0.1" }),
      (err) => {
        assert.ok(err instanceof AppError);
        assert.equal(err.statusCode, 400);
        return true;
      }
    );
  });

  await t.test("trackProfileView rejects missing username with AppError", async () => {
    await assert.rejects(
      async () => analyticsService.trackProfileView("", { ip: "127.0.0.1" }),
      (err) => {
        assert.ok(err instanceof AppError);
        assert.equal(err.statusCode, 400);
        return true;
      }
    );
  });
});
