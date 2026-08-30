/**
 * Minimal dependency-free PNG codec (decode / encode / crop / resize).
 *
 * Only what the brand pipeline needs: non-interlaced PNGs, normalised to RGBA8.
 * Node's built-in zlib does the heavy lifting, so this adds no dependencies.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { deflateSync, inflateSync } from "node:zlib";

const CHANNELS = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };

/** @typedef {{ width: number, height: number, data: Buffer }} Bitmap RGBA8 pixels. */

/**
 * Reverse the per-scanline filters defined by the PNG spec.
 * @returns {Buffer} unfiltered scanlines, `stride` bytes per row.
 */
function unfilter(raw, { height, stride, bytesPerPixel }) {
  const out = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    const type = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, y * (stride + 1) + 1 + stride);
    const cur = out.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : Buffer.alloc(stride);

    for (let x = 0; x < stride; x++) {
      const a = x >= bytesPerPixel ? cur[x - bytesPerPixel] : 0;
      const b = prev[x];
      const c = x >= bytesPerPixel ? prev[x - bytesPerPixel] : 0;
      const v = line[x];
      let value;
      switch (type) {
        case 0: value = v; break;
        case 1: value = v + a; break;
        case 2: value = v + b; break;
        case 3: value = v + ((a + b) >> 1); break;
        default: {
          const p = a + b - c;
          const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
          value = v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c);
        }
      }
      cur[x] = value & 0xff;
    }
  }
  return out;
}

/**
 * Decode a PNG file to RGBA8.
 * @param {string} file
 * @returns {Bitmap}
 */
export function decodePNG(file) {
  const buf = readFileSync(file);
  let pos = 8;
  let header = null, palette = null, alphaTable = null;
  const chunks = [];

  while (pos < buf.length) {
    const length = buf.readUInt32BE(pos);
    const type = buf.toString("ascii", pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + length);
    if (type === "IHDR") {
      header = {
        width: data.readUInt32BE(0),
        height: data.readUInt32BE(4),
        depth: data[8],
        colorType: data[9],
        interlace: data[12],
      };
    } else if (type === "IDAT") chunks.push(data);
    else if (type === "PLTE") palette = data;
    else if (type === "tRNS") alphaTable = data;
    pos += 12 + length;
  }

  if (!header) throw new Error(`${file}: missing IHDR`);
  if (header.interlace) throw new Error(`${file}: interlaced PNGs are not supported`);
  if (header.depth !== 8) throw new Error(`${file}: only 8-bit channels are supported`);

  const { width, height, colorType } = header;
  const channels = CHANNELS[colorType];
  const stride = channels * width;
  const scan = unfilter(inflateSync(Buffer.concat(chunks)), {
    height,
    stride,
    bytesPerPixel: channels,
  });

  const data = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const src = y * stride + x * channels;
      const dst = (y * width + x) * 4;
      let r, g, b, a = 255;
      switch (colorType) {
        case 6: [r, g, b, a] = [scan[src], scan[src + 1], scan[src + 2], scan[src + 3]]; break;
        case 2: [r, g, b] = [scan[src], scan[src + 1], scan[src + 2]]; break;
        case 4: r = g = b = scan[src]; a = scan[src + 1]; break;
        case 3: {
          const i = scan[src];
          [r, g, b] = [palette[i * 3], palette[i * 3 + 1], palette[i * 3 + 2]];
          if (alphaTable && i < alphaTable.length) a = alphaTable[i];
          break;
        }
        default: r = g = b = scan[src];
      }
      data[dst] = r; data[dst + 1] = g; data[dst + 2] = b; data[dst + 3] = a;
    }
  }
  return { width, height, data };
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
  return Buffer.concat([head, data, crc]);
}

/**
 * Encode RGBA8 pixels as a PNG. Each scanline is filtered with the candidate
 * (None/Sub/Up/Average/Paeth) whose absolute-sum is lowest, which is the
 * heuristic libpng uses and keeps flat brand artwork small.
 * @param {Bitmap} bitmap
 * @param {string} file
 */
export function encodePNG({ width, height, data }, file) {
  const bpp = 4, stride = width * bpp;
  const rows = [];

  for (let y = 0; y < height; y++) {
    const cur = data.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? data.subarray((y - 1) * stride, y * stride) : Buffer.alloc(stride);
    let best = null;

    for (let type = 0; type <= 4; type++) {
      const line = Buffer.alloc(stride + 1);
      line[0] = type;
      let score = 0;
      for (let x = 0; x < stride; x++) {
        const a = x >= bpp ? cur[x - bpp] : 0;
        const b = prev[x];
        const c = x >= bpp ? prev[x - bpp] : 0;
        let v;
        switch (type) {
          case 0: v = cur[x]; break;
          case 1: v = cur[x] - a; break;
          case 2: v = cur[x] - b; break;
          case 3: v = cur[x] - ((a + b) >> 1); break;
          default: {
            const p = a + b - c;
            const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
            v = cur[x] - (pa <= pb && pa <= pc ? a : pb <= pc ? b : c);
          }
        }
        line[x + 1] = v & 0xff;
        score += Math.min(line[x + 1], 256 - line[x + 1]);
      }
      if (!best || score < best.score) best = { score, line };
    }
    rows.push(best.line);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // colour type: RGBA
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(Buffer.concat(rows), { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  writeFileSync(file, png);
  return png.length;
}

/**
 * Tight bounding box of pixels above an alpha threshold.
 * @returns {{ x: number, y: number, width: number, height: number }}
 */
export function alphaBounds({ width, height, data }, threshold = 8) {
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] <= threshold) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX < 0) throw new Error("image is fully transparent");
  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

/** @returns {Bitmap} */
export function crop({ width, height, data }, box) {
  const out = Buffer.alloc(box.width * box.height * 4);
  for (let y = 0; y < box.height; y++) {
    const src = ((box.y + y) * width + box.x) * 4;
    data.copy(out, y * box.width * 4, src, src + box.width * 4);
  }
  return { width: box.width, height: box.height, data: out };
}

/**
 * Box-filter resample in premultiplied alpha, which avoids the dark fringes a
 * straight RGBA average produces around transparent edges.
 * @returns {Bitmap}
 */
export function resize({ width, height, data }, targetWidth, targetHeight) {
  const out = Buffer.alloc(targetWidth * targetHeight * 4);
  const scaleX = width / targetWidth, scaleY = height / targetHeight;

  for (let y = 0; y < targetHeight; y++) {
    const y0 = y * scaleY, y1 = (y + 1) * scaleY;
    for (let x = 0; x < targetWidth; x++) {
      const x0 = x * scaleX, x1 = (x + 1) * scaleX;
      let r = 0, g = 0, b = 0, a = 0, weight = 0;

      for (let sy = Math.floor(y0); sy < Math.min(height, Math.ceil(y1)); sy++) {
        const wy = Math.min(y1, sy + 1) - Math.max(y0, sy);
        for (let sx = Math.floor(x0); sx < Math.min(width, Math.ceil(x1)); sx++) {
          const wx = Math.min(x1, sx + 1) - Math.max(x0, sx);
          const w = wx * wy;
          if (w <= 0) continue;
          const i = (sy * width + sx) * 4;
          const alpha = data[i + 3] / 255;
          r += data[i] * alpha * w;
          g += data[i + 1] * alpha * w;
          b += data[i + 2] * alpha * w;
          a += data[i + 3] * w;
          weight += w;
        }
      }

      const o = (y * targetWidth + x) * 4;
      const alpha = weight ? a / weight : 0;
      const unpremultiply = alpha > 0 ? 255 / alpha : 0;
      out[o] = Math.round(Math.min(255, (r / weight) * unpremultiply)) || 0;
      out[o + 1] = Math.round(Math.min(255, (g / weight) * unpremultiply)) || 0;
      out[o + 2] = Math.round(Math.min(255, (b / weight) * unpremultiply)) || 0;
      out[o + 3] = Math.round(alpha);
    }
  }
  return { width: targetWidth, height: targetHeight, data: out };
}
