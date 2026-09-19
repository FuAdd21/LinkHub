import fs from "fs";

/**
 * Validates image files by verifying magic bytes (file signature) on disk.
 * Protects against MIME-type spoofing and polyglot files.
 * Supported formats: JPEG, PNG, GIF, WEBP.
 *
 * @param {string} filePath - Absolute path to the uploaded file.
 * @returns {Promise<{ valid: boolean, type: string|null }>}
 */
export async function validateImageMagicBytes(filePath) {
  let fileHandle;
  try {
    fileHandle = await fs.promises.open(filePath, "r");
    const buffer = Buffer.alloc(12);
    const { bytesRead } = await fileHandle.read(buffer, 0, 12, 0);

    if (bytesRead < 4) {
      return { valid: false, type: null };
    }

    // JPEG signature: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return { valid: true, type: "jpeg" };
    }

    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    if (
      bytesRead >= 8 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    ) {
      return { valid: true, type: "png" };
    }

    // GIF signature: GIF87a or GIF89a (47 49 46 38 37/39 61)
    if (
      bytesRead >= 6 &&
      buffer[0] === 0x47 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x38 &&
      (buffer[4] === 0x37 || buffer[4] === 0x39) &&
      buffer[5] === 0x61
    ) {
      return { valid: true, type: "gif" };
    }

    // WebP signature: RIFF (4 bytes) + file size (4 bytes) + WEBP (4 bytes)
    if (
      bytesRead >= 12 &&
      buffer[0] === 0x52 && // R
      buffer[1] === 0x49 && // I
      buffer[2] === 0x46 && // F
      buffer[3] === 0x46 && // F
      buffer[8] === 0x57 && // W
      buffer[9] === 0x45 && // E
      buffer[10] === 0x42 && // B
      buffer[11] === 0x50 // P
    ) {
      return { valid: true, type: "webp" };
    }

    return { valid: false, type: null };
  } catch {
    return { valid: false, type: null };
  } finally {
    if (fileHandle) {
      await fileHandle.close().catch(() => {});
    }
  }
}
