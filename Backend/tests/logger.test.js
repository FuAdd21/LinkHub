import test from "node:test";
import assert from "node:assert/strict";
import { sanitize, logger, requestLogger } from "../src/config/logger.js";

test("Structured Logger Suite", async (t) => {
  await t.test("sanitize masks sensitive fields", () => {
    const sensitiveData = {
      name: "John Doe",
      email: "john@example.com",
      password: "SuperSecretPassword123!",
      nested: {
        token: "jwt.token.here",
        apiKey: "xyz-123-api-key",
        normalKey: "safe value",
      },
      arrayField: [
        { csrf_token: "csrf-token-abc", publicInfo: "allowed" },
      ],
    };

    const sanitized = sanitize(sensitiveData);

    assert.equal(sanitized.name, "John Doe");
    assert.equal(sanitized.email, "john@example.com");
    assert.equal(sanitized.password, "[REDACTED]");
    assert.equal(sanitized.nested.token, "[REDACTED]");
    assert.equal(sanitized.nested.apiKey, "[REDACTED]");
    assert.equal(sanitized.nested.normalKey, "safe value");
    assert.equal(sanitized.arrayField[0].csrf_token, "[REDACTED]");
    assert.equal(sanitized.arrayField[0].publicInfo, "allowed");
  });

  await t.test("sanitize handles circular references safely", () => {
    const circularObj = { name: "test" };
    circularObj.self = circularObj;

    const sanitized = sanitize(circularObj);
    assert.equal(sanitized.name, "test");
    assert.equal(sanitized.self, "[Circular]");
  });

  await t.test("logger exposes debug, info, warn, error methods", () => {
    assert.equal(typeof logger.debug, "function");
    assert.equal(typeof logger.info, "function");
    assert.equal(typeof logger.warn, "function");
    assert.equal(typeof logger.error, "function");

    // Calling them should not throw
    logger.debug("Test debug message");
    logger.info("Test info message", { detail: "ok" });
    logger.warn("Test warning message");
    logger.error("Test error message", new Error("Sample error"));
  });

  await t.test("requestLogger attaches requestId and sets header", (t, done) => {
    const req = {
      headers: {},
      method: "GET",
      originalUrl: "/api/test",
      ip: "127.0.0.1",
    };

    let headerSet = null;
    let finishHandler = null;

    const res = {
      statusCode: 200,
      setHeader(name, value) {
        if (name === "X-Request-Id") headerSet = value;
      },
      on(event, handler) {
        if (event === "finish") finishHandler = handler;
      },
    };

    requestLogger(req, res, () => {
      assert.ok(req.id, "Request ID should be assigned");
      assert.equal(headerSet, req.id, "Header should match request ID");
      assert.equal(typeof finishHandler, "function");
      finishHandler(); // Trigger finish event
      done();
    });
  });
});
