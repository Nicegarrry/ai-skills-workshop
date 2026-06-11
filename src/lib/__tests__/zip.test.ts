import { describe, it, expect } from "vitest";
import { createZipBlob } from "@/lib/zip";

/**
 * Verify the hand-rolled ZIP writer produces a structurally valid archive. We
 * don't decompress here (STORE method stores bytes verbatim), so we assert the
 * signatures, the stored file bytes, and the central-directory bookkeeping that
 * unzip tools rely on.
 */

const SIG_LOCAL = 0x04034b50;
const SIG_CENTRAL = 0x02014b50;
const SIG_END = 0x06054b50;

async function toView(blob: Blob): Promise<DataView> {
  const buf = await blob.arrayBuffer();
  return new DataView(buf);
}

describe("createZipBlob", () => {
  it("returns an application/zip blob with the end-of-central-directory record", async () => {
    const blob = createZipBlob([{ name: "a.txt", content: "hello" }]);
    expect(blob.type).toBe("application/zip");

    const view = await toView(blob);
    // EOCD is the last 22 bytes (no archive comment).
    const eocdOffset = view.byteLength - 22;
    expect(view.getUint32(eocdOffset, true)).toBe(SIG_END);
    expect(view.getUint16(eocdOffset + 10, true)).toBe(1); // total entries
  });

  it("starts with a local file header and records every entry centrally", async () => {
    const entries = [
      { name: "my-skill/SKILL.md", content: "# skill" },
      { name: "my-skill/voice.md", content: "# voice" },
    ];
    const blob = createZipBlob(entries);
    const view = await toView(blob);

    expect(view.getUint32(0, true)).toBe(SIG_LOCAL);

    const eocdOffset = view.byteLength - 22;
    expect(view.getUint16(eocdOffset + 8, true)).toBe(entries.length);
    expect(view.getUint16(eocdOffset + 10, true)).toBe(entries.length);

    // The central directory begins at the recorded offset with its signature.
    const cdOffset = view.getUint32(eocdOffset + 16, true);
    expect(view.getUint32(cdOffset, true)).toBe(SIG_CENTRAL);
  });

  it("stores file content verbatim (STORE method, sizes match)", async () => {
    const content = "Subject: hi\n\nFull body, not truncated.\n\nBest,\nMe";
    const blob = createZipBlob([{ name: "email.md", content }]);
    const view = await toView(blob);

    // Compressed size (offset 18) === uncompressed size (offset 22) for STORE.
    const compressed = view.getUint32(18, true);
    const uncompressed = view.getUint32(22, true);
    const expectedLen = new TextEncoder().encode(content).length;
    expect(compressed).toBe(expectedLen);
    expect(uncompressed).toBe(expectedLen);

    // The stored bytes follow the 30-byte header + filename and match the input.
    const nameLen = view.getUint16(26, true);
    const dataStart = 30 + nameLen;
    const stored = new Uint8Array(
      view.buffer,
      dataStart,
      expectedLen,
    );
    expect(new TextDecoder().decode(stored)).toBe(content);
  });
});
