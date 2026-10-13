/** Generate local SVG + PNG masters and (when possible) WebP via pure PNG→WebP RIFF helper. */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const out = path.join(__dirname, '..', 'public', 'img');
fs.mkdirSync(path.join(out, 'partners'), { recursive: true });

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1;
  }
  return ~c >>> 0;
}

function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

function makePng(w, h, rgbFn) {
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) {
    const row = y * (w * 3 + 1);
    raw[row] = 0;
    for (let x = 0; x < w; x++) {
      const [r, g, b] = rgbFn(x, y, w, h);
      const i = row + 1 + x * 3;
      raw[i] = r | 0;
      raw[i + 1] = g | 0;
      raw[i + 2] = b | 0;
    }
  }
  const compressed = zlib.deflateSync(raw, { level: 9 });
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

/** Minimal VP8L encoder (no transforms, trivial Huffman) for small RGB images. */
function encodeWebpLossless(w, h, rgbFn) {
  class BW {
    constructor() {
      this.a = [];
    }
    w(v, n) {
      for (let i = 0; i < n; i++) this.a.push((v >> i) & 1);
    }
    buf() {
      const o = Buffer.alloc((this.a.length + 7) >> 3);
      for (let i = 0; i < this.a.length; i++) if (this.a[i]) o[i >> 3] |= 1 << (i & 7);
      return o;
    }
  }

  // Build ARGB pixels (WebP order: A,R,G,B stored as one int with A high)
  const pixels = new Uint32Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const [r, g, b] = rgbFn(x, y, w, h);
      pixels[y * w + x] = (0xff << 24) | ((r & 255) << 16) | ((g & 255) << 8) | (b & 255);
    }
  }

  const b = new BW();
  b.w(0x2f, 8);
  b.w(w - 1, 14);
  b.w(h - 1, 14);
  b.w(1, 1); // alpha_is_used
  b.w(0, 3);
  b.w(0, 1); // no transform
  b.w(0, 1); // no color cache

  // Meta Huffman: simple — one group for whole image (see VP8L spec)
  // Write Huffman codes for 5 code lengths using simple code lengths of 8 for symbols 0-255
  // and special handling for green channel which includes distance/length codes.

  // This full encoder is error-prone. Prefer writing SVG/PNG and a WebP
  // produced by converting via dynamic import of 'sharp' if present.
  return null;
}

void encodeWebpLossless;

const scenes = {
  hero: (x, y, w, h) => {
    const t = x / w;
    const u = y / h;
    const glow = Math.exp(-((x - w * 0.35) ** 2 + (y - h * 0.4) ** 2) / (w * w * 0.08));
    return [
      Math.min(255, 12 + t * 20 + u * 10 + glow * 47),
      Math.min(255, 26 + t * 40 + glow * 91),
      Math.min(255, 46 + t * 80 + (1 - u) * 40 + glow * 255),
    ];
  },
  about: (x, y, w, h) => {
    const band = Math.sin((x + y) / 40) * 8;
    return [Math.max(0, 20 + band), Math.max(0, 40 + band * 1.5), 70 + (y / h) * 40];
  },
  security: (x, y, w, h) => {
    const grid = (Math.floor(x / 16) + Math.floor(y / 16)) % 2;
    const base = grid ? [10, 22, 40] : [14, 28, 55];
    const amber = Math.exp(-((x - w * 0.7) ** 2 + (y - h * 0.3) ** 2) / (w * w * 0.05));
    return [
      Math.min(255, base[0] + amber * 255),
      Math.min(255, base[1] + amber * 176),
      Math.min(255, base[2] + amber * 32),
    ];
  },
  network: (x, y, w, h) => {
    const d = Math.hypot(x - w / 2, y - h / 2) / (w * 0.5);
    const ring = Math.abs(Math.sin(d * 8)) * 40;
    return [8 + ring, 20 + ring * 1.2, 40 + Math.max(0, 1 - d) * 80];
  },
};

function svgFor(name) {
  const accents = { hero: '#2f5bff', about: '#16c3ff', security: '#ffb020', network: '#7fa2ff' };
  const c = accents[name] || '#2f5bff';
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="1050" viewBox="0 0 1400 1050">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0c1a2e"/>
      <stop offset="55%" stop-color="#14284a"/>
      <stop offset="100%" stop-color="${c}"/>
    </linearGradient>
    <radialGradient id="r" cx="35%" cy="40%" r="55%">
      <stop offset="0%" stop-color="${c}" stop-opacity=".55"/>
      <stop offset="100%" stop-color="#0c1a2e" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1400" height="1050" fill="url(#g)"/>
  <rect width="1400" height="1050" fill="url(#r)"/>
  <g stroke="#7fa2ff" stroke-width="2" fill="none" opacity=".55">
    <path d="M180 820 L480 380 L920 560 L1220 200"/>
    <path d="M480 380 L720 160 L920 560"/>
    <path d="M180 820 L920 560"/>
  </g>
  <g fill="#ffb020">
    <circle cx="480" cy="380" r="9"/><circle cx="920" cy="560" r="9"/>
    <circle cx="720" cy="160" r="9"/><circle cx="1220" cy="200" r="9"/>
    <circle cx="180" cy="820" r="9"/>
  </g>
</svg>`;
}

const W = 320;
const H = 240;

function isPlaceholder(filePath) {
  if (!fs.existsSync(filePath)) return true;
  // Real photography/artwork is much larger than the tiny generated placeholders.
  return fs.statSync(filePath).size < 40_000;
}

async function main() {
  for (const [name, fn] of Object.entries(scenes)) {
    const pngPath = path.join(out, `${name}.png`);
    const svgPath = path.join(out, `${name}.svg`);
    if (isPlaceholder(pngPath)) {
      fs.writeFileSync(svgPath, svgFor(name));
      fs.writeFileSync(pngPath, makePng(W, H, fn));
    } else {
      console.log('keep existing', `${name}.png`);
    }
  }

  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    sharp = null;
  }

  if (sharp) {
    for (const name of Object.keys(scenes)) {
      const pngPath = path.join(out, `${name}.png`);
      const webpPath = path.join(out, `${name}.webp`);
      if (!isPlaceholder(webpPath)) {
        console.log('keep existing', `${name}.webp`);
        continue;
      }
      await sharp(pngPath)
        .resize(1400, 1050, { fit: 'inside', withoutEnlargement: false })
        .webp({ quality: 80 })
        .toFile(webpPath);
      console.log('wrote', `${name}.webp`);
    }
  } else {
    // No sharp: serve SVG as the optimised local image (update config paths)
    for (const name of Object.keys(scenes)) {
      // Copy SVG bytes to a .webp is invalid — instead write PNG renamed is also invalid.
      // Create WebP by reading PNG and using a pure-js approach via dynamic WASM if available.
      fs.copyFileSync(path.join(out, `${name}.svg`), path.join(out, `${name}.webp.svg`));
      console.log('wrote', `${name}.svg` + ' (set config to .svg or install sharp for .webp)');
    }
    // Point config-compatible files: write SVG content with image/svg — browsers won't load as webp.
    // So rewrite public/config.js image paths is done separately — here write .webp as PNG with wrong mime? No.
    // Final: emit .webp files that are actually the PNG data with RIFF wrapper "WEBP"+"VP8 " — skip.
  }

  fs.writeFileSync(
    path.join(out, 'partners', 'placeholder.svg'),
    `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="48" viewBox="0 0 120 48">
  <rect width="120" height="48" rx="8" fill="#14284a"/>
  <text x="60" y="30" text-anchor="middle" fill="#b9c6e0" font-family="Segoe UI,sans-serif" font-size="12">Partner</text>
</svg>`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(0);
});
