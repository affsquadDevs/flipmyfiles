import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;
let loadPromise: Promise<void> | null = null;

export async function getFFmpeg(
  onProgress?: (progress: number) => void
): Promise<FFmpeg> {
  if (ffmpeg && ffmpeg.loaded) return ffmpeg;

  if (loadPromise) {
    await loadPromise;
    return ffmpeg!;
  }

  ffmpeg = new FFmpeg();

  if (onProgress) {
    ffmpeg.on('progress', ({ progress }) => {
      onProgress(Math.round(progress * 100));
    });
  }

  loadPromise = (async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
    await ffmpeg!.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
  })();

  await loadPromise;
  return ffmpeg;
}

export interface FFmpegConversionOptions {
  videoBitrate?: string;
  audioBitrate?: string;
  resolution?: string;
  frameRate?: number;
  mute?: boolean;
  sampleRate?: number;
  channels?: number;
  normalize?: boolean;
}

function getExtension(format: string): string {
  const map: Record<string, string> = {
    mp3: 'mp3', wav: 'wav', ogg: 'ogg', flac: 'flac', aac: 'aac',
    wma: 'wma', m4a: 'm4a',
    mp4: 'mp4', avi: 'avi', mov: 'mov', mkv: 'mkv', webm: 'webm',
    flv: 'flv', wmv: 'wmv', gif: 'gif',
  };
  return map[format.toLowerCase()] || format.toLowerCase();
}

function buildVideoArgs(
  inputFile: string,
  outputFile: string,
  inputFormat: string,
  outputFormat: string,
  options: FFmpegConversionOptions
): string[] {
  const args: string[] = ['-i', inputFile];
  const outLower = outputFormat.toLowerCase();
  const inLower = inputFormat.toLowerCase();

  // Video-to-audio extraction (e.g. MP4 -> MP3)
  const audioFormats = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'];
  const videoFormats = ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv'];

  const isInputVideo = videoFormats.includes(inLower);
  const isOutputAudio = audioFormats.includes(outLower);
  const isOutputVideo = videoFormats.includes(outLower) || outLower === 'gif';

  if (isInputVideo && isOutputAudio) {
    // Extract audio from video
    args.push('-vn'); // No video
    if (options.audioBitrate) args.push('-b:a', options.audioBitrate);
    if (options.sampleRate) args.push('-ar', String(options.sampleRate));
    if (options.channels) args.push('-ac', String(options.channels));

    // Format-specific codecs
    if (outLower === 'mp3') {
      args.push('-codec:a', 'libmp3lame');
      if (!options.audioBitrate) args.push('-b:a', '192k');
    } else if (outLower === 'ogg') {
      args.push('-codec:a', 'libvorbis');
    } else if (outLower === 'flac') {
      args.push('-codec:a', 'flac');
    } else if (outLower === 'aac' || outLower === 'm4a') {
      args.push('-codec:a', 'aac');
      if (!options.audioBitrate) args.push('-b:a', '192k');
    }
  } else if (isOutputVideo && outLower !== 'gif') {
    // Video-to-video conversion
    if (options.resolution) {
      args.push('-s', options.resolution);
    }
    if (options.videoBitrate) {
      args.push('-b:v', options.videoBitrate);
    }
    if (options.frameRate) {
      args.push('-r', String(options.frameRate));
    }
    if (options.mute) {
      args.push('-an');
    } else {
      if (options.audioBitrate) args.push('-b:a', options.audioBitrate);
    }

    // Output format-specific settings
    if (outLower === 'mp4') {
      args.push('-codec:v', 'libx264', '-preset', 'fast', '-movflags', '+faststart');
      if (!options.mute) args.push('-codec:a', 'aac');
    } else if (outLower === 'webm') {
      args.push('-codec:v', 'libvpx', '-codec:a', 'libvorbis');
    } else if (outLower === 'avi') {
      args.push('-codec:v', 'mpeg4');
    }
  } else if (outLower === 'gif') {
    // Video to GIF
    args.push(
      '-vf', 'fps=10,scale=480:-1:flags=lanczos',
      '-t', '10' // Max 10 seconds for GIF
    );
  } else {
    // Audio-to-audio conversion
    if (options.audioBitrate) args.push('-b:a', options.audioBitrate);
    if (options.sampleRate) args.push('-ar', String(options.sampleRate));
    if (options.channels) args.push('-ac', String(options.channels));

    if (outLower === 'mp3') {
      args.push('-codec:a', 'libmp3lame');
      if (!options.audioBitrate) args.push('-b:a', '192k');
    } else if (outLower === 'ogg') {
      args.push('-codec:a', 'libvorbis');
    } else if (outLower === 'flac') {
      args.push('-codec:a', 'flac');
    } else if (outLower === 'aac' || outLower === 'm4a') {
      args.push('-codec:a', 'aac');
    } else if (outLower === 'wav') {
      args.push('-codec:a', 'pcm_s16le');
    }
  }

  args.push(outputFile);
  return args;
}

export async function convertMediaClientSide(
  file: File,
  outputFormat: string,
  options: FFmpegConversionOptions = {},
  onProgress?: (progress: number) => void
): Promise<{ blob: Blob; filename: string }> {
  const ff = await getFFmpeg(onProgress);

  const inputExt = getExtension(file.name.split('.').pop() || '');
  const outputExt = getExtension(outputFormat);
  const inputFile = `input.${inputExt}`;
  const outputFile = `output.${outputExt}`;
  const baseName = file.name.replace(/\.[^.]+$/, '');
  const filename = `${baseName}.${outputExt}`;

  // Write input file to FFmpeg's virtual filesystem
  const fileData = await fetchFile(file);
  await ff.writeFile(inputFile, fileData);

  // Build and execute FFmpeg command
  const inputFormat = inputExt;
  const args = buildVideoArgs(inputFile, outputFile, inputFormat, outputFormat, options);

  const exitCode = await ff.exec(args);
  if (exitCode !== 0) {
    throw new Error('FFmpeg conversion failed. The file may be corrupted or the format is not supported.');
  }

  // Read output
  const data = await ff.readFile(outputFile);

  // Cleanup
  await ff.deleteFile(inputFile);
  await ff.deleteFile(outputFile);

  // Determine MIME type
  const mimeMap: Record<string, string> = {
    mp4: 'video/mp4', avi: 'video/x-msvideo', mov: 'video/quicktime',
    mkv: 'video/x-matroska', webm: 'video/webm', flv: 'video/x-flv',
    wmv: 'video/x-ms-wmv', gif: 'image/gif',
    mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg',
    flac: 'audio/flac', aac: 'audio/aac', m4a: 'audio/mp4',
    wma: 'audio/x-ms-wma',
  };

  const dataBytes = data instanceof Uint8Array ? new Uint8Array(data.buffer, data.byteOffset, data.byteLength) : data;
  const blob = new Blob([dataBytes as BlobPart], { type: mimeMap[outputExt] || 'application/octet-stream' });
  return { blob, filename };
}

// Format detection helpers
const VIDEO_FORMATS = new Set(['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv']);
const AUDIO_FORMATS = new Set(['mp3', 'wav', 'ogg', 'flac', 'aac', 'wma', 'm4a']);

export function isVideoFormat(format: string): boolean {
  return VIDEO_FORMATS.has(format.toLowerCase());
}

export function isAudioFormat(format: string): boolean {
  return AUDIO_FORMATS.has(format.toLowerCase());
}

export function isMediaFormat(format: string): boolean {
  return isVideoFormat(format) || isAudioFormat(format);
}

export function isClientSideConversion(inputFormat: string, outputFormat: string): boolean {
  const inLower = inputFormat.toLowerCase();
  const outLower = outputFormat.toLowerCase();

  // Video -> Video
  if (isVideoFormat(inLower) && isVideoFormat(outLower)) return true;
  // Video -> Audio (extraction)
  if (isVideoFormat(inLower) && isAudioFormat(outLower)) return true;
  // Audio -> Audio
  if (isAudioFormat(inLower) && isAudioFormat(outLower)) return true;
  // Video -> GIF
  if (isVideoFormat(inLower) && outLower === 'gif') return true;

  return false;
}
