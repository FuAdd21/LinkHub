import test from "node:test";
import assert from "node:assert/strict";
import { SocialProvider } from "../src/services/social/SocialProvider.js";
import { PLATFORM_METADATA } from "../src/services/social/types.js";
import { socialService } from "../src/services/socialService.js";
import { AppError } from "../src/errors/AppError.js";

test("Social Architecture Suite", async (t) => {
  await t.test("SocialProvider base class normalizes responses cleanly", () => {
    const provider = new SocialProvider("github", PLATFORM_METADATA.github);
    const normalized = provider.normalizeResponse({
      handle: "@developer",
      name: "Dev User",
      followers: 1250,
      repos: 14,
    });

    assert.equal(normalized.provider, "github");
    assert.equal(normalized.handle, "@developer");
    assert.equal(normalized.followers, 1250);
    assert.equal(normalized.formattedFollowers, "1.3K");
    assert.equal(normalized.repos, 14);
    assert.equal(normalized.label, "FOLLOWERS");
    assert.equal(normalized.status, "connected");
  });

  await t.test("SocialProvider validates handles", () => {
    const provider = new SocialProvider("youtube", PLATFORM_METADATA.youtube);
    assert.equal(provider.validateHandle("@mkbhd"), "@mkbhd");
    assert.throws(
      () => provider.validateHandle(""),
      (err) => err instanceof AppError && err.statusCode === 400
    );
  });

  await t.test("socialService previewIntegration rejects unsupported platforms", async () => {
    await assert.rejects(
      async () => socialService.previewIntegration("unsupported_xyz", "somehandle"),
      (err) => {
        assert.ok(err instanceof AppError);
        assert.equal(err.statusCode, 400);
        return true;
      }
    );
  });

  await t.test("socialService generic fallback returns expected shape", async () => {
    const data = await socialService.fetchProviderData("twitter", "@elonmusk");
    assert.equal(data.handle, "@elonmusk");
    assert.equal(data.label, "FOLLOWERS");
  });

  await t.test("PLATFORM_METADATA includes Telegram with subscriber label", () => {
    assert.ok(PLATFORM_METADATA.telegram);
    assert.equal(PLATFORM_METADATA.telegram.label, "SUBSCRIBERS");
    assert.equal(PLATFORM_METADATA.telegram.color, "#229ed9");
  });

  await t.test("Telegram service rejects empty handles", async () => {
    const { getTelegramProfile } = await import("../src/services/telegramService.js");
    await assert.rejects(
      async () => getTelegramProfile(""),
      (err) => err instanceof AppError && err.statusCode === 400
    );
  });
});
