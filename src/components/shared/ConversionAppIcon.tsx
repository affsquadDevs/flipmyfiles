const FORMAT_COLORS: Record<string, string> = {
  PNG:  '#EC4899',
  JPG:  '#F97316',
  JPEG: '#F97316',
  WEBP: '#8B5CF6',
  HEIC: '#3B82F6',
  SVG:  '#10B981',
  BMP:  '#64748B',
  TIFF: '#6366F1',
  GIF:  '#EAB308',
  AVIF: '#14B8A6',
  ICO:  '#A855F7',
  MP4:  '#EF4444',
  AVI:  '#DC2626',
  MOV:  '#B91C1C',
  MKV:  '#991B1B',
  WEBM: '#7F1D1D',
  MP3:  '#22C55E',
  WAV:  '#06B6D4',
  AAC:  '#0EA5E9',
  OGG:  '#38BDF8',
  FLAC: '#0284C7',
  PDF:  '#EF4444',
  DOC:  '#2563EB',
  DOCX: '#2563EB',
  XLS:  '#16A34A',
  XLSX: '#16A34A',
  PPT:  '#EA580C',
  PPTX: '#EA580C',
  ZIP:  '#D97706',
  RAR:  '#B45309',
};

export function getFormatColor(format: string): string {
  return FORMAT_COLORS[format.toUpperCase()] ?? '#6B7280';
}

export function ConversionAppIcon({ from, to }: { from: string; to: string }) {
  const fromColor = getFormatColor(from);
  const toColor = getFormatColor(to);

  return (
    <div className="flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-2xl bg-gray-100 shadow-sm">
      <span
        className="flex items-center justify-center rounded-md px-1.5 py-0.5 text-[10px] font-black tracking-wide text-white leading-none"
        style={{ backgroundColor: fromColor, minWidth: '38px' }}
      >
        {from.length > 4 ? from.slice(0, 4) : from}
      </span>
      <span
        className="flex items-center justify-center rounded-md px-1.5 py-0.5 text-[10px] font-black tracking-wide text-white leading-none"
        style={{ backgroundColor: toColor, minWidth: '38px' }}
      >
        {to.length > 4 ? to.slice(0, 4) : to}
      </span>
    </div>
  );
}
