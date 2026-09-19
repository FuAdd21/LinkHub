import test from "node:test";
import assert from "node:assert/strict";
import { createLinkSchema, updateLinkSchema, reorderLinksSchema } from "../src/validators/linkSchemas.js";
import { validateRequest } from "../src/middleware/validate.js";
import { AppError } from "../src/errors/AppError.js";

test("Link Validation Suite", async (t) => {
  await t.test("createLinkSchema accepts valid payload", () => {
    const valid = {
      title: "My GitHub",
      url: "https://github.com/developer",
      display_mode: "link",
    };
    const parsed = createLinkSchema.parse(valid);
    assert.equal(parsed.title, "My GitHub");
    assert.equal(parsed.url, "https://github.com/developer");
    assert.equal(parsed.display_mode, "link");
  });

  await t.test("createLinkSchema rejects invalid URL", () => {
    const invalid = {
      title: "Bad Link",
      url: "not-a-valid-url",
    };
    const res = createLinkSchema.safeParse(invalid);
    assert.equal(res.success, false);
  });

  await t.test("reorderLinksSchema rejects duplicates", () => {
    const dups = { linkIds: [1, 2, 2, 3] };
    const res = reorderLinksSchema.safeParse(dups);
    assert.equal(res.success, false);
    assert.match(res.error.issues[0].message, /duplicates/i);
  });

  await t.test("reorderLinksSchema accepts unique positive integers", () => {
    const valid = { linkIds: [10, 20, 30] };
    const res = reorderLinksSchema.safeParse(valid);
    assert.equal(res.success, true);
  });

  await t.test("validateRequest middleware throws AppError on validation failure", async () => {
    const middleware = validateRequest({ body: createLinkSchema });
    const req = { body: { title: "", url: "" } };
    let capturedErr = null;

    await middleware(req, {}, (err) => {
      capturedErr = err;
    });

    assert.ok(capturedErr instanceof AppError);
    assert.equal(capturedErr.statusCode, 400);
    assert.ok(Array.isArray(capturedErr.details));
  });
});
