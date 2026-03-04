/**
 * Content generation helpers for conversion pages.
 * Provides format descriptions, conversion benefits, and FAQ content
 * so each /convert/[slug] page has substantial, unique, informational text.
 */

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

export function getFormatInfo(format: string): FormatInfo {
  const key = format.toUpperCase();
  return formatDatabase[key] || {
    fullName: format.toUpperCase(),
    description: `${format.toUpperCase()} is a file format used for storing and exchanging data.`,
    strengths: ['Standard file format'],
    commonUses: ['General file exchange'],
    technicalNote: '',
  };
}

export function getConversionBenefits(from: string, to: string): string[] {
  const fromInfo = getFormatInfo(from);
  const toInfo = getFormatInfo(to);
  const benefits: string[] = [];

  // Size-related benefits
  const smallFormats = ['JPG', 'WEBP', 'AVIF', 'MP3', 'AAC', 'OGG', 'M4A', 'MP4', 'GZ'];
  const largeFormats = ['BMP', 'TIFF', 'WAV', 'FLAC', 'AVI', 'MOV'];
  if (largeFormats.includes(from.toUpperCase()) && smallFormats.includes(to.toUpperCase())) {
    benefits.push(`Reduce file size by converting from ${fromInfo.fullName} to the more compact ${to.toUpperCase()} format`);
  }

  // Compatibility benefits
  const universalFormats = ['JPG', 'PNG', 'MP4', 'MP3', 'PDF'];
  if (universalFormats.includes(to.toUpperCase()) && !universalFormats.includes(from.toUpperCase())) {
    benefits.push(`Improve compatibility by converting to ${to.toUpperCase()}, which is supported by virtually all devices and applications`);
  }

  // Quality benefits
  const losslessFormats = ['PNG', 'TIFF', 'WAV', 'FLAC', 'BMP'];
  if (losslessFormats.includes(to.toUpperCase()) && !losslessFormats.includes(from.toUpperCase())) {
    benefits.push(`Convert to a lossless format that preserves data without additional compression`);
  }

  // Web optimization
  const webFormats = ['WEBP', 'AVIF', 'WEBM', 'SVG'];
  if (webFormats.includes(to.toUpperCase())) {
    benefits.push(`Optimize for web delivery with the modern ${to.toUpperCase()} format`);
  }

  // Transparency
  if (['PNG', 'WEBP', 'AVIF'].includes(to.toUpperCase()) && ['JPG', 'BMP'].includes(from.toUpperCase())) {
    benefits.push('Gain transparency support that the source format does not provide');
  }

  // Apple/cross-platform
  if (from.toUpperCase() === 'HEIC') {
    benefits.push('Make Apple device photos accessible on Windows, Android, and other platforms');
  }
  if (from.toUpperCase() === 'MOV') {
    benefits.push('Convert Apple video recordings for use on non-Apple devices');
  }

  // Audio extraction
  const videoFormats = ['MP4', 'AVI', 'MOV', 'MKV', 'WEBM', 'FLV', 'WMV'];
  const audioFormats = ['MP3', 'WAV', 'OGG', 'FLAC', 'AAC', 'WMA', 'M4A'];
  if (videoFormats.includes(from.toUpperCase()) && audioFormats.includes(to.toUpperCase())) {
    benefits.push('Extract just the audio track from a video file without needing video editing software');
  }

  // Document portability
  if (to.toUpperCase() === 'PDF') {
    benefits.push('Create a portable document that looks the same on any device or operating system');
  }

  // Data interchange
  if (to.toUpperCase() === 'CSV') {
    benefits.push('Export data to a simple, universally readable text format for use in databases, scripts, or other applications');
  }
  if (to.toUpperCase() === 'XLSX') {
    benefits.push('Open data in Excel with formatted columns, headers, and the ability to add formulas and charts');
  }

  // Generic benefit
  if (benefits.length === 0) {
    benefits.push(`Convert your ${from.toUpperCase()} file to ${to.toUpperCase()} format for use in applications that require it`);
  }

  benefits.push('No software installation required — convert directly in your browser');
  benefits.push('No registration or personal information needed to use the service');

  return benefits;
}

export function getDetailedFaqs(from: string, to: string): { question: string; answer: string }[] {
  const fromInfo = getFormatInfo(from);
  const toInfo = getFormatInfo(to);
  const f = from.toUpperCase();
  const t = to.toUpperCase();

  const videoFormats = ['MP4', 'AVI', 'MOV', 'MKV', 'WEBM', 'FLV', 'WMV'];
  const audioFormats = ['MP3', 'WAV', 'OGG', 'FLAC', 'AAC', 'WMA', 'M4A'];
  const isMediaConversion = videoFormats.includes(f) || videoFormats.includes(t) || audioFormats.includes(f) || audioFormats.includes(t);

  const faqs = [
    {
      question: `How do I convert ${f} to ${t}?`,
      answer: `To convert a ${f} file to ${t}, use the upload area on this page. Drag and drop your ${f} file or click to browse your files. Once uploaded, click the "Convert to ${t}" button. The conversion will be processed and the resulting ${t} file will be available for download.`,
    },
    {
      question: `Is the ${f} to ${t} conversion free?`,
      answer: `Yes. This conversion tool is completely free to use. There are no premium tiers, no watermarks applied to your output, and no limit on the number of conversions you can perform. The service is supported by advertising.`,
    },
    {
      question: `What is the difference between ${f} and ${t}?`,
      answer: `${fromInfo.fullName} ${fromInfo.description.split('. ').slice(0, 1).join('. ')}. ${toInfo.fullName} ${toInfo.description.split('. ').slice(0, 1).join('. ')}. Converting between these formats allows you to take advantage of the strengths of each format depending on your specific needs.`,
    },
    {
      question: `Will I lose quality when converting ${f} to ${t}?`,
      answer: isMediaConversion
        ? `The output quality depends on the codecs and settings involved. When converting between lossy formats, some quality adjustment is expected. Video and audio conversions in FlipMyFiles are processed in your browser using standard encoding settings designed to maintain good quality.`
        : `The output quality depends on the formats involved. Converting from a lossy format to a lossless format does not recover lost data, but no additional quality is lost. Converting from lossless to lossy involves some data reduction to achieve smaller file sizes. Image conversions use optimized settings to maintain visual quality.`,
    },
    {
      question: 'Are my files safe and private?',
      answer: isMediaConversion
        ? `Yes. Video and audio conversions are processed entirely in your browser using WebAssembly technology. Your file is never uploaded to our servers. The conversion happens locally on your device, providing full privacy.`
        : `Yes. Files uploaded for conversion are processed in server memory and discarded immediately after the converted file is returned to your browser. We do not store, copy, or analyze your files. All transfers are encrypted using HTTPS.`,
    },
    {
      question: 'What is the maximum file size for conversion?',
      answer: `The maximum file size is 250 MB per file. This limit applies to all format types. ${isMediaConversion ? 'For video and audio files, conversion speed depends on your device\'s processing power since the conversion runs in your browser.' : 'Most conversions complete within a few seconds for typical file sizes.'}`,
    },
  ];

  return faqs;
}
