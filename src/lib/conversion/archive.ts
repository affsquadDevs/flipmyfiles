import archiver from 'archiver';
import unzipper from 'unzipper';
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

/**
 * Create a ZIP archive from a single file buffer
 */
async function createZip(buffer: Buffer, filename: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 6 } });
    const chunks: Buffer[] = [];

    archive.on('data', (chunk: Buffer) => chunks.push(chunk));
    archive.on('end', () => resolve(Buffer.concat(chunks)));
    archive.on('error', reject);

    archive.append(buffer, { name: filename });
    archive.finalize();
  });
}

/**
 * Create a TAR archive from a single file buffer
 */
async function createTar(buffer: Buffer, filename: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const archive = archiver('tar');
    const chunks: Buffer[] = [];

    archive.on('data', (chunk: Buffer) => chunks.push(chunk));
    archive.on('end', () => resolve(Buffer.concat(chunks)));
    archive.on('error', reject);

    archive.append(buffer, { name: filename });
    archive.finalize();
  });
}

/**
 * Create a GZ (tar.gz) archive from a single file buffer
 */
async function createGz(buffer: Buffer, filename: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const archive = archiver('tar', { gzip: true, gzipOptions: { level: 6 } });
    const chunks: Buffer[] = [];

    archive.on('data', (chunk: Buffer) => chunks.push(chunk));
    archive.on('end', () => resolve(Buffer.concat(chunks)));
    archive.on('error', reject);

    archive.append(buffer, { name: filename });
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
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 6 } });
    const chunks: Buffer[] = [];

    archive.on('data', (chunk: Buffer) => chunks.push(chunk));
    archive.on('end', () => resolve(Buffer.concat(chunks)));
    archive.on('error', reject);

    for (const file of files) {
      archive.append(file.buffer, { name: file.filename });
    }

    archive.finalize();
  });
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

  // Extract from archive
  if (inLower === 'zip' && !isArchiveFormat(outLower)) {
    return extractZip(buffer);
  }

  // Compress to archive
  if (!isArchiveFormat(inLower) && isArchiveFormat(outLower)) {
    let result: Buffer;
    switch (outLower) {
      case 'zip':
        result = await createZip(buffer, originalFilename);
        break;
      case 'tar':
        result = await createTar(buffer, originalFilename);
        break;
      case 'gz':
        result = await createGz(buffer, originalFilename);
        break;
      default:
        throw new Error(`Unsupported archive format: ${outLower}`);
    }
    const baseName = originalFilename.replace(/\.[^.]+$/, '');
    return { buffer: result, filename: `${baseName}.${outLower}` };
  }

  throw new Error(`Archive conversion from ${inLower} to ${outLower} is not supported.`);
}
