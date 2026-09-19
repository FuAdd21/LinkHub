import test from "node:test";
import assert from "node:assert/strict";
import { authService } from "../src/services/authService.js";
import { AppError } from "../src/errors/AppError.js";

test("Auth Service Unit Suite", async (t) => {
  await t.test("validatePassword enforces requirements", () => {
    assert.equal(authService.validatePassword("short"), "Password must be at least 8 characters");
    assert.equal(authService.validatePassword("nouppercase1!"), "Password must contain at least one uppercase letter");
    assert.equal(authService.validatePassword("NoNumbersHere!"), "Password must contain at least one number");
    assert.equal(authService.validatePassword("ValidPassword123!"), null);
  });

  await t.test("registerUser throws AppError on missing credentials", async () => {
    await assert.rejects(
      async () => authService.registerUser({ name: "", email: "", password: "" }),
      (err) => {
        assert.ok(err instanceof AppError);
        assert.equal(err.statusCode, 400);
        return true;
      }
    );
  });

  await t.test("registerUser throws AppError on invalid email", async () => {
    await assert.rejects(
      async () => authService.registerUser({ name: "Alice", email: "not-an-email", password: "Password1!" }),
      (err) => {
        assert.ok(err instanceof AppError);
        assert.equal(err.statusCode, 400);
        assert.match(err.message, /valid email/i);
        return true;
      }
    );
  });

  await t.test("loginUser throws AppError on missing credentials", async () => {
    await assert.rejects(
      async () => authService.loginUser({ email: "", password: "" }),
      (err) => {
        assert.ok(err instanceof AppError);
        assert.equal(err.statusCode, 400);
        return true;
      }
    );
  });

  await t.test("resetPassword throws AppError on missing token or weak password", async () => {
    await assert.rejects(
      async () => authService.resetPassword({ token: "", newPassword: "" }),
      (err) => {
        assert.ok(err instanceof AppError);
        assert.equal(err.statusCode, 400);
        return true;
      }
    );

    await assert.rejects(
      async () => authService.resetPassword({ token: "some-token", newPassword: "weak" }),
      (err) => {
        assert.ok(err instanceof AppError);
        assert.equal(err.statusCode, 400);
        return true;
      }
    );
  });
});
