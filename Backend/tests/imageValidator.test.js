import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import os from "os";
import { validateImageMagicBytes } from "../src/utils/imageValidator.js";

test("Image Upload Magic Byte Validation Suite", async (t) => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "linkhub-img-test-"));

  t.after(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {}
  });

  await t.test("recognizes valid PNG signature", async () => {
    const filePath = path.join(tmpDir, "valid.png");
    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    const pngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
    fs.writeFileSync(filePath, pngHeader);

    const result = await validateImageMagicBytes(filePath);
    assert.equal(result.valid, true);
    assert.equal(result.type, "png");
  });

  await t.test("recognizes valid JPEG signature", async () => {
    const filePath = path.join(tmpDir, "valid.jpg");
    // JPEG signature: FF D8 FF
    const jpegHeader = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
    fs.writeFileSync(filePath, jpegHeader);

    const result = await validateImageMagicBytes(filePath);
    assert.equal(result.valid, true);
    assert.equal(result.type, "jpeg");
  });

  await t.test("recognizes valid WebP signature", async () => {
    const filePath = path.join(tmpDir, "valid.webp");
    // WebP: RIFF (4 bytes) + length (4 bytes) + WEBP (4 bytes)
    const webpHeader = Buffer.from([
      0x52, 0x49, 0x46, 0x46,
      0x24, 0x00, 0x00, 0x00,
      0x57, 0x45, 0x42, 0x50
    ]);
    fs.writeFileSync(filePath, webpHeader);

    const result = await validateImageMagicBytes(filePath);
    assert.equal(result.valid, true);
    assert.equal(result.type, "webp");
  });

  await t.test("rejects spoofed HTML / script masquerading as image", async () => {
    const filePath = path.join(tmpDir, "spoofed.png");
    fs.writeFileSync(filePath, "<html><script>alert('xss')</script></html>");

    const result = await validateImageMagicBytes(filePath);
    assert.equal(result.valid, false);
    assert.equal(result.type, null);
  });

  await t.test("rejects empty or truncated files", async () => {
    const filePath = path.join(tmpDir, "empty.jpg");
    fs.writeFileSync(filePath, Buffer.from([0xff]));

    const result = await validateImageMagicBytes(filePath);
    assert.equal(result.valid, false);
  });
});
