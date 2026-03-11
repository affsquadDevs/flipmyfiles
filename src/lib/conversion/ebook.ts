import JSZip from 'jszip';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export function isEbookFormat(format: string): boolean {
  return ['epub'].includes(format.toLowerCase());
}

export function getEbookMimeType(format: string): string {
  const mimeMap: Record<string, string> = {
    epub: 'application/epub+zip',
    txt: 'text/plain',
    pdf: 'application/pdf',
  };
  return mimeMap[format.toLowerCase()] || 'application/octet-stream';
}

/**
 * Extract plain text from an EPUB file.
 * EPUB is a ZIP containing HTML/XHTML files.
 */
async function extractEpubText(buffer: Buffer): Promise<string> {
  const zip = await JSZip.loadAsync(buffer);

  // Try to find reading order from content.opf
  let orderedFiles: string[] = [];

  const opfFile = Object.keys(zip.files).find(
    (f) => f.endsWith('.opf') || f.endsWith('content.opf')
  );

  if (opfFile) {
    const opfContent = await zip.files[opfFile].async('text');
    // Extract href from <item> tags in the manifest (ordered by spine)
    const spineMatches = [...opfContent.matchAll(/idref="([^"]+)"/g)].map((m) => m[1]);
    const manifestItems: Record<string, string> = {};
    for (const m of opfContent.matchAll(/id="([^"]+)"[^>]*href="([^"]+)"/g)) {
      manifestItems[m[1]] = m[2];
    }
    const opfDir = opfFile.includes('/') ? opfFile.substring(0, opfFile.lastIndexOf('/') + 1) : '';
    orderedFiles = spineMatches
      .map((id) => manifestItems[id])
      .filter(Boolean)
      .map((href) => opfDir + href);
  }

  // Fallback: just grab all HTML/XHTML files
  if (orderedFiles.length === 0) {
    orderedFiles = Object.keys(zip.files).filter(
      (f) => (f.endsWith('.html') || f.endsWith('.xhtml')) && !zip.files[f].dir
    );
  }

  const textParts: string[] = [];

  for (const filePath of orderedFiles) {
    const file = zip.files[filePath] || zip.files[filePath.replace(/^.*\//, '')];
    if (!file || file.dir) continue;

    const html = await file.async('text');
    // Strip HTML tags and decode basic entities
    const text = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (text) textParts.push(text);
  }

  return textParts.join('\n\n');
}

/**
 * EPUB → TXT
 */
async function epubToTxt(buffer: Buffer): Promise<Buffer> {
  const text = await extractEpubText(buffer);
  return Buffer.from(text, 'utf-8');
}

/**
 * EPUB → PDF
 */
async function epubToPdf(buffer: Buffer): Promise<Buffer> {
  const text = await extractEpubText(buffer);

  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontSize = 11;
  const lineHeight = fontSize * 1.5;
  const margin = 50;
  const pageWidth = 595; // A4
  const pageHeight = 842;
  const maxWidth = pageWidth - margin * 2;

  const rawLines = text.split('\n');
  const lines: string[] = [];

  for (const rawLine of rawLines) {
    if (rawLine.trim() === '') {
      lines.push('');
      continue;
    }
    // Word-wrap long lines
    const words = rawLine.split(' ');
    let current = '';
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(test, fontSize) > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
  }

  let page = pdf.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  for (const line of lines) {
    if (y < margin + lineHeight) {
      page = pdf.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
    if (line.trim()) {
      page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0, 0, 0) });
    }
    y -= lineHeight;
  }

  return Buffer.from(await pdf.save());
}

export async function convertEbook(
  buffer: Buffer,
  inputFormat: string,
  outputFormat: string
): Promise<Buffer> {
  const key = `${inputFormat.toLowerCase()}-to-${outputFormat.toLowerCase()}`;
  switch (key) {
    case 'epub-to-txt':
      return epubToTxt(buffer);
    case 'epub-to-pdf':
      return epubToPdf(buffer);
    default:
      throw new Error(`eBook conversion from ${inputFormat.toUpperCase()} to ${outputFormat.toUpperCase()} is not supported.`);
  }
}
