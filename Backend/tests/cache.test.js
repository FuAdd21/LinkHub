import test from "node:test";
import assert from "node:assert/strict";
import { profileCache } from "../src/utils/cache.js";

test("MemoryCache & Profile Cache Invalidation Suite", async (t) => {
  profileCache.clear();

  await t.test("stores and retrieves cached profile entries", () => {
    profileCache.setProfile("testuser", 42, { name: "Test User", bio: "Developer" }, 60);

    const cached = profileCache.get("profile:testuser");
    assert(cached !== null);
    assert.equal(cached.name, "Test User");
  });

  await t.test("case-insensitively retrieves and invalidates profiles", () => {
    profileCache.setProfile("AbyssiniaDev", 99, { name: "Abyssinia" }, 60);

    const hit = profileCache.get("profile:abyssiniadev");
    assert.equal(hit.name, "Abyssinia");

    profileCache.invalidateProfile("ABYSSINIADEV");
    assert.equal(profileCache.get("profile:abyssiniadev"), null);
  });

  await t.test("invalidates profile via user ID reverse index", () => {
    profileCache.setProfile("solomon", 777, { name: "Solomon" }, 60);
    assert.notEqual(profileCache.get("profile:solomon"), null);

    profileCache.invalidateUser(777);
    assert.equal(profileCache.get("profile:solomon"), null);
  });

  await t.test("respects TTL expiration", async () => {
    profileCache.set("temp_key", "temporary_val", 0.05); // 50ms TTL
    assert.equal(profileCache.get("temp_key"), "temporary_val");

    await new Promise((resolve) => setTimeout(resolve, 70));
    assert.equal(profileCache.get("temp_key"), null);
  });
});
