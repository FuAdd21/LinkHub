import test from "node:test";
import assert from "node:assert/strict";
import { parseSqlStatements } from "../migrations/runner.js";

test("Migration Runner Suite", async (t) => {
  await t.test("parseSqlStatements splits multiple statements and strips comments", () => {
    const rawSql = `
      -- First table
      CREATE TABLE test_one (
        id INT PRIMARY KEY,
        name VARCHAR(50) -- inline comment
      );

      /* Multi line
         comment here */
      CREATE TABLE test_two (
        id INT PRIMARY KEY
      );
    `;

    const statements = parseSqlStatements(rawSql);
    assert.equal(statements.length, 2);
    assert.match(statements[0], /CREATE TABLE test_one/);
    assert.doesNotMatch(statements[0], /-- First table/);
    assert.match(statements[1], /CREATE TABLE test_two/);
    assert.doesNotMatch(statements[1], /Multi line/);
  });

  await t.test("parseSqlStatements handles empty input gracefully", () => {
    assert.deepEqual(parseSqlStatements(""), []);
    assert.deepEqual(parseSqlStatements("   -- only comment\n   "), []);
  });
});
