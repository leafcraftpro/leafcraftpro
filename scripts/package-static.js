/**
 * ============================================================
 *  Package the static build for a shared-hosting upload.
 *
 *  Why this exists
 *  ---------------
 *  Uploading ~530 small files through a browser file manager is
 *  slow and unreliable, and the hidden `.htaccess` is frequently
 *  dropped in the process — which silently breaks every clean URL.
 *  Shipping one zip avoids both problems: the host's "Extract"
 *  button unpacks dotfiles correctly.
 *
 *  This script zips the CONTENTS of dist/ (not the dist/ folder)
 *  so that extracting the archive straight into public_html puts
 *  index.html at the root. It uses Node's built-in zlib only, so
 *  it needs nothing installed and adds no dependency to the
 *  project.
 *
 *  Run with:  npm run package
 * ============================================================
 */

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const OUT = path.join(ROOT, 'leafcraftpro-site.zip');

// ----------------------------------------------------------------
//  Minimal ZIP writer (stored + deflate), no dependencies.
// ----------------------------------------------------------------

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) >>> 0 : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff >>> 0;
  for (let i = 0; i < buf.length; i++) {
    c = (CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)) >>> 0;
  }
  return (c ^ 0xffffffff) >>> 0;
}

/** Walk a directory and return every file with its archive-relative name. */
function walk(dir, base = dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, base, out);
    else out.push({ full, name: path.relative(base, full).split(path.sep).join('/') });
  }
  return out;
}

/** Build one local file header + data descriptor record. */
function buildEntry(name, data, offset, dosTime, dosDate) {
  const nameBuf = Buffer.from(name, 'utf8');
  const crc = crc32(data);

  // Deflate; fall back to stored if compression made it bigger.
  const deflated = zlib.deflateRawSync(data, { level: 9 });
  const useDeflate = deflated.length < data.length;
  const payload = useDeflate ? deflated : data;
  const method = useDeflate ? 8 : 0;

  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0); // local file header signature
  local.writeUInt16LE(20, 4); // version needed
  local.writeUInt16LE(0x0800, 6); // flags: UTF-8 names
  local.writeUInt16LE(method, 8);
  local.writeUInt16LE(dosTime, 10);
  local.writeUInt16LE(dosDate, 12);
  local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(payload.length, 18);
  local.writeUInt32LE(data.length, 22);
  local.writeUInt16LE(nameBuf.length, 26);
  local.writeUInt16LE(0, 28);

  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0); // central directory signature
  central.writeUInt16LE(20, 4); // version made by
  central.writeUInt16LE(20, 6); // version needed
  central.writeUInt16LE(0x0800, 8);
  central.writeUInt16LE(method, 10);
  central.writeUInt16LE(dosTime, 12);
  central.writeUInt16LE(dosDate, 14);
  central.writeUInt32LE(crc, 16);
  central.writeUInt32LE(payload.length, 20);
  central.writeUInt32LE(data.length, 24);
  central.writeUInt16LE(nameBuf.length, 28);
  central.writeUInt16LE(0, 30); // extra length
  central.writeUInt16LE(0, 32); // comment length
  central.writeUInt16LE(0, 34); // disk number
  central.writeUInt16LE(0, 36); // internal attrs
  // External attributes: regular file, mode 0644, in the high 16 bits.
  // `0o100644 << 16` exceeds 2^31 and becomes a NEGATIVE signed int32,
  // which writeUInt32LE rejects — so force it back into unsigned range.
  central.writeUInt32LE((0o100644 << 16) >>> 0, 38);
  central.writeUInt32LE(offset, 42);

  return {
    localHeader: local,
    centralHeader: central,
    name: nameBuf,
    payload,
    crc,
    compressedSize: payload.length,
    uncompressedSize: data.length,
    method,
  };
}

function toDosTime(date) {
  const time =
    (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const day =
    ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { time, day };
}

function zipDirectory(dir, outFile) {
  if (!fs.existsSync(dir)) {
    throw new Error(`Nothing to package — ${path.relative(ROOT, dir)}/ does not exist. Run "npm run build" first.`);
  }

  const files = walk(dir);
  if (!files.length) throw new Error('dist/ is empty. Run "npm run build" first.');

  const now = new Date();
  const { time: dosTime, day: dosDate } = toDosTime(now);

  const chunks = [];
  const entries = [];
  let offset = 0;

  for (const file of files) {
    const data = fs.readFileSync(file.full);
    const entry = buildEntry(file.name, data, offset, dosTime, dosDate);
    chunks.push(entry.localHeader, entry.name, entry.payload);
    offset += entry.localHeader.length + entry.name.length + entry.payload.length;
    entries.push(entry);
  }

  const centralStart = offset;
  let centralSize = 0;
  for (const e of entries) {
    chunks.push(e.centralHeader, e.name);
    centralSize += e.centralHeader.length + e.name.length;
  }

  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); // end of central directory
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(centralStart, 16);
  end.writeUInt16LE(0, 20);
  chunks.push(end);

  fs.writeFileSync(outFile, Buffer.concat(chunks));

  return { files: entries.length, bytes: fs.statSync(outFile).size };
}

// ----------------------------------------------------------------

try {
  const { files, bytes } = zipDirectory(DIST, OUT);
  console.log('\n  Packaged the static site\n');
  console.log(`    files    : ${files}`);
  console.log(`    archive  : ${path.relative(ROOT, OUT)}`);
  console.log(`    size     : ${(bytes / 1024 / 1024).toFixed(2)} MB\n`);
  console.log('  Upload this zip to public_html on Hostinger and click Extract.');
  console.log('  It unpacks the CONTENTS of dist/, so extract it INTO public_html,');
  console.log('  not into a subfolder. `.htaccess` is included.\n');
} catch (err) {
  console.error(`\n  Packaging failed: ${err.message}\n`);
  process.exit(1);
}
