import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import mammoth from 'mammoth';
import ExcelJS from 'exceljs';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

export function isDocumentFormat(format: string): boolean {
  const docFormats = ['pdf', 'docx', 'xlsx', 'csv', 'txt'];
  return docFormats.includes(format.toLowerCase());
}

export function getDocumentMimeType(format: string): string {
  const mimeMap: Record<string, string> = {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    csv: 'text/csv',
    txt: 'text/plain',
  };
  return mimeMap[format.toLowerCase()] || 'application/octet-stream';
}

/**
 * Convert DOCX to PDF using mammoth (HTML extraction) + pdf-lib
 */
async function docxToPdf(buffer: Buffer): Promise<Buffer> {
  const result = await mammoth.extractRawText({ buffer });
  const text = result.value;

  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontSize = 11;
  const lineHeight = fontSize * 1.4;
  const margin = 50;
  const pageWidth = 595; // A4
  const pageHeight = 842;
  const maxWidth = pageWidth - margin * 2;

  const lines: string[] = [];
  const paragraphs = text.split('\n');

  for (const paragraph of paragraphs) {
    if (paragraph.trim() === '') {
      lines.push('');
      continue;
    }

    // Word wrap
    const words = paragraph.split(' ');
    let currentLine = '';
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, fontSize);
      if (width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
  }

  let page = pdf.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  for (const line of lines) {
    if (y < margin + lineHeight) {
      page = pdf.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }

    if (line.trim()) {
      page.drawText(line, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    }
    y -= lineHeight;
  }

  const pdfBytes = await pdf.save();
  return Buffer.from(pdfBytes);
}

/**
 * Convert DOCX to TXT using mammoth
 */
async function docxToTxt(buffer: Buffer): Promise<Buffer> {
  const result = await mammoth.extractRawText({ buffer });
  return Buffer.from(result.value, 'utf-8');
}

/**
 * Convert CSV to XLSX using ExcelJS
 */
async function csvToXlsx(buffer: Buffer): Promise<Buffer> {
  const csvText = buffer.toString('utf-8');
  const records = parse(csvText, {
    relax_column_count: true,
    skip_empty_lines: true,
    trim: true,
  }) as string[][];

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Sheet1');

  for (const row of records) {
    sheet.addRow(row);
  }

  // Auto-width columns
  sheet.columns.forEach(column => {
    let maxLength = 10;
    column.eachCell?.({ includeEmpty: false }, cell => {
      const len = cell.value ? String(cell.value).length : 0;
      if (len > maxLength) maxLength = Math.min(len, 50);
    });
    column.width = maxLength + 2;
  });

  // Style header row
  if (sheet.rowCount > 0) {
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE2E8F0' },
    };
  }

  const xlsxBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(xlsxBuffer);
}

/**
 * Convert XLSX to CSV using ExcelJS
 */
async function xlsxToCsv(buffer: Buffer): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await workbook.xlsx.load(buffer as any);

  const sheet = workbook.worksheets[0];
  if (!sheet) throw new Error('No worksheets found in the Excel file.');

  const rows: string[][] = [];
  sheet.eachRow((row) => {
    const values = row.values as (string | number | boolean | null | undefined)[];
    // ExcelJS row.values is 1-indexed, first element is undefined
    const rowData = values.slice(1).map(v => (v != null ? String(v) : ''));
    rows.push(rowData);
  });

  const csvOutput = stringify(rows);
  return Buffer.from(csvOutput, 'utf-8');
}

/**
 * Convert TXT to PDF
 */
async function txtToPdf(buffer: Buffer): Promise<Buffer> {
  const text = buffer.toString('utf-8');
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Courier);
  const fontSize = 10;
  const lineHeight = fontSize * 1.4;
  const margin = 50;
  const pageWidth = 595;
  const pageHeight = 842;
  const maxWidth = pageWidth - margin * 2;

  const rawLines = text.split('\n');
  const lines: string[] = [];

  for (const rawLine of rawLines) {
    if (rawLine.trim() === '') {
      lines.push('');
      continue;
    }
    // Word wrap
    const words = rawLine.split(' ');
    let currentLine = '';
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, fontSize);
      if (width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
  }

  let page = pdf.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  for (const line of lines) {
    if (y < margin + lineHeight) {
      page = pdf.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin;
    }
    if (line.trim()) {
      page.drawText(line, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
    }
    y -= lineHeight;
  }

  const pdfBytes = await pdf.save();
  return Buffer.from(pdfBytes);
}

/**
 * Main document conversion router
 */
export async function convertDocument(
  buffer: Buffer,
  inputFormat: string,
  outputFormat: string,
): Promise<Buffer> {
  const inLower = inputFormat.toLowerCase();
  const outLower = outputFormat.toLowerCase();
  const key = `${inLower}-to-${outLower}`;

  switch (key) {
    case 'docx-to-pdf':
      return docxToPdf(buffer);
    case 'docx-to-txt':
      return docxToTxt(buffer);
    case 'csv-to-xlsx':
      return csvToXlsx(buffer);
    case 'xlsx-to-csv':
      return xlsxToCsv(buffer);
    case 'txt-to-pdf':
      return txtToPdf(buffer);
    default:
      throw new Error(`Document conversion from ${inLower.toUpperCase()} to ${outLower.toUpperCase()} is not supported.`);
  }
}
