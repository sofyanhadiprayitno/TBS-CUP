import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, drawFn) {
  // RGBA buffer: height rows, each row has 1 filter byte (0) + width * 4 bytes
  const rowLength = 1 + width * 4;
  const rawData = Buffer.alloc(rowLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowLength;
    rawData[rowOffset] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawFn(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: RGBA (6)
  ihdr[10] = 0; // Compression: Deflate
  ihdr[11] = 0; // Filter: Adaptive
  ihdr[12] = 0; // Interlace: None
  const ihdrChunk = makeChunk('IHDR', ihdr);

  // IDAT chunk
  const idatChunk = makeChunk('IDAT', compressedData);

  // IEND chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(8 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);

  const crc = crc32(buf.subarray(4, 8 + len));
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

// CRC32 implementation for PNG
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

// Icon drawer: dark slate gradient background with a glowing gold championship trophy emblem
function drawTrophyIcon(x, y, w, h, isMaskable = false) {
  const nx = x / w;
  const ny = y / h;
  const cx = 0.5;
  const cy = 0.5;
  const dx = nx - cx;
  const dy = ny - cy;
  const distCenter = Math.sqrt(dx * dx + dy * dy);

  // Base background: Deep obsidian/slate (#020617 to #0f172a)
  let r = 2 + Math.floor(ny * 12);
  let g = 6 + Math.floor(ny * 16);
  let b = 23 + Math.floor(ny * 25);
  let a = 255;

  // Outer ambient gold glow
  if (distCenter < 0.45) {
    const glow = Math.max(0, 1 - distCenter / 0.45);
    r = Math.min(255, r + Math.floor(glow * 40));
    g = Math.min(255, g + Math.floor(glow * 30));
    b = Math.min(255, b + Math.floor(glow * 5));
  }

  // Draw Trophy Silhouette inside the safe zone (central 0.28 radius)
  // Trophy Cup Top
  const cupX = Math.abs(dx);
  const cupY = dy + 0.08;

  // Cup Bowl
  const isCupBowl = cupY >= -0.15 && cupY <= 0.08 && cupX <= (0.16 - (cupY > 0 ? (cupY * 0.8) : 0));
  // Handles
  const isHandleLeft = dx < -0.12 && dx > -0.22 && dy > -0.14 && dy < 0.02 && Math.abs(dy - (-0.06)) < 0.07;
  const isHandleRight = dx > 0.12 && dx < 0.22 && dy > -0.14 && dy < 0.02 && Math.abs(dy - (-0.06)) < 0.07;
  const isHandleHole = Math.abs(dx) > 0.14 && Math.abs(dx) < 0.19 && dy > -0.11 && dy < -0.01;
  const isHandle = (isHandleLeft || isHandleRight) && !isHandleHole;

  // Stem
  const isStem = cupY > 0.08 && cupY < 0.18 && cupX < 0.04;
  // Base
  const isBase = cupY >= 0.18 && cupY <= 0.24 && cupX < (0.14 - (cupY - 0.18) * 0.2);

  // Star in the center
  const isStar = Math.abs(dx) < 0.04 && Math.abs(dy - (-0.03)) < 0.04 && (Math.abs(dx) + Math.abs(dy - (-0.03)) < 0.05);

  if (isCupBowl || isHandle || isStem || isBase) {
    // Rich Gold gradient (#f59e0b to #fbbf24 to #d97706)
    const goldGrad = 0.5 + 0.5 * (1 - (cupX + cupY * 0.5));
    r = Math.min(255, Math.floor(245 + goldGrad * 10));
    g = Math.min(255, Math.floor(158 + goldGrad * 40));
    b = Math.min(255, Math.floor(11 + goldGrad * 25));
  }

  if (isStar) {
    r = 255;
    g = 255;
    b = 255;
  }

  return [r, g, b, a];
}

// Ensure public directory exists
const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate PWA icons
console.log('Generating PWA icon assets...');

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPNG(192, 192, (x, y, w, h) => drawTrophyIcon(x, y, w, h, false)));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPNG(512, 512, (x, y, w, h) => drawTrophyIcon(x, y, w, h, false)));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPNG(512, 512, (x, y, w, h) => drawTrophyIcon(x, y, w, h, true)));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPNG(180, 180, (x, y, w, h) => drawTrophyIcon(x, y, w, h, false)));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPNG(64, 64, (x, y, w, h) => drawTrophyIcon(x, y, w, h, false)));

// SVG Icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="128" fill="url(#bg)" />
  <circle cx="256" cy="256" r="180" fill="#f59e0b" opacity="0.12" filter="blur(20px)" />
  <g transform="translate(106, 96) scale(0.6)">
    <path fill="url(#gold)" d="M250 48c-12 0-22 10-22 22v18H104c-31 0-56 25-56 56v28c0 52 38 96 89 103 14 36 45 64 83 73v60h-56c-13 0-24 11-24 24s11 24 24 24h184c13 0 24-11 24-24s-11-24-24-24h-56v-60c38-9 69-37 83-73 51-7 89-51 89-103v-28c0-31-25-56-56-56H294V70c0-12-10-22-22-22h-22zm-146 88h38v76c-27-6-46-30-46-60v-16h8zm272 16c0 30-19 54-46 60v-76h38v16h8z" />
  </g>
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf-8');

console.log('All PWA icon assets generated successfully in public/');
