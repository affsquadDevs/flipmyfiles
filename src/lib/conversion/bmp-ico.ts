/**
 * Minimal, dependency-free BMP and ICO codecs.
 *
 * sharp/libvips in this build cannot read or write BMP, nor write ICO, so we
 * bridge those formats to sharp via raw RGB(A) pixels:
 *   - BMP input:  decodeBMP() -> raw RGBA -> sharp({ raw })
 *   - BMP output: sharp -> raw RGB -> encodeBMP()
 *   - ICO output: sharp -> PNG -> wrapPngInIco()
 *
 * Supports the common uncompressed 24-bit and 32-bit BMP variants (BI_RGB and
 * 32-bit BI_BITFIELDS treated as BGRA), both bottom-up and top-down.
 */

export function isBmp(buffer: Buffer): boolean {
  return buffer.length > 2 && buffer[0] === 0x42 && buffer[1] === 0x4d; // "BM"
}

export interface RawImage {
  data: Buffer; // RGBA, row-major, top-down
  width: number;
  height: number;
}

/** Decode an uncompressed 24/32-bit BMP into top-down RGBA pixels. */
export function decodeBMP(buffer: Buffer): RawImage {
  if (!isBmp(buffer)) throw new Error('Not a BMP file.');
  const pixelOffset = buffer.readUInt32LE(10);
  const dibSize = buffer.readUInt32LE(14);
  if (dibSize < 40) throw new Error('Unsupported BMP header (BITMAPCOREHEADER not supported).');
  const width = buffer.readInt32LE(18);
  const heightRaw = buffer.readInt32LE(22);
  const topDown = heightRaw < 0;
  const height = Math.abs(heightRaw);
  const bpp = buffer.readUInt16LE(28);
  const compression = buffer.readUInt32LE(30);

  if (width <= 0 || height <= 0) throw new Error('Invalid BMP dimensions.');
  if (bpp !== 24 && bpp !== 32) throw new Error(`Unsupported BMP bit depth: ${bpp} (only 24-bit and 32-bit are supported).`);
  // compression 0 = BI_RGB; 3 = BI_BITFIELDS (assume standard BGRA masks for 32-bit)
  if (compression !== 0 && !(compression === 3 && bpp === 32)) {
    throw new Error(`Unsupported BMP compression: ${compression}.`);
  }

  const bytesPerPixel = bpp / 8;
  const rowSize = Math.floor((bpp * width + 31) / 32) * 4;
  const out = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    const srcRow = topDown ? y : height - 1 - y;
    let src = pixelOffset + srcRow * rowSize;
    let dst = y * width * 4;
    for (let x = 0; x < width; x++) {
      const b = buffer[src];
      const g = buffer[src + 1];
      const r = buffer[src + 2];
      const a = bytesPerPixel === 4 ? buffer[src + 3] : 255;
      out[dst] = r;
      out[dst + 1] = g;
      out[dst + 2] = b;
      out[dst + 3] = a;
      src += bytesPerPixel;
      dst += 4;
    }
  }
  return { data: out, width, height };
}

/** Encode top-down RGB (or RGBA) pixels into a 24-bit uncompressed BMP. */
export function encodeBMP(rgb: Buffer, width: number, height: number, channels: number): Buffer {
  const rowRaw = width * 3;
  const rowPad = (4 - (rowRaw % 4)) % 4;
  const rowSize = rowRaw + rowPad;
  const pixelData = rowSize * height;
  const fileSize = 54 + pixelData;

  const out = Buffer.alloc(fileSize);
  out.write('BM', 0);
  out.writeUInt32LE(fileSize, 2);
  out.writeUInt32LE(54, 10); // pixel data offset
  out.writeUInt32LE(40, 14); // BITMAPINFOHEADER size
  out.writeInt32LE(width, 18);
  out.writeInt32LE(height, 22); // positive = bottom-up
  out.writeUInt16LE(1, 26); // planes
  out.writeUInt16LE(24, 28); // bpp
  out.writeUInt32LE(0, 30); // BI_RGB
  out.writeUInt32LE(pixelData, 34);
  out.writeInt32LE(2835, 38); // 72 DPI x
  out.writeInt32LE(2835, 42); // 72 DPI y

  for (let y = 0; y < height; y++) {
    const srcRow = height - 1 - y; // BMP pixel data is bottom-up
    let src = srcRow * width * channels;
    let dst = 54 + y * rowSize;
    for (let x = 0; x < width; x++) {
      out[dst] = rgb[src + 2];     // B
      out[dst + 1] = rgb[src + 1]; // G
      out[dst + 2] = rgb[src];     // R
      src += channels;
      dst += 3;
    }
  }
  return out;
}

/** Wrap a PNG buffer (<= 256x256) in an ICO container. */
export function wrapPngInIco(png: Buffer): Buffer {
  // PNG IHDR: width/height are big-endian uint32 at offsets 16 and 20.
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = icon
  header.writeUInt16LE(1, 4); // image count

  const entry = Buffer.alloc(16);
  entry.writeUInt8(width >= 256 ? 0 : width, 0);   // 0 means 256
  entry.writeUInt8(height >= 256 ? 0 : height, 1);
  entry.writeUInt8(0, 2); // color palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8); // size of image data
  entry.writeUInt32LE(6 + 16, 12); // offset of image data

  return Buffer.concat([header, entry, png]);
}
