import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { getTestServer, closeTestServer, TestClient } from "./setup.js";

test("Links Integration Suite", async (t) => {
  const { baseUrl, db } = await getTestServer();

  const userA = {
    name: "User A",
    username: `usera_${crypto.randomBytes(4).toString("hex")}`,
    email: `usera_${crypto.randomBytes(4).toString("hex")}@example.com`,
    password: "Password123!",
  };

  const userB = {
    name: "User B",
    username: `userb_${crypto.randomBytes(4).toString("hex")}`,
    email: `userb_${crypto.randomBytes(4).toString("hex")}@example.com`,
    password: "Password123!",
  };

  let clientA;
  let clientB;
  let link1Id;
  let link2Id;

  t.after(async () => {
    try {
      await db.query("DELETE FROM clients WHERE email IN (?, ?)", [userA.email, userB.email]);
    } catch {}
    await closeTestServer();
  });

  await t.test("Setup test accounts", async () => {
    clientA = new TestClient(baseUrl);
    clientB = new TestClient(baseUrl);

    // Register User A & User B
    const regA = await clientA.request("/register", { method: "POST", body: userA });
    assert.ok([200, 201].includes(regA.status));
    const regB = await clientB.request("/register", { method: "POST", body: userB });
    assert.ok([200, 201].includes(regB.status));

    // Login both
    const loginA = await clientA.request("/login", {
      method: "POST",
      body: { email: userA.email, password: userA.password },
    });
    assert.equal(loginA.status, 200);

    const loginB = await clientB.request("/login", {
      method: "POST",
      body: { email: userB.email, password: userB.password },
    });
    assert.equal(loginB.status, 200);
  });

  await t.test("POST /api/mylinks - rejects unauthenticated requests", async () => {
    const unauthClient = new TestClient(baseUrl);
    const res = await unauthClient.request("/api/mylinks", {
      method: "POST",
      body: { title: "Test", url: "https://example.com" },
    });
    assert.equal(res.status, 401);
  });

  await t.test("POST /api/mylinks - creates links with sequential positions", async () => {
    const res1 = await clientA.request("/api/mylinks", {
      method: "POST",
      body: { title: "GitHub Profile", url: "https://github.com", platform: "github" },
    });
    assert.ok([200, 201].includes(res1.status));
    link1Id = res1.data.link?.id || res1.data.id;
    assert.ok(link1Id, "Link 1 must have an ID");

    const res2 = await clientA.request("/api/mylinks", {
      method: "POST",
      body: { title: "Twitter Profile", url: "https://twitter.com", platform: "twitter" },
    });
    assert.ok([200, 201].includes(res2.status));
    link2Id = res2.data.link?.id || res2.data.id;
    assert.ok(link2Id, "Link 2 must have an ID");

    const getRes = await clientA.request("/api/mylinks");
    assert.equal(getRes.status, 200);
    const links = Array.isArray(getRes.data) ? getRes.data : getRes.data.links;
    assert.equal(links.length, 2);
    // Ordered by position asc
    assert.equal(links[0].id, link1Id);
    assert.equal(links[1].id, link2Id);
  });

  await t.test("Cross-User Isolation: User B cannot modify or delete User A's link", async () => {
    // Attempt update
    const updateRes = await clientB.request(`/api/mylinks/${link1Id}`, {
      method: "PUT",
      body: { title: "Hacked Title", url: "https://hacked.com" },
    });
    assert.ok([403, 404].includes(updateRes.status));

    // Attempt delete
    const deleteRes = await clientB.request(`/api/mylinks/${link1Id}`, {
      method: "DELETE",
    });
    assert.ok([403, 404].includes(deleteRes.status));
  });

  await t.test("PUT /api/mylinks/order - validates and safely reorders links", async () => {
    // Reorder with duplicates should fail
    const dupRes = await clientA.request("/api/mylinks/order", {
      method: "PUT",
      body: { order: [link1Id, link1Id] },
    });
    assert.equal(dupRes.status, 400);

    // Reorder with non-existent or foreign link ID should fail
    const foreignRes = await clientA.request("/api/mylinks/order", {
      method: "PUT",
      body: { order: [link1Id, 999999] },
    });
    assert.ok([400, 403].includes(foreignRes.status));

    // Valid swap: [link2Id, link1Id]
    const swapRes = await clientA.request("/api/mylinks/order", {
      method: "PUT",
      body: { order: [link2Id, link1Id] },
    });
    assert.equal(swapRes.status, 200);

    // Verify order
    const listRes = await clientA.request("/api/mylinks");
    assert.equal(listRes.status, 200);
    const links = Array.isArray(listRes.data) ? listRes.data : listRes.data.links;
    assert.equal(links[0].id, link2Id);
    assert.equal(links[1].id, link1Id);
  });
});
