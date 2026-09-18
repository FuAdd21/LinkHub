import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { getTestServer, closeTestServer, TestClient } from "./setup.js";

test("Authentication Integration Suite", async (t) => {
  const { baseUrl, db } = await getTestServer();

  const testSuffix = crypto.randomBytes(4).toString("hex");
  const testUser = {
    name: "Test Auth User",
    username: `authuser_${testSuffix}`,
    email: `auth_${testSuffix}@example.com`,
    password: "Password123!",
  };

  t.after(async () => {
    // Clean up created user
    try {
      await db.query("DELETE FROM clients WHERE email = ?", [testUser.email]);
    } catch {}
    await closeTestServer();
  });

  await t.test("POST /register - successfully registers a new user", async () => {
    const client = new TestClient(baseUrl);
    const res = await client.request("/register", {
      method: "POST",
      body: testUser,
    });

    assert.ok([200, 201].includes(res.status), `Expected 200 or 201, got ${res.status}`);
    assert.ok(res.data.clientId || res.data.message);
  });

  await t.test("POST /register - rejects duplicate email or username with 409", async () => {
    const client = new TestClient(baseUrl);
    const res = await client.request("/register", {
      method: "POST",
      body: testUser,
    });

    assert.equal(res.status, 409);
  });

  await t.test("POST /login - returns HTTP-only cookie and does NOT leak JWT in body", async () => {
    const client = new TestClient(baseUrl);
    const res = await client.request("/login", {
      method: "POST",
      body: {
        email: testUser.email,
        password: testUser.password,
      },
    });

    assert.equal(res.status, 200);
    // JWT must NOT be returned in response JSON
    assert.equal(res.data.token, undefined);
    assert.equal(res.data.message, "Login successful");

    // Check that HTTP-only token cookie and csrf_token cookie are set
    const tokenCookie = client.getCookie("token");
    const csrfCookie = client.getCookie("csrf_token");
    assert.ok(tokenCookie, "token cookie must be present");
    assert.ok(csrfCookie, "csrf_token cookie must be present");
  });

  await t.test("GET /api/users/me - succeeds with HTTP-only cookie", async () => {
    const client = new TestClient(baseUrl);
    await client.request("/login", {
      method: "POST",
      body: {
        email: testUser.email,
        password: testUser.password,
      },
    });

    const profileRes = await client.request("/api/users/me");
    assert.equal(profileRes.status, 200);
    assert.equal(profileRes.data.email, testUser.email);
    assert.equal(profileRes.data.name, testUser.name);
  });

  await t.test("Session Invalidation: Changing password revokes old session token", async () => {
    const clientA = new TestClient(baseUrl);
    // Login to get session A
    await clientA.request("/login", {
      method: "POST",
      body: {
        email: testUser.email,
        password: testUser.password,
      },
    });

    // Verify session A works
    const check1 = await clientA.request("/api/users/me");
    assert.equal(check1.status, 200);

    // Save old token prior to password change
    const oldToken = clientA.getCookie("token");

    // Change password via clientA
    const newPassword = "NewPassword456!";
    const changeRes = await clientA.request("/api/users/password", {
      method: "PUT",
      body: {
        currentPassword: testUser.password,
        newPassword: newPassword,
      },
    });
    assert.equal(changeRes.status, 200);

    // Any client using the OLD token must now be rejected because session_version was incremented
    const staleClient = new TestClient(baseUrl);
    staleClient.cookies.set("token", oldToken);
    const check2 = await staleClient.request("/api/users/me");
    assert.ok([401, 403].includes(check2.status), `Expected 401 or 403, got ${check2.status}`);

    // Update password reference for cleanup
    testUser.password = newPassword;

    // Login with new password should succeed and yield a working token
    const clientB = new TestClient(baseUrl);
    const loginB = await clientB.request("/login", {
      method: "POST",
      body: {
        email: testUser.email,
        password: newPassword,
      },
    });
    assert.equal(loginB.status, 200);
    const checkB = await clientB.request("/api/users/me");
    assert.equal(checkB.status, 200);
  });
});
