/**
 * Composite the transparent logo onto the exact nav/footer plate colour
 * so the rectangular artwork blends flush with header and footer.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PLATE = { r: 9, g: 20, b: 39 }; // #091427
const ROOT = path.join(__dirname, '..');
const LOGO = path.join(ROOT, 'public', 'img', 'logo.png');
const PLATE_FILE = path.join(ROOT, 'public', 'img', 'logo-plate.txt');

async function main() {
  const meta = await sharp(LOGO).metadata();
  const { width, height } = meta;

  const plate = await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: PLATE,
    },
  })
    .png()
    .toBuffer();

  // Flatten transparency onto the plate colour (keeps symbol + white type)
  await sharp(plate)
    .composite([{ input: LOGO, blend: 'over' }])
    .removeAlpha()
    .ensureAlpha()
    .png()
    .toFile(LOGO + '.tmp');

  // Verify: corners must be exact plate colour
  const { data, info } = await sharp(LOGO + '.tmp')
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const sample = (x, y) => {
    const i = (y * info.width + x) * 4;
    return [data[i], data[i + 1], data[i + 2], data[i + 3]];
  };

  const corners = [
    sample(0, 0),
    sample(info.width - 1, 0),
    sample(0, info.height - 1),
    sample(info.width - 1, info.height - 1),
  ];

  for (const [r, g, b] of corners) {
    if (r !== PLATE.r || g !== PLATE.g || b !== PLATE.b) {
      throw new Error(`Corner mismatch: got ${r},${g},${b}`);
    }
  }

  fs.renameSync(LOGO + '.tmp', LOGO);
  fs.writeFileSync(PLATE_FILE, '#091427\n', 'utf8');
  console.log(
    JSON.stringify(
      {
        ok: true,
        size: `${info.width}x${info.height}`,
        plate: '#091427',
        corners,
        bytes: fs.statSync(LOGO).size,
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
