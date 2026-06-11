/**
 * Minimal, dependency-free ZIP writer (STORE method — no compression).
 *
 * Skill files are tiny markdown, so compression buys nothing; storing them keeps
 * this to a few dozen lines with no third-party dependency. Produces a valid
 * archive (local headers + central directory + end-of-central-directory) that
 * macOS Archive Utility, Windows Explorer, `unzip`, and Claude's skill uploader
 * all accept.
 */

/** A single entry to place in the archive. `name` may include `/` for folders. */
export type ZipEntry = {
  /** Path inside the archive, e.g. "my-skill/SKILL.md". */
  name: string;
  /** UTF-8 text content. */
  content: string;
};

// --- CRC-32 (IEEE 802.3 polynomial 0xEDB88320), table built once ---------------

const CRC_TABLE: Uint32Array = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// --- ZIP assembly --------------------------------------------------------------

// Fixed DOS timestamp: 1980-01-01 00:00 (date 0x0021, time 0x0000). A constant
// stamp keeps the output deterministic and is accepted by every unzip tool.
const DOS_TIME = 0;
const DOS_DATE = 0x0021;
const UTF8_FLAG = 0x0800; // general-purpose bit 11: filename is UTF-8

/**
 * Build a ZIP archive from text entries and return it as a Blob ready to
 * download. Uses the STORE method (compressed size === uncompressed size).
 */
export function createZipBlob(entries: ZipEntry[]): Blob {
  const encoder = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.name);
    const dataBytes = encoder.encode(entry.content);
    const crc = crc32(dataBytes);
    const size = dataBytes.length;

    // Local file header (30 bytes + name) followed by the stored data.
    const local = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true); // local file header signature
    lv.setUint16(4, 20, true); // version needed to extract (2.0)
    lv.setUint16(6, UTF8_FLAG, true); // general purpose bit flag
    lv.setUint16(8, 0, true); // compression method: 0 = store
    lv.setUint16(10, DOS_TIME, true);
    lv.setUint16(12, DOS_DATE, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, size, true); // compressed size
    lv.setUint32(22, size, true); // uncompressed size
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true); // extra field length
    local.set(nameBytes, 30);

    localParts.push(local, dataBytes);

    // Central directory record (46 bytes + name) for this entry.
    const central = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(central.buffer);
    cv.setUint32(0, 0x02014b50, true); // central directory header signature
    cv.setUint16(4, 20, true); // version made by
    cv.setUint16(6, 20, true); // version needed to extract
    cv.setUint16(8, UTF8_FLAG, true);
    cv.setUint16(10, 0, true); // compression method
    cv.setUint16(12, DOS_TIME, true);
    cv.setUint16(14, DOS_DATE, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, size, true); // compressed size
    cv.setUint32(24, size, true); // uncompressed size
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true); // extra field length
    cv.setUint16(32, 0, true); // file comment length
    cv.setUint16(34, 0, true); // disk number start
    cv.setUint16(36, 0, true); // internal file attributes
    cv.setUint32(38, 0, true); // external file attributes
    cv.setUint32(42, offset, true); // relative offset of local header
    central.set(nameBytes, 46);

    centralParts.push(central);

    offset += local.length + dataBytes.length;
  }

  const centralSize = centralParts.reduce((n, p) => n + p.length, 0);
  const centralOffset = offset;

  // End of central directory record (22 bytes, no archive comment).
  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true); // end of central dir signature
  ev.setUint16(4, 0, true); // number of this disk
  ev.setUint16(6, 0, true); // disk where central directory starts
  ev.setUint16(8, entries.length, true); // central dir records on this disk
  ev.setUint16(10, entries.length, true); // total central dir records
  ev.setUint32(12, centralSize, true); // size of central directory
  ev.setUint32(16, centralOffset, true); // offset of central directory start
  ev.setUint16(20, 0, true); // comment length

  // Concatenate every part into one ArrayBuffer-backed array. (A single buffer
  // also sidesteps the mixed Uint8Array<ArrayBufferLike> typing that the Blob
  // constructor rejects when fed TextEncoder output directly.)
  const parts = [...localParts, ...centralParts, end];
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let cursor = 0;
  for (const part of parts) {
    out.set(part, cursor);
    cursor += part.length;
  }

  return new Blob([out], { type: "application/zip" });
}
