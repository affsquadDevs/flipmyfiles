import archiver from 'archiver';
import unzipper from 'unzipper';
import JSZip from 'jszip';
import { gunzipSync } from 'zlib';
import { Readable, PassThrough } from 'stream';

const ARCHIVE_FORMATS = new Set(['zip', 'tar', 'gz']);

export function isArchiveFormat(format: string): boolean {
  return ARCHIVE_FORMATS.has(format.toLowerCase());
}

export function getArchiveMimeType(format: string): string {
  const map: Record<string, string> = {
    zip: 'application/zip',
    tar: 'application/x-tar',
    gz: 'application/gzip',
  };
  return map[format.toLowerCase()] || 'application/octet-stream';
}

interface ArchiveEntry {
  name: string;
  data: Buffer;
}

/**
 * Parse a (ustar) TAR buffer into its regular-file entries. Dependency-free —
 * TAR is a sequence of 512-byte header blocks each followed by padded data.
 */
function parseTar(buffer: Buffer): ArchiveEntry[] {
  const entries: ArchiveEntry[] = [];
  let offset = 0;
  while (offset + 512 <= buffer.length) {
    const header = buffer.subarray(offset, offset + 512);
    if (header.every((b) => b === 0)) break; // end-of-archive marker

    let name = header.subarray(0, 100).toString('utf8').replace(/\0.*$/, '');
    const prefix = header.subarray(345, 500).toString('utf8').replace(/\0.*$/, '');
    if (prefix) name = `${prefix}/${name}`;

    const sizeStr = header.subarray(124, 136).toString('ascii').replace(/\0.*$/, '').trim();
    const size = parseInt(sizeStr, 8) || 0;
    const typeflag = header[156];

    offset += 512;
    if (size > 0) {
      // typeflag '0' (0x30) or NUL = regular file
      if (typeflag === 0x30 || typeflag === 0) {
        entries.push({ name, data: Buffer.from(buffer.subarray(offset, offset + size)) });
      }
      offset += Math.ceil(size / 512) * 512;
    }
  }
  return entries;
}

/** Read all regular-file entries out of a zip/tar/gz archive. */
async function readEntries(buffer: Buffer, format: string): Promise<ArchiveEntry[]> {
  const fmt = format.toLowerCase();
  if (fmt === 'zip') {
    const zip = await JSZip.loadAsync(buffer);
    const entries: ArchiveEntry[] = [];
    for (const name of Object.keys(zip.files)) {
      const file = zip.files[name];
      if (!file.dir) entries.push({ name, data: await file.async('nodebuffer') });
    }
    return entries;
  }
  if (fmt === 'tar') {
    return parseTar(buffer);
  }
  if (fmt === 'gz') {
    // App-produced .gz is a gzipped TAR; external raw gzip decompresses to a single file.
    const inner = gunzipSync(buffer);
    const tarEntries = parseTar(inner);
    return tarEntries.length > 0 ? tarEntries : [{ name: 'file', data: inner }];
  }
  throw new Error(`Cannot read ${fmt} archives.`);
}

/** Write entries into a new zip/tar/gz (tar.gz) archive buffer. */
async function writeArchive(entries: ArchiveEntry[], format: string): Promise<Buffer> {
  const fmt = format.toLowerCase();
  return new Promise((resolve, reject) => {
    let archive: archiver.Archiver;
    if (fmt === 'zip') archive = archiver('zip', { zlib: { level: 6 } });
    else if (fmt === 'tar') archive = archiver('tar', {});
    else if (fmt === 'gz') archive = archiver('tar', { gzip: true, gzipOptions: { level: 6 } });
    else return reject(new Error(`Unsupported archive format: ${fmt}`));

    const chunks: Buffer[] = [];
    archive.on('data', (chunk: Buffer) => chunks.push(chunk));
    archive.on('end', () => resolve(Buffer.concat(chunks)));
    archive.on('error', reject);

    for (const entry of entries) archive.append(entry.data, { name: entry.name });
    archive.finalize();
  });
}

/**
 * Extract the first file from a ZIP archive and return as buffer
 */
async function extractZip(buffer: Buffer): Promise<{ buffer: Buffer; filename: string }> {
  const stream = Readable.from(buffer);
  const directory = stream.pipe(unzipper.Parse({ forceStream: true }));

  for await (const entry of directory) {
    const typedEntry = entry as unzipper.Entry;
    if (typedEntry.type === 'File') {
      const chunks: Buffer[] = [];
      const passThrough = new PassThrough();
      typedEntry.pipe(passThrough);
      for await (const chunk of passThrough) {
        chunks.push(Buffer.from(chunk));
      }
      return {
        buffer: Buffer.concat(chunks),
        filename: typedEntry.path,
      };
    }
    typedEntry.autodrain();
  }

  throw new Error('No files found in the ZIP archive.');
}

/**
 * Create a ZIP from multiple file buffers (for batch download)
 */
export async function createZipFromMultiple(
  files: { buffer: Buffer; filename: string }[]
): Promise<Buffer> {
  return writeArchive(
    files.map((f) => ({ name: f.filename, data: f.buffer })),
    'zip'
  );
}

/**
 * Main archive conversion router
 */
export async function convertArchive(
  buffer: Buffer,
  inputFormat: string,
  outputFormat: string,
  originalFilename: string,
): Promise<{ buffer: Buffer; filename: string }> {
  const inLower = inputFormat.toLowerCase();
  const outLower = outputFormat.toLowerCase();
  const baseName = originalFilename.replace(/\.[^.]+$/, '');

  // Archive -> archive: re-package the contents into the target format.
  if (isArchiveFormat(inLower) && isArchiveFormat(outLower)) {
    const entries = await readEntries(buffer, inLower);
    if (entries.length === 0) {
      throw new Error('The archive appears to be empty or could not be read.');
    }
    const result = await writeArchive(entries, outLower);
    return { buffer: result, filename: `${baseName}.${outLower}` };
  }

  // Extract a single file out of a zip.
  if (inLower === 'zip' && !isArchiveFormat(outLower)) {
    return extractZip(buffer);
  }

  // Compress a single file into an archive.
  if (!isArchiveFormat(inLower) && isArchiveFormat(outLower)) {
    const result = await writeArchive([{ name: originalFilename, data: buffer }], outLower);
    return { buffer: result, filename: `${baseName}.${outLower}` };
  }

  throw new Error(`Archive conversion from ${inLower} to ${outLower} is not supported.`);
}
