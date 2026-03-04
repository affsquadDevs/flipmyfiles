export interface FileFormat {
  extension: string;
  mimeType: string;
  category: 'image' | 'video' | 'audio' | 'document' | 'ebook' | 'archive';
  label: string;
}

export interface ConversionOptions {
  // Image options
  quality?: number; // 1-100
  width?: number;
  height?: number;
  dpi?: number;
  stripMetadata?: boolean;
  backgroundColor?: string;

  // Video options
  resolution?: string;
  videoBitrate?: string;
  videoCodec?: string;
  frameRate?: number;
  mute?: boolean;

  // Audio options
  audioBitrate?: string;
  audioCodec?: string;
  sampleRate?: number;
  channels?: number;
  normalize?: boolean;
}
