import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { getTestServer, closeTestServer, TestClient } from "./setup.js";

test("Redirect & Click Tracking Integration Suite", async (t) => {
  const { baseUrl, db } = await getTestServer();

  const testUser = {
    name: "Redirect User",
    username: `redir_${crypto.randomBytes(4).toString("hex")}`,
    email: `redir_${crypto.randomBytes(4).toString("hex")}@example.com`,
    password: "Password123!",
  };

  let client;
  let activeLinkId;
  let hiddenLinkId;
  let scheduledLinkId;
  const targetUrl = "https://developer.mozilla.org";

  t.after(async () => {
    try {
      await db.query("DELETE FROM clients WHERE email = ?", [testUser.email]);
    } catch {}
    await closeTestServer();
  });

  await t.test("Setup user and test links", async () => {
    client = new TestClient(baseUrl);
    const reg = await client.request("/register", { method: "POST", body: testUser });
    assert.ok([200, 201].includes(reg.status));

    const login = await client.request("/login", {
      method: "POST",
      body: { email: testUser.email, password: testUser.password },
    });
    assert.equal(login.status, 200);

    // Create active link
    const res1 = await client.request("/api/mylinks", {
      method: "POST",
      body: { title: "MDN Web Docs", url: targetUrl, platform: "globe" },
    });
    activeLinkId = res1.data.link?.id || res1.data.id;
    assert.ok(activeLinkId);

    // Create hidden link
    const res2 = await client.request("/api/mylinks", {
      method: "POST",
      body: { title: "Hidden Link", url: "https://hidden.example.com", platform: "globe" },
    });
    hiddenLinkId = res2.data.link?.id || res2.data.id;
    await client.request(`/api/mylinks/${hiddenLinkId}/visibility`, { method: "PUT" });

    // Create future scheduled link directly in DB
    const [schedRes] = await db.query(
      `INSERT INTO links (user_id, title, url, platform, position, is_visible, scheduled_at)
       VALUES (?, 'Future Link', 'https://future.example.com', 'globe', 99, 1, DATE_ADD(NOW(), INTERVAL 1 DAY))`,
      [res1.data.link?.user_id || login.data.userId]
    );
    scheduledLinkId = schedRes.insertId;
  });

  await t.test("GET /r/:linkId - performs HTTP 302 redirect with Location header", async () => {
    const unauthClient = new TestClient(baseUrl);
    const res = await unauthClient.request(`/r/${activeLinkId}`, {
      redirect: "manual",
    });

    assert.equal(res.status, 302);
    assert.equal(res.headers.get("location"), targetUrl);

    // Give asynchronous click recording 100ms to insert
    await new Promise((resolve) => setTimeout(resolve, 100));

    const [clicks] = await db.query("SELECT * FROM clicks WHERE link_id = ?", [activeLinkId]);
    assert.ok(clicks.length >= 1, "Click event must be logged in database");
  });

  await t.test("GET /r/:linkId - returns 404 for hidden link", async () => {
    const unauthClient = new TestClient(baseUrl);
    const res = await unauthClient.request(`/r/${hiddenLinkId}`, {
      redirect: "manual",
    });
    assert.equal(res.status, 404);
  });

  await t.test("GET /r/:linkId - returns 404 for future-scheduled link", async () => {
    const unauthClient = new TestClient(baseUrl);
    const res = await unauthClient.request(`/r/${scheduledLinkId}`, {
      redirect: "manual",
    });
    assert.equal(res.status, 404);
  });

  await t.test("GET /r/:linkId - returns 404 for non-existent link", async () => {
    const unauthClient = new TestClient(baseUrl);
    const res = await unauthClient.request("/r/999999", {
      redirect: "manual",
    });
    assert.equal(res.status, 404);
  });

  await t.test("GET /r/:linkId - returns 400 for invalid link ID", async () => {
    const unauthClient = new TestClient(baseUrl);
    const res = await unauthClient.request("/r/invalid-id", {
      redirect: "manual",
    });
    assert.equal(res.status, 400);
  });
});
