import test from "node:test";
import assert from "node:assert/strict";
import { isReservedUsername, RESERVED_USERNAMES } from "../src/utils/reservedUsernames.js";

test("Reserved Usernames Suite", async (t) => {
  await t.test("identifies system reserved paths as reserved", () => {
    assert.equal(isReservedUsername("login"), true);
    assert.equal(isReservedUsername("LOGIN"), true);
    assert.equal(isReservedUsername("  register  "), true);
    assert.equal(isReservedUsername("admin"), true);
    assert.equal(isReservedUsername("api"), true);
    assert.equal(isReservedUsername("dashboard"), true);
    assert.equal(isReservedUsername("settings"), true);
    assert.equal(isReservedUsername("health"), true);
    assert.equal(isReservedUsername("r"), true);
  });

  await t.test("allows legitimate usernames", () => {
    assert.equal(isReservedUsername("fuad_developer"), false);
    assert.equal(isReservedUsername("john_doe"), false);
    assert.equal(isReservedUsername("designer99"), false);
    assert.equal(isReservedUsername("linkhub_user"), false);
  });

  await t.test("safely handles falsy values", () => {
    assert.equal(isReservedUsername(""), false);
    assert.equal(isReservedUsername(null), false);
    assert.equal(isReservedUsername(undefined), false);
  });
});
