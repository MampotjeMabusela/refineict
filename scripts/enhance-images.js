/**
 * Rebuild every public/img photo at higher resolution + quality.
 * Picks the sharpest existing variant as master, then writes HQ WebP + fallback.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMG = path.join(__dirname, '..', 'public', 'img');
const STAGING = path.join(IMG, '_enhanced_staging');

const JOBS = [
  { base: 'hero-bg', webp: true, fallback: 'jpg', targetW: 2560, fit: 'inside' },
  { base: 'contact-bg', webp: true, fallback: 'jpg', targetW: 2560, fit: 'inside' },
  { base: 'about-bg', webp: true, fallback: 'jpg', targetW: 2560, fit: 'inside' },
  { base: 'contact-cloud', webp: true, fallback: 'jpg', targetW: 1920, fit: 'inside' },
  { base: 'services-bg', webp: true, fallback: 'jpg', targetW: 3200, fit: 'inside' },
  { base: 'about', webp: true, fallback: 'png', targetW: 2400, fit: 'inside' },
  { base: 'security', webp: true, fallback: 'jpg', targetW: 2400, fit: 'inside' },
  { base: 'faq', webp: true, fallback: 'png', targetW: 2400, fit: 'inside' },
  { base: 'hero', webp: true, fallback: 'png', targetW: 1800, fit: 'inside' },
  { base: 'network', webp: true, fallback: 'png', targetW: 1800, fit: 'inside' },
  { base: 'service-managed-it', webp: true, fallback: 'png', targetW: 2560, fit: 'inside' },
  { base: 'service-cybersecurity', webp: true, fallback: 'jpg', targetW: 2560, fit: 'inside' },
  { base: 'service-cloud', webp: true, fallback: 'jpg', targetW: 2560, fit: 'inside' },
  { base: 'service-network', webp: true, fallback: 'jpg', targetW: 2560, fit: 'inside' },
  { base: 'service-backup', webp: true, fallback: 'jpg', targetW: 2560, fit: 'inside' },
  { base: 'service-software', webp: true, fallback: 'jpg', targetW: 2560, fit: 'inside' },
  { base: 'service-website', webp: true, fallback: 'jpg', targetW: 2560, fit: 'inside' },
  { base: 'service-consulting', webp: true, fallback: 'jpg', targetW: 2560, fit: 'inside' },
  { base: 'service-hardware', webp: true, fallback: 'jpg', targetW: 2560, fit: 'inside' },
  { base: 'service-voip', webp: true, fallback: 'jpg', targetW: 2560, fit: 'inside' },
  { base: 'service-analytics', webp: true, fallback: 'jpg', targetW: 2560, fit: 'inside' },
  { base: 'service-support', webp: true, fallback: 'jpg', targetW: 2560, fit: 'inside' },
  { base: 'logo', webp: true, fallback: null, targetW: 742, fit: 'inside', noUpscale: false },
];

async function candidates(base) {
  const exts = ['.png', '.jpg', '.jpeg', '.webp'];
  const list = [];
  for (const ext of exts) {
    const file = path.join(IMG, base + ext);
    if (!fs.existsSync(file)) continue;
    try {
      const meta = await sharp(file).metadata();
      const pixels = (meta.width || 0) * (meta.height || 0);
      const bytes = fs.statSync(file).size;
      // Prefer larger pixel count; break ties with file size (more detail usually)
      list.push({ file, ext, width: meta.width, height: meta.height, pixels, bytes });
    } catch {
      /* skip unreadable */
    }
  }
  list.sort((a, b) => b.pixels - a.pixels || b.bytes - a.bytes);
  return list;
}

async function writeSafe(pipeline, outPath) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const info = await pipeline.toFile(outPath);
  return info;
}

async function finalizeStaging() {
  const files = fs.readdirSync(STAGING);
  const failed = [];
  for (const name of files) {
    const from = path.join(STAGING, name);
    const to = path.join(IMG, name);
    let ok = false;
    for (let i = 0; i < 5 && !ok; i++) {
      try {
        fs.copyFileSync(from, to);
        fs.unlinkSync(from);
        ok = true;
      } catch (err) {
        await new Promise((r) => setTimeout(r, 200));
        if (i === 4) failed.push(`${name}: ${err.message}`);
      }
    }
  }
  try {
    fs.rmSync(STAGING, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
  if (failed.length) {
    console.warn('Some files need a manual copy:\n' + failed.join('\n'));
  }
}

async function enhanceOne(job) {
  const list = await candidates(job.base);
  if (!list.length) {
    console.warn('skip (missing)', job.base);
    return null;
  }

  // Prefer largest non-webp as master when sizes are close, to avoid re-encoding artifacts.
  // Otherwise use the largest pixel source.
  const master = list[0];
  // Buffer master once so we can overwrite same-path outputs safely
  const masterBuf = await fs.promises.readFile(master.file);

  const webpPath = path.join(STAGING, `${job.base}.webp`);
  const webpInfo = await writeSafe(
    sharp(masterBuf)
      .rotate()
      .resize({
        width: job.targetW,
        height: null,
        fit: job.fit || 'inside',
        withoutEnlargement: Boolean(job.noUpscale),
        kernel: sharp.kernel.lanczos3,
      })
      .webp({
        quality: 92,
        alphaQuality: 100,
        effort: 6,
        smartSubsample: true,
      }),
    webpPath
  );

  let fallbackInfo = null;
  if (job.fallback === 'jpg') {
    const jpgPath = path.join(STAGING, `${job.base}.jpg`);
    fallbackInfo = await writeSafe(
      sharp(masterBuf)
        .rotate()
        .resize({
          width: job.targetW,
          fit: job.fit || 'inside',
          withoutEnlargement: Boolean(job.noUpscale),
          kernel: sharp.kernel.lanczos3,
        })
        .jpeg({
          quality: 90,
          mozjpeg: true,
          chromaSubsampling: '4:4:4',
        }),
      jpgPath
    );
  } else if (job.fallback === 'png') {
    const pngPath = path.join(STAGING, `${job.base}.png`);
    fallbackInfo = await writeSafe(
      sharp(masterBuf)
        .rotate()
        .resize({
          width: job.targetW,
          fit: job.fit || 'inside',
          withoutEnlargement: Boolean(job.noUpscale),
          kernel: sharp.kernel.lanczos3,
        })
        .png({ compressionLevel: 9, adaptiveFiltering: true }),
      pngPath
    );
  }

  return {
    base: job.base,
    master: path.basename(master.file),
    webp: `${webpInfo.width}x${webpInfo.height} ${Math.round(webpInfo.size / 1024)}KB`,
    fallback: fallbackInfo
      ? `${fallbackInfo.width}x${fallbackInfo.height} ${Math.round(fallbackInfo.size / 1024)}KB`
      : null,
    w: webpInfo.width,
    h: webpInfo.height,
  };
}

async function main() {
  if (fs.existsSync(STAGING)) {
    fs.rmSync(STAGING, { recursive: true, force: true });
  }
  fs.mkdirSync(STAGING, { recursive: true });

  const results = [];
  for (const job of JOBS) {
    const r = await enhanceOne(job);
    if (r) {
      results.push(r);
      console.log(
        `${r.base.padEnd(24)} from ${r.master.padEnd(28)} → webp ${r.webp}` +
          (r.fallback ? ` | fallback ${r.fallback}` : '')
      );
    }
  }

  // Keep light logo variant in sync with the polished mark
  const logo = path.join(IMG, 'logo.png');
  if (fs.existsSync(logo)) {
    const buf = await fs.promises.readFile(logo);
    await writeSafe(sharp(buf).webp({ quality: 95, effort: 6 }), path.join(STAGING, 'logo.webp'));
    await writeSafe(sharp(buf).png({ compressionLevel: 9 }), path.join(STAGING, 'logo-light.png'));
  }

  await finalizeStaging();

  const dimsPath = path.join(IMG, 'enhanced-dims.json');
  const dims = Object.fromEntries(results.map((r) => [r.base, { w: r.w, h: r.h }]));
  fs.writeFileSync(dimsPath, JSON.stringify(dims, null, 2));
  console.log('\nWrote', dimsPath);
  console.log('Enhanced', results.length, 'image sets.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
