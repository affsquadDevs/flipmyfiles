import { convertImage, isImageFormat, getImageMimeType } from './image';
import { convertDocument, isDocumentFormat, getDocumentMimeType } from './document';
import { convertArchive, isArchiveFormat, getArchiveMimeType } from './archive';
import { ConversionOptions } from '@/types/formats';

export interface ConversionResult {
  buffer: Buffer;
  mimeType: string;
  filename: string;
}

export async function convertFile(
  buffer: Buffer,
  inputFormat: string,
  outputFormat: string,
  originalFilename: string,
  options: ConversionOptions = {}
): Promise<ConversionResult> {
  const outLower = outputFormat.toLowerCase();
  const inLower = inputFormat.toLowerCase();
  const baseName = originalFilename.replace(/\.[^.]+$/, '');
  const defaultFilename = `${baseName}.${outLower === 'jpeg' ? 'jpg' : outLower}`;

  // Image conversion (server-side via Sharp)
  if (isImageFormat(inputFormat) && isImageFormat(outputFormat)) {
    const result = await convertImage(buffer, outputFormat, options);
    return {
      buffer: result,
      mimeType: getImageMimeType(outputFormat),
      filename: defaultFilename,
    };
  }

  // Archive conversion (server-side via archiver/unzipper)
  if (isArchiveFormat(inLower) || isArchiveFormat(outLower)) {
    const result = await convertArchive(buffer, inputFormat, outputFormat, originalFilename);
    return {
      buffer: result.buffer,
      mimeType: isArchiveFormat(outLower) ? getArchiveMimeType(outputFormat) : 'application/octet-stream',
      filename: result.filename,
    };
  }

  // Document conversion (server-side via mammoth/exceljs/pdf-lib)
  if (isDocumentFormat(inputFormat) || isDocumentFormat(outputFormat)) {
    const result = await convertDocument(buffer, inputFormat, outputFormat);
    return {
      buffer: result,
      mimeType: getDocumentMimeType(outputFormat),
      filename: defaultFilename,
    };
  }

  // Video/Audio conversions are handled client-side via FFmpeg WASM
  throw new Error(
    `Conversion from ${inputFormat.toUpperCase()} to ${outputFormat.toUpperCase()} is not yet supported on the server. ` +
    `Video and audio conversions are processed in your browser.`
  );
}
