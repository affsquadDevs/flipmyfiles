export interface FormatCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface ConversionPair {
  from: string;
  to: string;
  slug: string;
  category: string;
  description: string;
  popular?: boolean;
}

export const categories: FormatCategory[] = [
  { id: 'image', name: 'Image', icon: '🖼', description: 'Convert between image formats' },
  { id: 'video', name: 'Video', icon: '🎬', description: 'Convert video files' },
  { id: 'audio', name: 'Audio', icon: '🎵', description: 'Convert audio files' },
  { id: 'document', name: 'Document', icon: '📄', description: 'Convert documents and spreadsheets' },
  { id: 'ebook', name: 'eBook', icon: '📚', description: 'Convert eBook formats' },
  { id: 'archive', name: 'Archive', icon: '📦', description: 'Convert archive formats' },
];

export const popularConversions: ConversionPair[] = [
  { from: 'PNG', to: 'JPG', slug: 'png-to-jpg', category: 'image', description: 'Convert PNG images to JPG format with adjustable quality', popular: true },
  { from: 'JPG', to: 'PNG', slug: 'jpg-to-png', category: 'image', description: 'Convert JPG images to PNG with transparency support', popular: true },
  { from: 'WebP', to: 'PNG', slug: 'webp-to-png', category: 'image', description: 'Convert WebP images to widely-supported PNG format', popular: true },
  { from: 'PNG', to: 'WebP', slug: 'png-to-webp', category: 'image', description: 'Convert PNG to WebP for smaller file sizes', popular: true },
  { from: 'HEIC', to: 'JPG', slug: 'heic-to-jpg', category: 'image', description: 'Convert iPhone HEIC photos to JPG', popular: true },
  { from: 'SVG', to: 'PNG', slug: 'svg-to-png', category: 'image', description: 'Rasterize SVG vector graphics to PNG', popular: true },
  { from: 'MP4', to: 'GIF', slug: 'mp4-to-gif', category: 'video', description: 'Create animated GIFs from MP4 videos', popular: true },
  { from: 'MP4', to: 'MP3', slug: 'mp4-to-mp3', category: 'video', description: 'Extract audio from MP4 video files', popular: true },
  { from: 'WAV', to: 'MP3', slug: 'wav-to-mp3', category: 'audio', description: 'Compress WAV audio to MP3 format', popular: true },
  { from: 'JPG', to: 'WebP', slug: 'jpg-to-webp', category: 'image', description: 'Convert JPG to WebP for web optimization', popular: true },
  { from: 'BMP', to: 'PNG', slug: 'bmp-to-png', category: 'image', description: 'Convert BMP bitmap to compressed PNG', popular: true },
  { from: 'TIFF', to: 'JPG', slug: 'tiff-to-jpg', category: 'image', description: 'Convert TIFF images to compressed JPG', popular: true },
];

export const allConversions: ConversionPair[] = [
  ...popularConversions,
  // Image conversions
  { from: 'JPG', to: 'BMP', slug: 'jpg-to-bmp', category: 'image', description: 'Convert JPG to BMP bitmap format' },
  { from: 'JPG', to: 'TIFF', slug: 'jpg-to-tiff', category: 'image', description: 'Convert JPG to lossless TIFF format' },
  { from: 'PNG', to: 'BMP', slug: 'png-to-bmp', category: 'image', description: 'Convert PNG to BMP bitmap format' },
  { from: 'PNG', to: 'TIFF', slug: 'png-to-tiff', category: 'image', description: 'Convert PNG to TIFF format' },
  { from: 'PNG', to: 'ICO', slug: 'png-to-ico', category: 'image', description: 'Create ICO favicon from PNG image' },
  { from: 'WebP', to: 'JPG', slug: 'webp-to-jpg', category: 'image', description: 'Convert WebP images to JPG format' },
  { from: 'GIF', to: 'PNG', slug: 'gif-to-png', category: 'image', description: 'Convert GIF to PNG (first frame)' },
  { from: 'BMP', to: 'JPG', slug: 'bmp-to-jpg', category: 'image', description: 'Convert BMP to compressed JPG' },
  { from: 'TIFF', to: 'PNG', slug: 'tiff-to-png', category: 'image', description: 'Convert TIFF to PNG format' },
  { from: 'AVIF', to: 'PNG', slug: 'avif-to-png', category: 'image', description: 'Convert AVIF to PNG format' },
  { from: 'PNG', to: 'AVIF', slug: 'png-to-avif', category: 'image', description: 'Convert PNG to AVIF for modern compression' },
  { from: 'JPG', to: 'AVIF', slug: 'jpg-to-avif', category: 'image', description: 'Convert JPG to next-gen AVIF format' },
  { from: 'AVIF', to: 'JPG', slug: 'avif-to-jpg', category: 'image', description: 'Convert AVIF to widely-supported JPG' },
  // Video conversions
  { from: 'AVI', to: 'MP4', slug: 'avi-to-mp4', category: 'video', description: 'Convert AVI to modern MP4 format' },
  { from: 'MOV', to: 'MP4', slug: 'mov-to-mp4', category: 'video', description: 'Convert Apple MOV to MP4' },
  { from: 'MKV', to: 'MP4', slug: 'mkv-to-mp4', category: 'video', description: 'Convert MKV to MP4 format' },
  { from: 'WebM', to: 'MP4', slug: 'webm-to-mp4', category: 'video', description: 'Convert WebM to MP4 video' },
  { from: 'FLV', to: 'MP4', slug: 'flv-to-mp4', category: 'video', description: 'Convert Flash FLV to MP4' },
  { from: 'WMV', to: 'MP4', slug: 'wmv-to-mp4', category: 'video', description: 'Convert Windows WMV to MP4' },
  { from: 'MP4', to: 'WebM', slug: 'mp4-to-webm', category: 'video', description: 'Convert MP4 to WebM for web' },
  // Audio conversions
  { from: 'MP3', to: 'WAV', slug: 'mp3-to-wav', category: 'audio', description: 'Convert MP3 to uncompressed WAV' },
  { from: 'OGG', to: 'MP3', slug: 'ogg-to-mp3', category: 'audio', description: 'Convert OGG Vorbis to MP3' },
  { from: 'FLAC', to: 'MP3', slug: 'flac-to-mp3', category: 'audio', description: 'Convert lossless FLAC to MP3' },
  { from: 'AAC', to: 'MP3', slug: 'aac-to-mp3', category: 'audio', description: 'Convert AAC audio to MP3' },
  { from: 'WMA', to: 'MP3', slug: 'wma-to-mp3', category: 'audio', description: 'Convert WMA to MP3 format' },
  { from: 'M4A', to: 'MP3', slug: 'm4a-to-mp3', category: 'audio', description: 'Convert M4A to MP3 format' },
  { from: 'FLAC', to: 'WAV', slug: 'flac-to-wav', category: 'audio', description: 'Convert FLAC to WAV audio' },
  // Additional audio conversions
  { from: 'MP3', to: 'OGG', slug: 'mp3-to-ogg', category: 'audio', description: 'Convert MP3 to OGG Vorbis format' },
  { from: 'MP3', to: 'FLAC', slug: 'mp3-to-flac', category: 'audio', description: 'Convert MP3 to lossless FLAC' },
  { from: 'MP3', to: 'AAC', slug: 'mp3-to-aac', category: 'audio', description: 'Convert MP3 to AAC audio' },
  { from: 'WAV', to: 'OGG', slug: 'wav-to-ogg', category: 'audio', description: 'Convert WAV to OGG Vorbis' },
  { from: 'WAV', to: 'FLAC', slug: 'wav-to-flac', category: 'audio', description: 'Convert WAV to lossless FLAC' },
  { from: 'WAV', to: 'AAC', slug: 'wav-to-aac', category: 'audio', description: 'Convert WAV to AAC format' },
  { from: 'OGG', to: 'WAV', slug: 'ogg-to-wav', category: 'audio', description: 'Convert OGG to WAV audio' },
  { from: 'M4A', to: 'WAV', slug: 'm4a-to-wav', category: 'audio', description: 'Convert M4A to WAV audio' },
  { from: 'AAC', to: 'WAV', slug: 'aac-to-wav', category: 'audio', description: 'Convert AAC to WAV audio' },
  // Additional video conversions
  { from: 'MP4', to: 'AVI', slug: 'mp4-to-avi', category: 'video', description: 'Convert MP4 to AVI format' },
  { from: 'MP4', to: 'MOV', slug: 'mp4-to-mov', category: 'video', description: 'Convert MP4 to Apple MOV' },
  { from: 'MP4', to: 'MKV', slug: 'mp4-to-mkv', category: 'video', description: 'Convert MP4 to MKV container' },
  { from: 'MOV', to: 'AVI', slug: 'mov-to-avi', category: 'video', description: 'Convert MOV to AVI format' },
  { from: 'MOV', to: 'WebM', slug: 'mov-to-webm', category: 'video', description: 'Convert MOV to WebM for web' },
  { from: 'AVI', to: 'WebM', slug: 'avi-to-webm', category: 'video', description: 'Convert AVI to WebM for web' },
  { from: 'MKV', to: 'AVI', slug: 'mkv-to-avi', category: 'video', description: 'Convert MKV to AVI format' },
  { from: 'WebM', to: 'AVI', slug: 'webm-to-avi', category: 'video', description: 'Convert WebM to AVI format' },
  // Video to audio extraction
  { from: 'MOV', to: 'MP3', slug: 'mov-to-mp3', category: 'video', description: 'Extract audio from MOV video' },
  { from: 'AVI', to: 'MP3', slug: 'avi-to-mp3', category: 'video', description: 'Extract audio from AVI video' },
  { from: 'MKV', to: 'MP3', slug: 'mkv-to-mp3', category: 'video', description: 'Extract audio from MKV video' },
  { from: 'WebM', to: 'MP3', slug: 'webm-to-mp3', category: 'video', description: 'Extract audio from WebM video' },
  { from: 'MP4', to: 'WAV', slug: 'mp4-to-wav', category: 'video', description: 'Extract WAV audio from MP4 video' },
  { from: 'MP4', to: 'AAC', slug: 'mp4-to-aac', category: 'video', description: 'Extract AAC audio from MP4 video' },
  // Document conversions
  { from: 'DOCX', to: 'PDF', slug: 'docx-to-pdf', category: 'document', description: 'Convert Word documents to PDF' },
  { from: 'DOCX', to: 'TXT', slug: 'docx-to-txt', category: 'document', description: 'Extract text from Word documents' },
  { from: 'CSV', to: 'XLSX', slug: 'csv-to-xlsx', category: 'document', description: 'Convert CSV to Excel spreadsheet' },
  { from: 'XLSX', to: 'CSV', slug: 'xlsx-to-csv', category: 'document', description: 'Convert Excel to CSV format' },
  { from: 'TXT', to: 'PDF', slug: 'txt-to-pdf', category: 'document', description: 'Convert plain text to PDF document' },
  // Archive conversions
  { from: 'ZIP', to: 'TAR', slug: 'zip-to-tar', category: 'archive', description: 'Convert ZIP archive to TAR format' },
  { from: 'ZIP', to: 'GZ', slug: 'zip-to-gz', category: 'archive', description: 'Convert ZIP to compressed GZ archive' },
  { from: 'TAR', to: 'ZIP', slug: 'tar-to-zip', category: 'archive', description: 'Convert TAR archive to ZIP format' },
  { from: 'TAR', to: 'GZ', slug: 'tar-to-gz', category: 'archive', description: 'Compress TAR archive with GZIP' },
  { from: 'GZ', to: 'ZIP', slug: 'gz-to-zip', category: 'archive', description: 'Convert GZ archive to ZIP format' },
];

export function getConversionBySlug(slug: string): ConversionPair | undefined {
  return allConversions.find(c => c.slug === slug);
}

export function getConversionsByCategory(categoryId: string): ConversionPair[] {
  return allConversions.filter(c => c.category === categoryId);
}

export function getCategoryIcon(format: string): string {
  const f = format.toUpperCase();
  const imageFormats = ['JPG', 'JPEG', 'PNG', 'WEBP', 'GIF', 'BMP', 'TIFF', 'SVG', 'ICO', 'HEIC', 'AVIF'];
  const videoFormats = ['MP4', 'AVI', 'MOV', 'MKV', 'WEBM', 'FLV', 'WMV'];
  const audioFormats = ['MP3', 'WAV', 'OGG', 'FLAC', 'AAC', 'WMA', 'M4A'];
  const docFormats = ['PDF', 'DOCX', 'DOC', 'XLSX', 'XLS', 'CSV', 'TXT', 'RTF', 'PPTX'];

  const archiveFormats = ['ZIP', 'RAR', '7Z', 'TAR', 'GZ'];

  if (imageFormats.includes(f)) return '🖼';
  if (videoFormats.includes(f)) return '🎬';
  if (audioFormats.includes(f)) return '🎵';
  if (docFormats.includes(f)) return '📄';
  if (archiveFormats.includes(f)) return '📦';
  return '📁';
}
