import test from "node:test";
import assert from "node:assert/strict";
import { AppError } from "../src/errors/AppError.js";
import { ErrorCodes } from "../src/errors/errorCodes.js";
import { errorHandler, notFoundHandler } from "../src/errors/errorHandler.js";

test("Error System Suite", async (t) => {
  await t.test("AppError instances and static factories", () => {
    const err = AppError.badRequest("Invalid title", ErrorCodes.VALIDATION_ERROR, [
      { field: "title", message: "Required" },
    ]);
    assert.equal(err.name, "AppError");
    assert.equal(err.statusCode, 400);
    assert.equal(err.code, ErrorCodes.VALIDATION_ERROR);
    assert.equal(err.message, "Invalid title");
    assert.deepEqual(err.details, [{ field: "title", message: "Required" }]);
    assert.equal(err.isOperational, true);

    const unauth = AppError.unauthorized();
    assert.equal(unauth.statusCode, 401);
    assert.equal(unauth.code, ErrorCodes.UNAUTHORIZED);

    const forbidden = AppError.forbidden();
    assert.equal(forbidden.statusCode, 403);
    assert.equal(forbidden.code, ErrorCodes.FORBIDDEN);

    const notFound = AppError.notFound();
    assert.equal(notFound.statusCode, 404);
    assert.equal(notFound.code, ErrorCodes.NOT_FOUND);

    const conflict = AppError.conflict("User exists", ErrorCodes.DUPLICATE_EMAIL);
    assert.equal(conflict.statusCode, 409);
    assert.equal(conflict.code, ErrorCodes.DUPLICATE_EMAIL);

    const rate = AppError.tooManyRequests();
    assert.equal(rate.statusCode, 429);
    assert.equal(rate.code, ErrorCodes.RATE_LIMITED);

    const internal = AppError.internal();
    assert.equal(internal.statusCode, 500);
    assert.equal(internal.isOperational, false);
  });

  await t.test("ErrorCodes contains expected definitions", () => {
    assert.equal(ErrorCodes.VALIDATION_ERROR, "VALIDATION_ERROR");
    assert.equal(ErrorCodes.LINK_NOT_FOUND, "LINK_NOT_FOUND");
    assert.equal(ErrorCodes.RATE_LIMITED, "RATE_LIMITED");
    assert.equal(ErrorCodes.INTERNAL_ERROR, "INTERNAL_ERROR");
  });

  await t.test("errorHandler normalizes AppError correctly", () => {
    const err = AppError.badRequest("Validation failed", ErrorCodes.VALIDATION_ERROR, [
      { field: "email" },
    ]);

    let responseStatus = null;
    let responseBody = null;
    const req = { method: "POST", originalUrl: "/api/test" };
    const res = {
      headersSent: false,
      status(code) {
        responseStatus = code;
        return this;
      },
      json(body) {
        responseBody = body;
        return this;
      },
    };

    errorHandler(err, req, res, () => {});

    assert.equal(responseStatus, 400);
    assert.equal(responseBody.success, false);
    assert.equal(responseBody.message, "Validation failed");
    assert.equal(responseBody.error.code, ErrorCodes.VALIDATION_ERROR);
    assert.equal(responseBody.error.message, "Validation failed");
    assert.deepEqual(responseBody.error.details, [{ field: "email" }]);
  });

  await t.test("notFoundHandler invokes next with 404 AppError", () => {
    const req = { method: "GET", originalUrl: "/unknown-route" };
    let passedErr = null;
    notFoundHandler(req, {}, (err) => {
      passedErr = err;
    });

    assert.ok(passedErr instanceof AppError);
    assert.equal(passedErr.statusCode, 404);
    assert.equal(passedErr.code, ErrorCodes.NOT_FOUND);
  });
});
