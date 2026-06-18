/**
 * Content generation helpers for conversion pages.
 * Provides format descriptions, conversion benefits, and FAQ content
 * so each /convert/[slug] page has substantial, unique, informational text.
 *
 * English is the source (this file). Translated bundles live in
 * src/data/convert-content/<locale>.json and are merged in per locale.
 */
import type { ConvertContent, FormatText } from '@/data/convert-content/types';
import { localeBundles } from '@/data/convert-content';

interface FormatInfo {
  fullName: string;
  description: string;
  strengths: string[];
  commonUses: string[];
  technicalNote: string;
}

const formatDatabase: Record<string, FormatInfo> = {
  JPG: {
    fullName: 'JPEG (Joint Photographic Experts Group)',
    description: 'JPG is one of the most widely used image formats on the web. It uses lossy compression to reduce file size while maintaining acceptable visual quality for photographs and complex images. The format supports millions of colors, making it suitable for photographic content.',
    strengths: ['Small file sizes due to lossy compression', 'Universal compatibility across devices and browsers', 'Supports millions of colors (24-bit color depth)', 'Adjustable quality-to-size ratio'],
    commonUses: ['Website images and photographs', 'Email attachments', 'Social media uploads', 'Digital photography'],
    technicalNote: 'JPG does not support transparency or animation. Each time a JPG file is edited and re-saved, it may lose some quality due to re-compression.',
  },
  PNG: {
    fullName: 'PNG (Portable Network Graphics)',
    description: 'PNG is a raster image format that uses lossless compression, meaning it retains all original image data without quality loss. It supports transparency (alpha channel), making it a popular choice for graphics, icons, and images that need to be layered over other content.',
    strengths: ['Lossless compression preserves full quality', 'Supports transparency (alpha channel)', 'Sharp edges for text and graphics', 'No quality loss when editing and re-saving'],
    commonUses: ['Web graphics with transparency', 'Screenshots and interface elements', 'Logos and icons', 'Images requiring sharp detail'],
    technicalNote: 'PNG files are typically larger than JPG files for photographic content because lossless compression is less efficient for complex, high-color images.',
  },
  WebP: {
    fullName: 'WebP',
    description: 'WebP is a modern image format developed by Google. It supports both lossy and lossless compression, along with transparency and animation. WebP files are generally smaller than equivalent JPG or PNG files at similar quality levels, making it well-suited for web use.',
    strengths: ['Smaller file sizes than JPG and PNG at comparable quality', 'Supports both lossy and lossless compression', 'Supports transparency and animation', 'Designed for fast web delivery'],
    commonUses: ['Website optimization', 'Web application assets', 'Progressive web apps', 'Content delivery optimization'],
    technicalNote: 'While WebP is supported by all modern browsers, some older applications and systems may not open WebP files natively. Converting to JPG or PNG may be needed for broader compatibility.',
  },
  GIF: {
    fullName: 'GIF (Graphics Interchange Format)',
    description: 'GIF is an image format that supports animation and transparency. It uses lossless compression but is limited to a palette of 256 colors, which makes it best suited for simple graphics, logos, and short animations rather than photographs.',
    strengths: ['Supports animation (multiple frames)', 'Supports basic transparency', 'Small file size for simple graphics', 'Universal browser and device support'],
    commonUses: ['Animated images and short clips', 'Simple web graphics', 'Reaction images and memes', 'UI loading indicators'],
    technicalNote: 'GIF is limited to 256 colors per frame. For photographic content, JPG or PNG will produce better visual results. For animated content with more colors, consider MP4 or WebP.',
  },
  BMP: {
    fullName: 'BMP (Bitmap Image File)',
    description: 'BMP is an uncompressed raster image format that stores pixel data directly without compression. This results in large file sizes but preserves exact pixel information. BMP files are commonly used in Windows environments and for specific technical applications.',
    strengths: ['Exact pixel-level accuracy', 'No compression artifacts', 'Simple format structure', 'Wide support on Windows systems'],
    commonUses: ['Windows system graphics', 'Technical and scientific imaging', 'Source files for further processing', 'Legacy application compatibility'],
    technicalNote: 'BMP files are significantly larger than compressed formats like JPG or PNG. Converting BMP to PNG or JPG is recommended when file size or web use is a consideration.',
  },
  TIFF: {
    fullName: 'TIFF (Tagged Image File Format)',
    description: 'TIFF is a flexible image format used primarily in professional photography, printing, and publishing. It supports lossless compression, multiple layers, and high color depth, making it suitable for archival and print-quality images.',
    strengths: ['Lossless quality preservation', 'Supports high color depth (16-bit, 32-bit)', 'Multiple pages and layers', 'Industry standard for print and publishing'],
    commonUses: ['Professional photography', 'Print and publishing workflows', 'Archival image storage', 'Medical and scientific imaging'],
    technicalNote: 'TIFF files tend to be large due to their lossless nature. For web use, converting TIFF to JPG, PNG, or WebP reduces file size significantly while maintaining visual quality for screen display.',
  },
  AVIF: {
    fullName: 'AVIF (AV1 Image File Format)',
    description: 'AVIF is a next-generation image format based on the AV1 video codec. It offers significantly better compression than JPG and WebP, producing smaller files at equivalent quality. AVIF supports HDR, wide color gamut, and transparency.',
    strengths: ['Superior compression efficiency', 'Supports HDR and wide color gamut', 'Supports transparency and animation', 'Open, royalty-free format'],
    commonUses: ['Next-generation web images', 'Bandwidth-sensitive applications', 'High-quality photo delivery', 'Progressive image loading'],
    technicalNote: 'AVIF is supported by most modern browsers but may not be compatible with older software. Converting to JPG or PNG ensures broader compatibility when needed.',
  },
  SVG: {
    fullName: 'SVG (Scalable Vector Graphics)',
    description: 'SVG is a vector image format based on XML. Unlike raster formats, SVG images can be scaled to any size without losing quality. They are ideal for logos, icons, charts, and any graphics that need to look sharp at different sizes.',
    strengths: ['Infinite scalability without quality loss', 'Small file size for simple graphics', 'Editable with text editors and code', 'Supports interactivity and animation'],
    commonUses: ['Website logos and icons', 'Responsive web graphics', 'Data visualizations and charts', 'Print materials at any resolution'],
    technicalNote: 'SVG is a vector format and cannot represent photographic content efficiently. Converting SVG to PNG produces a rasterized version at a fixed resolution.',
  },
  ICO: {
    fullName: 'ICO (Windows Icon)',
    description: 'ICO is a file format used for icons in Microsoft Windows. It can contain multiple image sizes and color depths within a single file, allowing the operating system to select the appropriate version for different display contexts.',
    strengths: ['Multiple sizes in one file', 'Standard format for Windows icons', 'Used for website favicons', 'Supports transparency'],
    commonUses: ['Website favicons', 'Windows application icons', 'Desktop shortcuts', 'Browser tab icons'],
    technicalNote: 'ICO files typically contain versions at 16x16, 32x32, 48x48, and 256x256 pixels. When converting from another format, the image is resized to fit standard icon dimensions.',
  },
  HEIC: {
    fullName: 'HEIC (High Efficiency Image Container)',
    description: 'HEIC is the image format used by Apple devices running iOS 11 and later. It uses the HEVC (H.265) compression standard to produce high-quality images at roughly half the file size of JPG. However, it has limited support outside the Apple ecosystem.',
    strengths: ['Significantly smaller file sizes than JPG', 'High image quality', 'Supports depth maps and live photos', 'Default format on modern Apple devices'],
    commonUses: ['iPhone and iPad photography', 'Apple ecosystem file sharing', 'Storage optimization on Apple devices'],
    technicalNote: 'HEIC files may not open on Windows or Android devices without additional software. Converting HEIC to JPG or PNG provides universal compatibility.',
  },
  MP4: {
    fullName: 'MP4 (MPEG-4 Part 14)',
    description: 'MP4 is the most widely used video container format. It supports video, audio, subtitles, and still images within a single file. MP4 typically uses H.264 or H.265 video codecs and AAC audio, providing a good balance between quality and file size.',
    strengths: ['Universal playback compatibility', 'Efficient compression with H.264/H.265', 'Supports multiple audio and subtitle tracks', 'Streaming-friendly format'],
    commonUses: ['Video sharing and streaming', 'Social media uploads', 'Video storage and archival', 'Web video embedding'],
    technicalNote: 'MP4 is a container format that can use different codecs. Compatibility depends on the specific codecs used within the file. H.264 with AAC audio offers the broadest device support.',
  },
  AVI: {
    fullName: 'AVI (Audio Video Interleave)',
    description: 'AVI is a multimedia container format introduced by Microsoft. It stores video and audio data in a single file and supports a variety of codecs. While widely supported, AVI files tend to be larger than MP4 files for equivalent content.',
    strengths: ['Broad codec support', 'Good Windows compatibility', 'Established, well-known format', 'Supports multiple audio streams'],
    commonUses: ['Legacy video playback', 'Windows-based video editing', 'Older multimedia applications'],
    technicalNote: 'AVI files are often larger than MP4 due to less efficient compression. Converting AVI to MP4 typically reduces file size while maintaining visual quality.',
  },
  MOV: {
    fullName: 'MOV (Apple QuickTime Movie)',
    description: 'MOV is a multimedia container format developed by Apple for use with QuickTime. It supports video, audio, and text tracks and is commonly used in Apple-based video production workflows. MOV files often use high-quality codecs.',
    strengths: ['High-quality video support', 'Native Apple ecosystem compatibility', 'Professional editing support', 'Multiple track support'],
    commonUses: ['Apple-based video editing', 'iPhone and Mac video recordings', 'Professional video production', 'QuickTime playback'],
    technicalNote: 'MOV files recorded on Apple devices often use the HEVC codec. Converting MOV to MP4 provides broader compatibility across non-Apple devices and platforms.',
  },
  MKV: {
    fullName: 'MKV (Matroska Video)',
    description: 'MKV is an open-source multimedia container format that can hold an unlimited number of video, audio, subtitle, and metadata tracks. It is popular for storing movies and TV shows because of its flexibility and support for high-quality codecs.',
    strengths: ['Supports unlimited tracks', 'Open-source format', 'Handles most modern codecs', 'Chapter and metadata support'],
    commonUses: ['Movie and TV show storage', 'Archival of video content', 'Subtitle embedding', 'High-quality video distribution'],
    technicalNote: 'MKV may not play natively on all devices, particularly mobile phones and some smart TVs. Converting MKV to MP4 improves compatibility for playback.',
  },
  WebM: {
    fullName: 'WebM',
    description: 'WebM is an open multimedia format developed by Google for use on the web. It uses VP8/VP9 video codecs and Vorbis/Opus audio codecs. WebM is designed for efficient web streaming and is supported natively in most browsers.',
    strengths: ['Optimized for web delivery', 'Open and royalty-free', 'Supported in all modern browsers', 'Good compression for streaming'],
    commonUses: ['Web video embedding', 'HTML5 video playback', 'Browser-based video applications', 'Web streaming'],
    technicalNote: 'WebM is primarily a web format. For playback on desktop media players or mobile devices outside of browsers, MP4 is generally more compatible.',
  },
  FLV: {
    fullName: 'FLV (Flash Video)',
    description: 'FLV is a video container format originally used with Adobe Flash Player. While Flash has been discontinued, FLV files still exist from older video content. The format supported efficient streaming but has been largely replaced by MP4 and WebM.',
    strengths: ['Small file sizes', 'Historically used for web video', 'Simple format structure'],
    commonUses: ['Legacy Flash video content', 'Older web video archives'],
    technicalNote: 'Flash Player has been discontinued by Adobe. FLV files should be converted to MP4 or WebM for continued playback in modern browsers and media players.',
  },
  WMV: {
    fullName: 'WMV (Windows Media Video)',
    description: 'WMV is a video format developed by Microsoft as part of the Windows Media framework. It was designed for streaming and playback on Windows systems. While still supported in some applications, it has been largely superseded by MP4.',
    strengths: ['Good Windows compatibility', 'Designed for streaming', 'Supported by Windows Media Player'],
    commonUses: ['Windows-based video playback', 'Legacy video content', 'Windows Media streaming'],
    technicalNote: 'WMV has limited support on non-Windows platforms. Converting to MP4 ensures compatibility across all major operating systems and devices.',
  },
  MP3: {
    fullName: 'MP3 (MPEG Audio Layer III)',
    description: 'MP3 is the most commonly used audio format for music and spoken-word content. It uses lossy compression to reduce file size significantly while maintaining acceptable audio quality. MP3 is supported by virtually every device and software application.',
    strengths: ['Universal device and software support', 'Good compression-to-quality ratio', 'Small file sizes', 'Metadata support (ID3 tags)'],
    commonUses: ['Music playback and distribution', 'Podcasts and audiobooks', 'Web audio', 'Portable music players'],
    technicalNote: 'MP3 uses lossy compression, meaning some audio data is discarded to reduce file size. For archival or professional use, lossless formats like FLAC or WAV may be preferred.',
  },
  WAV: {
    fullName: 'WAV (Waveform Audio File Format)',
    description: 'WAV is an uncompressed audio format that stores raw audio data. It preserves the full quality of the original recording without any compression artifacts, resulting in larger file sizes. WAV is a standard format for professional audio production.',
    strengths: ['Uncompressed, full-quality audio', 'No compression artifacts', 'Industry standard for audio production', 'Simple, well-supported format'],
    commonUses: ['Professional audio editing', 'Music production', 'Sound design', 'Audio archival'],
    technicalNote: 'WAV files are substantially larger than compressed formats. A 3-minute song in WAV format is approximately 30 MB, compared to about 3 MB in MP3.',
  },
  OGG: {
    fullName: 'OGG (Ogg Vorbis)',
    description: 'OGG is a free, open-source audio format that uses the Vorbis codec for lossy compression. It generally provides better audio quality than MP3 at equivalent bitrates. OGG is commonly used in web applications, games, and open-source software.',
    strengths: ['Open-source and royalty-free', 'Better quality than MP3 at same bitrates', 'Good streaming support', 'Supported in most web browsers'],
    commonUses: ['Web audio and games', 'Open-source audio projects', 'Streaming applications', 'HTML5 audio'],
    technicalNote: 'OGG has less device support than MP3, particularly on Apple devices. Converting to MP3 provides broader compatibility when needed.',
  },
  FLAC: {
    fullName: 'FLAC (Free Lossless Audio Codec)',
    description: 'FLAC is a lossless audio format that compresses audio without losing any data. It typically reduces file size by 50-70% compared to WAV while preserving identical audio quality. FLAC is widely used by audiophiles and for music archival.',
    strengths: ['Lossless compression preserves full quality', 'Significant size reduction vs. WAV', 'Open-source and royalty-free', 'Metadata and album art support'],
    commonUses: ['Lossless music storage', 'Audio archival', 'High-fidelity audio playback', 'Music library management'],
    technicalNote: 'While FLAC preserves perfect audio quality, the files are still several times larger than MP3. Not all portable devices support FLAC natively.',
  },
  AAC: {
    fullName: 'AAC (Advanced Audio Coding)',
    description: 'AAC is a lossy audio format designed as the successor to MP3. It provides better sound quality than MP3 at the same bitrate and is the default audio format for Apple products, YouTube, and many streaming services.',
    strengths: ['Better quality than MP3 at same bitrate', 'Default format for Apple devices', 'Efficient compression', 'Supports multichannel audio'],
    commonUses: ['iTunes and Apple Music', 'YouTube audio', 'Streaming services', 'Mobile audio playback'],
    technicalNote: 'AAC is widely supported but may require conversion to MP3 for compatibility with older devices or software that does not support AAC decoding.',
  },
  WMA: {
    fullName: 'WMA (Windows Media Audio)',
    description: 'WMA is an audio format developed by Microsoft. It was designed to compete with MP3 and offers both lossy and lossless compression modes. WMA has good support on Windows systems but limited compatibility elsewhere.',
    strengths: ['Good compression on Windows', 'Supports lossless mode', 'DRM support', 'Windows ecosystem integration'],
    commonUses: ['Windows Media Player playback', 'Legacy Windows audio', 'Windows-based media libraries'],
    technicalNote: 'WMA support is limited on non-Windows platforms. Converting WMA to MP3 provides universal compatibility.',
  },
  M4A: {
    fullName: 'M4A (MPEG-4 Audio)',
    description: 'M4A is an audio-only container based on the MPEG-4 standard. It typically uses AAC encoding and is the default audio format for Apple products. M4A provides good audio quality at smaller file sizes compared to MP3.',
    strengths: ['Better quality than MP3 at similar sizes', 'Native Apple device support', 'Metadata and album art support', 'Good compression efficiency'],
    commonUses: ['Apple Music and iTunes', 'iPhone voice recordings', 'Podcasts', 'Apple ecosystem audio'],
    technicalNote: 'M4A is essentially AAC audio in an MPEG-4 container. Converting to MP3 may be needed for compatibility with devices and software that do not support M4A.',
  },
  DOCX: {
    fullName: 'DOCX (Microsoft Word Document)',
    description: 'DOCX is the default document format for Microsoft Word. It uses XML-based formatting and supports rich text, images, tables, headers, footers, and complex document layouts. DOCX has become a standard format for document exchange across platforms.',
    strengths: ['Rich formatting and layout support', 'Industry-standard document format', 'Cross-platform compatibility', 'Supports images, tables, and embedded objects'],
    commonUses: ['Business documents and reports', 'Academic papers', 'Contracts and proposals', 'General document creation'],
    technicalNote: 'Converting DOCX to other formats may result in some formatting differences, particularly for complex layouts, custom fonts, or embedded objects.',
  },
  PDF: {
    fullName: 'PDF (Portable Document Format)',
    description: 'PDF is a document format created by Adobe that preserves the exact layout, fonts, and images of a document regardless of the device or software used to view it. PDFs are widely used for documents that need to look the same everywhere.',
    strengths: ['Consistent appearance across devices', 'Preserves exact layout and formatting', 'Supports forms, annotations, and signatures', 'Print-ready format'],
    commonUses: ['Official documents and reports', 'Invoices and receipts', 'eBooks and manuals', 'Forms and contracts'],
    technicalNote: 'Converting to PDF preserves visual layout. Converting from PDF to editable formats may not perfectly recreate the original formatting.',
  },
  TXT: {
    fullName: 'TXT (Plain Text)',
    description: 'TXT is a simple file format that stores unformatted text. It contains only raw text characters without any styling, images, or layout information. TXT files are universally readable by any text editor or programming environment.',
    strengths: ['Universal compatibility', 'Extremely small file sizes', 'Readable by any text editor', 'No formatting dependencies'],
    commonUses: ['Code and configuration files', 'Data exchange', 'Quick notes and drafts', 'Log files'],
    technicalNote: 'TXT files contain only plain text. When converting from formatted documents (like DOCX), all formatting, images, and layout information will be stripped.',
  },
  CSV: {
    fullName: 'CSV (Comma-Separated Values)',
    description: 'CSV is a simple text-based format for storing tabular data. Each row represents a record, and fields within a row are separated by commas (or other delimiters). CSV is widely used for data import/export between different applications.',
    strengths: ['Simple, human-readable structure', 'Universal data exchange format', 'Supported by all spreadsheet applications', 'Easy to parse programmatically'],
    commonUses: ['Database import and export', 'Spreadsheet data exchange', 'Report generation', 'Data migration between applications'],
    technicalNote: 'CSV stores only raw data without formulas, formatting, charts, or multiple sheets. Converting from XLSX to CSV will preserve only the data values from the first sheet.',
  },
  XLSX: {
    fullName: 'XLSX (Microsoft Excel Spreadsheet)',
    description: 'XLSX is the default spreadsheet format for Microsoft Excel. It supports multiple worksheets, formulas, charts, formatting, and data validation. XLSX is an XML-based format that has become the standard for spreadsheet data.',
    strengths: ['Multiple worksheets support', 'Formulas and calculated fields', 'Rich formatting and charts', 'Large data capacity'],
    commonUses: ['Financial spreadsheets', 'Data analysis', 'Business reporting', 'Project tracking'],
    technicalNote: 'Converting CSV to XLSX creates a formatted spreadsheet with auto-sized columns and styled headers. Converting XLSX to CSV extracts raw data values only.',
  },
  ZIP: {
    fullName: 'ZIP',
    description: 'ZIP is the most widely used archive format. It compresses one or more files into a single container, reducing total file size and simplifying file transfer. ZIP is natively supported by Windows, macOS, and Linux.',
    strengths: ['Universal operating system support', 'Built-in compression', 'Supports multiple files and folders', 'Optional password protection'],
    commonUses: ['File compression and bundling', 'Email attachments', 'Software distribution', 'Backup archives'],
    technicalNote: 'ZIP uses DEFLATE compression by default. Conversion between archive formats re-packages the contents without altering the files inside.',
  },
  TAR: {
    fullName: 'TAR (Tape Archive)',
    description: 'TAR is an archive format that bundles multiple files into a single file without compression. It is commonly used in Unix and Linux systems, often combined with gzip (.tar.gz) or bzip2 (.tar.bz2) for compression.',
    strengths: ['Preserves Unix file permissions', 'Standard on Linux/Unix systems', 'Commonly paired with compression', 'Handles large numbers of files well'],
    commonUses: ['Linux software distribution', 'Server backups', 'Source code packaging', 'System administration'],
    technicalNote: 'TAR alone does not compress files. For compressed archives, TAR is typically combined with gzip (.tar.gz). Converting from ZIP to TAR creates an uncompressed archive.',
  },
  GZ: {
    fullName: 'GZ (Gzip)',
    description: 'GZ (gzip) is a compression format that uses the DEFLATE algorithm. It is commonly used in Unix and Linux environments, often combined with TAR to create compressed archive files (.tar.gz). Gzip provides good compression ratios.',
    strengths: ['Efficient compression', 'Standard on Unix/Linux systems', 'Fast compression and decompression', 'Widely supported'],
    commonUses: ['Compressing TAR archives', 'Web server content compression', 'Log file compression', 'Data transfer optimization'],
    technicalNote: 'GZ compresses a single file or data stream. For archiving multiple files with gzip compression, the files are first combined with TAR and then compressed with gzip.',
  },
};

// ── Localized content layer ──────────────────────────────────────────────

// Full format names (acronym expansions) — not translated; shared across locales.
const FULL_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(formatDatabase).map(([k, v]) => [k.toUpperCase(), v.fullName]),
);

// English benefit/FAQ/intro templates (the source for the translated bundles).
// Placeholders in {curly braces} are filled at render time. These MUST stay in
// sync with the strings translated into src/data/convert-content/<locale>.json.
const EN_BENEFITS: ConvertContent['benefits'] = {
  sizeReduction: 'Reduce file size by converting from {fromName} to the more compact {to} format',
  compatibility: 'Improve compatibility by converting to {to}, which is supported by virtually all devices and applications',
  lossless: 'Convert to a lossless format that preserves data without additional compression',
  webOptimize: 'Optimize for web delivery with the modern {to} format',
  transparency: 'Gain transparency support that the source format does not provide',
  heic: 'Make Apple device photos accessible on Windows, Android, and other platforms',
  mov: 'Convert Apple video recordings for use on non-Apple devices',
  audioExtract: 'Extract just the audio track from a video file without needing video editing software',
  pdf: 'Create a portable document that looks the same on any device or operating system',
  csv: 'Export data to a simple, universally readable text format for use in databases, scripts, or other applications',
  xlsx: 'Open data in Excel with formatted columns, headers, and the ability to add formulas and charts',
  generic: 'Convert your {from} file to {to} format for use in applications that require it',
  targetUses: 'Put {toName} to work for {toUses}',
  browser: 'Convert {from} to {to} right in your browser — nothing to install and no account to create',
};

const EN_FAQS: ConvertContent['faqs'] = {
  howToQ: 'How do I convert {from} to {to}?',
  howToA: 'To convert a {from} file to {to}, use the upload area on this page. Drag and drop your {from} file or click to browse your files. Once uploaded, click the "Convert to {to}" button. The conversion will be processed and the resulting {to} file will be available for download.',
  freeQ: 'Is the {from} to {to} conversion free?',
  freeA: 'Yes. This conversion tool is completely free to use. There are no premium tiers, no watermarks applied to your output, and no limit on the number of conversions you can perform. The service is supported by advertising.',
  differenceQ: 'What is the difference between {from} and {to}?',
  differenceA: '{fromName} {fromDescFirst}. {toName} {toDescFirst}. Converting between these formats allows you to take advantage of the strengths of each format depending on your specific needs.',
  whenQ: 'When should I convert {from} to {to}?',
  whenA: 'Converting {from} to {to} makes sense when you need what {toName} is good at: {toStrengths}. It is commonly used for {toUses}.',
  qualityQ: 'Will I lose quality when converting {from} to {to}?',
  qualityMediaA: 'The output quality depends on the codecs and settings involved. When converting between lossy formats, some quality adjustment is expected. Video and audio conversions in FlipMyFiles are processed in your browser using standard encoding settings designed to maintain good quality.',
  qualityNonMediaA: 'The output quality depends on the formats involved. Converting from a lossy format to a lossless format does not recover lost data, but no additional quality is lost. Converting from lossless to lossy involves some data reduction to achieve smaller file sizes. Image conversions use optimized settings to maintain visual quality.',
  privacyQ: 'Are my files safe and private?',
  privacyMediaA: 'Yes. Video and audio conversions are processed entirely in your browser using WebAssembly technology. Your file is never uploaded to our servers. The conversion happens locally on your device, providing full privacy.',
  privacyNonMediaA: 'Yes. Files uploaded for conversion are processed in server memory and discarded immediately after the converted file is returned to your browser. We do not store, copy, or analyze your files. All transfers are encrypted using HTTPS.',
  maxSizeQ: 'What is the maximum file size for conversion?',
  maxSizeMediaA: "The maximum file size is 250 MB per file. This limit applies to all format types. For video and audio files, conversion speed depends on your device's processing power since the conversion runs in your browser.",
  maxSizeNonMediaA: 'The maximum file size is 250 MB per file. This limit applies to all format types. Most conversions complete within a few seconds for typical file sizes.',
};

const EN_INTRO_FALLBACK =
  'Converting {from} to {to} changes your file from {fromName} to {toName}. {from} files are commonly used for {fromUses}, while {to} is a better fit when you need {toStrength}. Convert to {to} when an application or platform requires it, or when its strengths suit your project better than {from}. Upload your {from} file above to convert it in seconds — no software to install and no account required.';

// English content bundle. Format text is keyed UPPERCASE — this also fixes the
// WebP/WebM entries, whose mixed-case keys never matched the uppercase lookup.
const EN_CONTENT: ConvertContent = {
  formats: Object.fromEntries(
    Object.entries(formatDatabase).map(([k, v]) => [k.toUpperCase(), {
      description: v.description,
      strengths: v.strengths,
      commonUses: v.commonUses,
      technicalNote: v.technicalNote,
    }]),
  ),
  benefits: EN_BENEFITS,
  faqs: EN_FAQS,
  introFallback: EN_INTRO_FALLBACK,
};

const LOCALE_CONTENT: Record<string, ConvertContent> = { en: EN_CONTENT, ...localeBundles };

function getContent(locale: string): ConvertContent {
  return LOCALE_CONTENT[locale] ?? EN_CONTENT;
}

function interp(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : `{${k}}`));
}

// Localized "and" so two-item lists joined into prose read naturally per locale.
const CONJ: Record<string, string> = {
  en: 'and', de: 'und', fr: 'et', es: 'y', pt: 'e', it: 'e',
  pl: 'i', se: 'och', ua: 'та', cz: 'a', el: 'και',
};

function joinAnd(items: string[], locale: string): string {
  return items.join(` ${CONJ[locale] ?? 'and'} `);
}

function formatText(format: string, locale: string): FormatText {
  const key = format.toUpperCase();
  return getContent(locale).formats[key] ?? EN_CONTENT.formats[key] ?? {
    description: `${key} is a file format used for storing and exchanging data.`,
    strengths: ['Standard file format'],
    commonUses: ['General file exchange'],
    technicalNote: '',
  };
}

export function getFormatInfo(format: string, locale: string = 'en'): FormatInfo {
  const key = format.toUpperCase();
  return { fullName: FULL_NAMES[key] ?? key, ...formatText(format, locale) };
}

export function getConversionBenefits(from: string, to: string, locale: string = 'en'): string[] {
  const f = from.toUpperCase();
  const t = to.toUpperCase();
  const b = getContent(locale).benefits;
  const fromInfo = getFormatInfo(from, locale);
  const toInfo = getFormatInfo(to, locale);
  const vars: Record<string, string> = {
    from: f,
    to: t,
    fromName: fromInfo.fullName,
    toName: toInfo.fullName,
    toUses: joinAnd(toInfo.commonUses.slice(0, 2), locale),
  };
  const benefits: string[] = [];

  const smallFormats = ['JPG', 'WEBP', 'AVIF', 'MP3', 'AAC', 'OGG', 'M4A', 'MP4', 'GZ'];
  const largeFormats = ['BMP', 'TIFF', 'WAV', 'FLAC', 'AVI', 'MOV'];
  if (largeFormats.includes(f) && smallFormats.includes(t)) benefits.push(interp(b.sizeReduction, vars));

  const universalFormats = ['JPG', 'PNG', 'MP4', 'MP3', 'PDF'];
  if (universalFormats.includes(t) && !universalFormats.includes(f)) benefits.push(interp(b.compatibility, vars));

  const losslessFormats = ['PNG', 'TIFF', 'WAV', 'FLAC', 'BMP'];
  if (losslessFormats.includes(t) && !losslessFormats.includes(f)) benefits.push(interp(b.lossless, vars));

  const webFormats = ['WEBP', 'AVIF', 'WEBM', 'SVG'];
  if (webFormats.includes(t)) benefits.push(interp(b.webOptimize, vars));

  if (['PNG', 'WEBP', 'AVIF'].includes(t) && ['JPG', 'BMP'].includes(f)) benefits.push(interp(b.transparency, vars));

  if (f === 'HEIC') benefits.push(interp(b.heic, vars));
  if (f === 'MOV') benefits.push(interp(b.mov, vars));

  const videoFormats = ['MP4', 'AVI', 'MOV', 'MKV', 'WEBM', 'FLV', 'WMV'];
  const audioFormats = ['MP3', 'WAV', 'OGG', 'FLAC', 'AAC', 'WMA', 'M4A'];
  if (videoFormats.includes(f) && audioFormats.includes(t)) benefits.push(interp(b.audioExtract, vars));

  if (t === 'PDF') benefits.push(interp(b.pdf, vars));
  if (t === 'CSV') benefits.push(interp(b.csv, vars));
  if (t === 'XLSX') benefits.push(interp(b.xlsx, vars));

  if (benefits.length === 0) benefits.push(interp(b.generic, vars));

  // Target-format strength — varies per conversion instead of being boilerplate.
  if (toInfo.commonUses.length > 0) benefits.push(interp(b.targetUses, vars));
  benefits.push(interp(b.browser, vars));

  return benefits;
}

export function getDetailedFaqs(from: string, to: string, locale: string = 'en'): { question: string; answer: string }[] {
  const f = from.toUpperCase();
  const t = to.toUpperCase();
  const q = getContent(locale).faqs;
  const fromInfo = getFormatInfo(from, locale);
  const toInfo = getFormatInfo(to, locale);

  const videoFormats = ['MP4', 'AVI', 'MOV', 'MKV', 'WEBM', 'FLV', 'WMV'];
  const audioFormats = ['MP3', 'WAV', 'OGG', 'FLAC', 'AAC', 'WMA', 'M4A'];
  const isMedia = videoFormats.includes(f) || videoFormats.includes(t) || audioFormats.includes(f) || audioFormats.includes(t);

  const vars: Record<string, string> = {
    from: f,
    to: t,
    fromName: fromInfo.fullName,
    toName: toInfo.fullName,
    fromDescFirst: fromInfo.description.split('. ').slice(0, 1).join('. '),
    toDescFirst: toInfo.description.split('. ').slice(0, 1).join('. '),
    toStrengths: toInfo.strengths.slice(0, 3).join(', '),
    toUses: toInfo.commonUses.slice(0, 3).join(', '),
  };

  const whenAnswer = interp(q.whenA, vars) + (toInfo.technicalNote ? ` ${toInfo.technicalNote}` : '');

  return [
    { question: interp(q.howToQ, vars), answer: interp(q.howToA, vars) },
    { question: interp(q.freeQ, vars), answer: interp(q.freeA, vars) },
    { question: interp(q.differenceQ, vars), answer: interp(q.differenceA, vars) },
    { question: interp(q.whenQ, vars), answer: whenAnswer },
    { question: interp(q.qualityQ, vars), answer: isMedia ? interp(q.qualityMediaA, vars) : interp(q.qualityNonMediaA, vars) },
    { question: interp(q.privacyQ, vars), answer: isMedia ? interp(q.privacyMediaA, vars) : interp(q.privacyNonMediaA, vars) },
    { question: interp(q.maxSizeQ, vars), answer: isMedia ? interp(q.maxSizeMediaA, vars) : interp(q.maxSizeNonMediaA, vars) },
  ];
}

/**
 * Hand-written, genuinely pair-specific overview copy for the highest-traffic
 * conversions (the `popular` pairs). Keyed by `${FROM}_${TO}` (uppercased).
 * Pairs not listed here fall back to a richer composed intro (see getConversionIntro).
 */
const conversionIntros: Record<string, string> = {
  PNG_JPG:
    'Converting PNG to JPG usually comes down to file size. PNG stores images losslessly, which keeps every pixel perfect but produces large files — especially for photographs. JPG uses lossy compression tuned for photographic content, so the same image often shrinks by 70–90% with little visible difference. That makes JPG ideal for websites, email attachments, and anywhere upload size or page-load speed matters. The trade-off is that JPG drops the PNG’s transparency (transparent areas are filled with a solid background) and applies compression that can soften fine text or sharp edges. For photos and screenshots without transparency, converting PNG to JPG is almost always worth it; for logos, icons, or images you’ll keep editing, keep the PNG as your master copy.',
  JPG_PNG:
    'Converting JPG to PNG moves an image from a compressed, lossy format to a lossless one. It will not restore detail that JPG compression already removed — those pixels are baked in — but it stops any further quality loss and gives you a format that supports transparency and crisp edges. This is useful when you need to edit and re-save an image repeatedly without accumulating JPG artifacts, when you want to add a transparent background later, or when a tool or platform specifically requires PNG. Keep in mind the resulting PNG will usually be larger than the original JPG, since PNG does not throw data away. For photos you’ll publish as-is, JPG is fine; convert to PNG when you need an editable, lossless working copy or transparency support.',
  WEBP_PNG:
    'Converting WebP to PNG is mostly about compatibility. WebP compresses smaller than PNG or JPG, but some older software, editors, and workflows still can’t open it. PNG is supported virtually everywhere, so converting gives you a file you can drop into any application, document, or design tool. Because PNG is lossless, the conversion preserves exactly what the WebP contains, including transparency — though if the source was a lossy WebP, quality already lost stays lost. Expect the PNG to be noticeably larger than the WebP, since PNG trades file size for universal support. Convert WebP to PNG when you’ve downloaded a WebP image and need it to work in a program that doesn’t recognize the format, or when you want a transparent, editable copy.',
  PNG_WEBP:
    'Converting PNG to WebP is a web-optimization win. WebP was designed to make web images smaller, and it typically produces files 25–35% smaller than PNG while keeping the same visual quality and full transparency support. Smaller images mean faster page loads, better Core Web Vitals, and lower bandwidth — which is why WebP is now supported by every modern browser. The conversion preserves transparency, so logos, icons, and graphics keep their alpha channel. The main consideration is compatibility: a few older tools and email clients still don’t render WebP, so keep a PNG copy if you need to share the image outside the browser. For images going onto a website, converting PNG to WebP is one of the simplest performance improvements you can make.',
  HEIC_JPG:
    'Converting HEIC to JPG solves the compatibility problem most people hit with iPhone photos. HEIC is Apple’s high-efficiency format — it stores great-looking images at roughly half the size of JPG — but Windows, Android, many websites, and older apps often can’t open it. Converting to JPG produces a universally supported file you can upload, email, print, or edit anywhere. The conversion involves a small quality trade-off, since both formats are lossy, but at standard settings the difference is essentially invisible. The resulting JPG may be a little larger than the HEIC for the same image. Convert HEIC to JPG whenever you need to share iPhone photos with someone on a non-Apple device, upload them to a site that rejects HEIC, or open them in software that doesn’t recognize Apple’s format.',
  SVG_PNG:
    'Converting SVG to PNG turns a scalable vector graphic into a fixed-resolution raster image. SVG is built from mathematical shapes, so it stays razor-sharp at any size and is perfect for logos and icons — but it isn’t accepted everywhere. Many platforms, social networks, and image tools require a raster format like PNG. Converting rasterizes the vector at a specific pixel size, producing a PNG you can use anywhere, with transparency preserved. The key choice is the output dimensions: because the result is fixed-resolution, render it large enough for its intended use, since a PNG can’t be scaled up later without losing sharpness. Convert SVG to PNG when you need to upload a logo to a site that rejects SVG, embed it in a document, or use it in software that only handles raster images.',
  MP4_GIF:
    'Converting MP4 to GIF turns a short video clip into an animated image that plays automatically and loops everywhere — in chats, on social media, in emails, and inside documents. GIFs are ideal for quick reactions, product demos, and tutorials because they need no player and start instantly. The trade-offs are real: GIF supports only 256 colors and compresses poorly, so a GIF is often much larger than the source MP4 and looks less smooth, especially for longer or detailed footage. For the best results, convert short clips of a few seconds rather than full videos. Convert MP4 to GIF when you want a clip that auto-plays and loops without a video player; if file size or visual quality matters more, keeping the MP4 is usually better.',
  MP4_MP3:
    'Converting MP4 to MP3 extracts just the audio from a video file. It’s the go-to method for turning lectures, podcasts, interviews, or music videos into a listen-anywhere audio track you can play on a phone, in the car, or in any music app. MP3 is the most universally supported audio format, so the result works essentially everywhere. The conversion discards the video and keeps the sound; because MP3 is lossy, audio is re-encoded at standard quality, which is more than enough for speech and general listening. The resulting file is dramatically smaller than the original video. Convert MP4 to MP3 whenever you only need the audio — to build a podcast library, save a song, or listen to a talk without watching the screen.',
  WAV_MP3:
    'Converting WAV to MP3 trades a small amount of audio quality for a huge reduction in file size. WAV is uncompressed and stores audio in full fidelity, which is great for editing but produces very large files — often ten times the size of an equivalent MP3. MP3 uses lossy compression tuned for the way people hear, so at a good bitrate the difference is hard to notice while the file becomes far easier to store, stream, and share. This makes MP3 the practical choice for music libraries, podcasts, and audio you’ll distribute online. Keep the original WAV if you plan to do further editing, since you can’t recover detail once it’s compressed. Convert WAV to MP3 when you’re ready to publish or store audio and want it portable and lightweight.',
  JPG_WEBP:
    'Converting JPG to WebP shrinks photographs further without an obvious drop in quality. WebP’s compression is more efficient than JPG’s, so the same image typically comes out 25–35% smaller — a meaningful saving for websites, where every kilobyte affects load time and Core Web Vitals. Because both formats are lossy, you’re re-compressing an already-compressed image, so start from a good-quality JPG to avoid stacking artifacts. WebP is supported by all modern browsers, which makes it an easy upgrade for web images, but a few older tools still don’t read it, so keep the JPG if you need to share the photo outside the browser. Convert JPG to WebP when you’re optimizing images for a website and want smaller files and faster pages while keeping the photo looking the same.',
  BMP_PNG:
    'Converting BMP to PNG is almost always an upgrade. BMP is an old, uncompressed bitmap format that stores every pixel with no compression, which makes files enormous for what they contain. PNG stores the same image losslessly — so no quality is lost — but compresses it efficiently, typically cutting the file size dramatically. PNG is also far more widely supported on the web and in modern software, and it adds transparency support that BMP lacks. There’s essentially no downside: the image looks identical and the file gets smaller and more portable. Convert BMP to PNG whenever you need to share, upload, or store a bitmap image and want a smaller, universally supported file without sacrificing any quality.',
  TIFF_JPG:
    'Converting TIFF to JPG makes a large, professional-grade image practical to share. TIFF is favored in photography, scanning, and publishing because it stores images at maximum quality, often uncompressed — but that makes files very large and means many websites and everyday apps won’t accept them. JPG compresses the image into a much smaller file that uploads, emails, and displays everywhere. The conversion is lossy, so it’s best for final output rather than archival masters: keep the TIFF as your high-quality original and use the JPG for sharing. For photographs the quality difference at standard settings is minimal while the size saving is enormous. Convert TIFF to JPG when you need to send a scan or high-resolution photo to someone, post it online, or open it in software that doesn’t handle TIFF.',
};

/**
 * A pair-specific overview paragraph for a conversion page. Uses hand-written
 * copy for popular pairs and otherwise composes a richer intro from the real
 * per-format database (descriptions + common uses), so every page carries
 * substantive, non-duplicate lead copy.
 */
export function getConversionIntro(from: string, to: string, locale: string = 'en'): string {
  const key = `${from.toUpperCase()}_${to.toUpperCase()}`;
  // English popular pairs use their hand-written intro; everything else (and all
  // non-English locales) uses the localized, composed fallback template.
  if (locale === 'en' && conversionIntros[key]) return conversionIntros[key];

  const fromInfo = getFormatInfo(from, locale);
  const toInfo = getFormatInfo(to, locale);
  return interp(getContent(locale).introFallback, {
    from: from.toUpperCase(),
    to: to.toUpperCase(),
    fromName: fromInfo.fullName,
    toName: toInfo.fullName,
    fromUses: joinAnd(fromInfo.commonUses.slice(0, 2), locale),
    toStrength: joinAnd(toInfo.strengths.slice(0, 2), locale),
  });
}
