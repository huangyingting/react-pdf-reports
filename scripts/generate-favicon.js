#!/usr/bin/env node
const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const pngToIcoModule = require('png-to-ico');
const pngToIco = typeof pngToIcoModule === 'function' ? pngToIcoModule : pngToIcoModule.default;

if (typeof pngToIco !== 'function') {
  throw new TypeError('png-to-ico did not provide a callable export.');
}

const SVG_SOURCE = path.resolve(__dirname, '../public/docgen-icon.svg');
const OUTPUT_PATH = path.resolve(__dirname, '../public/favicon.ico');
const ICO_SIZES = [16, 24, 32, 48, 64];
const PNG_OUTPUTS = [
  { size: 192, filename: 'logo192.png' },
  { size: 512, filename: 'logo512.png' },
];

async function ensureSvg() {
  try {
    await fs.access(SVG_SOURCE);
  } catch (error) {
    throw new Error(`SVG source not found at ${SVG_SOURCE}`);
  }
}

async function rasterize(svgBuffer, size) {
  return sharp(svgBuffer)
    .resize(size, size, { fit: 'contain' })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function generatePngBuffers(svgBuffer) {
  return Promise.all(ICO_SIZES.map((size) => rasterize(svgBuffer, size)));
}

async function writePngAssets(svgBuffer) {
  await Promise.all(
    PNG_OUTPUTS.map(async ({ size, filename }) => {
      const pngBuffer = await rasterize(svgBuffer, size);
      const outputPath = path.resolve(__dirname, '../public', filename);
      await fs.writeFile(outputPath, pngBuffer);
      console.log(`Generated ${size}x${size} PNG at ${outputPath}`);
    })
  );
}

async function main() {
  await ensureSvg();
  const svgBuffer = await fs.readFile(SVG_SOURCE);
  const pngBuffers = await generatePngBuffers(svgBuffer);
  const icoBuffer = await pngToIco(pngBuffers);
  await fs.writeFile(OUTPUT_PATH, icoBuffer);
  console.log(`Generated favicon at ${OUTPUT_PATH}`);
  await writePngAssets(svgBuffer);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
