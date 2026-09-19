import test from "node:test";
import assert from "node:assert/strict";
import {
  createProjectSchema,
  updateProjectSchema,
  reorderProjectsSchema,
  createCredentialSchema,
} from "../src/validators/projectSchemas.js";

test("Projects & Credentials Validation Suite", async (t) => {
  await t.test("createProjectSchema accepts valid project payload", () => {
    const payload = {
      title: "Fintech Dashboard",
      description: "A real-time financial tracking and visualization platform",
      url: "https://fintech.example.com",
      role: "Lead Frontend Engineer",
      technologies: ["React", "TypeScript", "TailwindCSS"],
      featured: true,
    };
    const parsed = createProjectSchema.parse(payload);
    assert.equal(parsed.title, "Fintech Dashboard");
    assert.equal(parsed.technologies?.length, 3);
    assert.equal(parsed.featured, true);
  });

  await t.test("createProjectSchema rejects invalid URL", () => {
    const payload = {
      title: "Invalid App",
      url: "not-a-valid-url",
    };
    assert.throws(() => createProjectSchema.parse(payload), /Must be a valid project URL/);
  });

  await t.test("createProjectSchema rejects empty title", () => {
    const payload = {
      title: "",
    };
    assert.throws(() => createProjectSchema.parse(payload), /Project title is required/);
  });

  await t.test("reorderProjectsSchema enforces positive integers", () => {
    const valid = { order: [10, 20, 30] };
    const parsed = reorderProjectsSchema.parse(valid);
    assert.deepEqual(parsed.order, [10, 20, 30]);

    const invalid = { order: [] };
    assert.throws(() => reorderProjectsSchema.parse(invalid), /Order array must not be empty/);
  });

  await t.test("createCredentialSchema accepts valid certificate payload", () => {
    const payload = {
      title: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      year: 2024,
      url: "https://aws.amazon.com/verification/123",
    };
    const parsed = createCredentialSchema.parse(payload);
    assert.equal(parsed.title, "AWS Certified Solutions Architect");
    assert.equal(parsed.year, 2024);
  });
});
