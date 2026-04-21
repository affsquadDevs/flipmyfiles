'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';

type ToolState = 'idle' | 'ready' | 'processing' | 'done' | 'error';
type Intensity = 'low' | 'medium' | 'high';

const VIDEO_EXTS = new Set(['mp4', 'mov', 'avi', 'mkv', 'webm']);

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function buildUniqualizerArgs(inputFile: string, outputFile: string, intensity: Intensity): string[] {
  const baseArgs = ['-i', inputFile, '-map_metadata', '-1', '-map', '0:v:0', '-map', '0:a?'];

  const crf = intensity === 'low' ? '22' : intensity === 'medium' ? '21' : '20';

  let vfFilter = '';
  if (intensity === 'medium') {
    vfFilter = 'eq=brightness=0.01:saturation=1.01';
  } else if (intensity === 'high') {
    vfFilter = 'eq=brightness=0.02:saturation=1.02:gamma=1.01,hue=s=1.02';
  }

  const args = [...baseArgs];
  if (vfFilter) args.push('-vf', vfFilter);
  args.push(
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-crf', crf,
    '-preset', 'fast',
    '-movflags', '+faststart',
    '-c:a', 'aac',
    '-b:a', '128k',
    outputFile,
  );

  return args;
}

export default function VideoUniqualizerTool() {
  const t = useTranslations('uniqualizer');
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<ToolState>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [intensity, setIntensity] = useState<Intensity>('medium');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');

  const handleFile = useCallback((f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase() || '';
    if (!VIDEO_EXTS.has(ext)) {
      setError(`Unsupported format: .${ext}. Please use MP4, MOV, AVI, MKV, or WebM.`);
      setState('error');
      return;
    }
    if (f.size > 250 * 1024 * 1024) {
      setError('File too large. Maximum size is 250 MB.');
      setState('error');
      return;
    }
    setFile(f);
    setState('ready');
    setError(null);
    setResult(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleProcess = async () => {
    if (!file) return;
    setState('processing');
    setProgress(0);
    setError(null);

    const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4';
    const inputName = `input.${ext}`;
    const outputName = `output_unique.mp4`;

    try {
      setLoadingMsg(t('loadingFFmpeg'));
      setProgress(5);

      const { getFFmpeg } = await import('@/lib/conversion/ffmpeg-client');
      const { fetchFile } = await import('@ffmpeg/util');

      const ff = await getFFmpeg();

      const progressHandler = ({ progress: p }: { progress: number }) => {
        setProgress(10 + Math.round(p * 85));
      };
      ff.on('progress', progressHandler);

      try {
        setLoadingMsg(t('processing'));
        setProgress(10);

        const fileData = await fetchFile(file);
        await ff.writeFile(inputName, fileData);

        const args = buildUniqualizerArgs(inputName, outputName, intensity);
        const exitCode = await ff.exec(args);

        if (exitCode !== 0) {
          throw new Error('Processing failed. The video may be corrupted or use an unsupported codec.');
        }

        const data = await ff.readFile(outputName);
        const bytes = Uint8Array.from(data instanceof Uint8Array ? data : new Uint8Array(data as unknown as ArrayBuffer));
        const blob = new Blob([bytes], { type: 'video/mp4' });
        const baseName = file.name.replace(/\.[^.]+$/, '');
        const filename = `${baseName}_unique.mp4`;

        setProgress(100);
        setResult({ blob, filename });
        setState('done');
      } finally {
        ff.off('progress', progressHandler);
        await ff.deleteFile(inputName).catch(() => {});
        await ff.deleteFile(outputName).catch(() => {});
      }
    } catch (err) {
      console.error('[VideoUniqualizerTool] error:', err);
      setError(err instanceof Error ? err.message : typeof err === 'string' ? err : 'Processing failed');
      setState('error');
    } finally {
      setLoadingMsg('');
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setState('idle');
    setFile(null);
    setProgress(0);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const intensityOptions: { key: Intensity; color: string; border: string; ring: string }[] = [
    { key: 'low',    color: 'bg-green-50 text-green-700',   border: 'border-green-200',  ring: 'ring-green-400' },
    { key: 'medium', color: 'bg-blue-50 text-blue-700',     border: 'border-blue-200',   ring: 'ring-blue-400' },
    { key: 'high',   color: 'bg-violet-50 text-violet-700', border: 'border-violet-200', ring: 'ring-violet-400' },
  ];

  return (
    <div className="relative z-20 -mt-20 rounded-2xl border border-border bg-white shadow-2xl overflow-hidden">

      {/* Idle / Error — drop zone */}
      {(state === 'idle' || state === 'error') && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
          className={`cursor-pointer p-10 sm:p-14 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 ${isDragging ? 'bg-cta/5 ring-2 ring-cta ring-inset scale-[1.01]' : 'hover:bg-gray-50/60'}`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cta/20 to-primary/10 text-cta shadow-sm">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h.375a1.125 1.125 0 011.125 1.125v1.5a1.125 1.125 0 01-1.125 1.125H18.75m-17.25 0h.375a1.125 1.125 0 001.125-1.125v-1.5a1.125 1.125 0 00-1.125-1.125H3.375" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{t('dropTitle')}</p>
              <p className="mt-1 text-sm text-text-muted">{t('dropSubtitle')}</p>
            </div>
            <button type="button" className="mt-1 inline-flex items-center gap-2 rounded-xl bg-cta px-7 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cta/25 transition-all hover:bg-cta-hover active:scale-[0.98]">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              {t('dropButton')}
            </button>
            <p className="text-xs text-text-muted">{t('supports')}</p>
            {state === 'error' && error && (
              <p className="mt-2 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm,.mp4,.mov,.avi,.mkv,.webm"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>
      )}

      {/* Ready — file info + intensity selector + process button */}
      {state === 'ready' && file && (
        <div className="p-8">
          <div className="flex items-center gap-4 rounded-xl border border-border bg-gray-50 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cta/10 text-2xl">🎬</div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-gray-900">{file.name}</p>
              <p className="text-sm text-text-muted">{formatSize(file.size)}</p>
            </div>
            <button onClick={reset} className="shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Intensity selector */}
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-gray-700">{t('intensityLabel')}</p>
            <div className="grid grid-cols-3 gap-2">
              {intensityOptions.map(({ key, color, border, ring }) => (
                <button
                  key={key}
                  onClick={() => setIntensity(key)}
                  className={`rounded-xl border-2 p-3 text-left transition-all ${
                    intensity === key
                      ? `${color} ${border} ring-2 ${ring}`
                      : 'border-border bg-white hover:bg-gray-50'
                  }`}
                >
                  <p className="text-sm font-semibold capitalize">{t(key)}</p>
                  <p className="mt-0.5 text-xs text-text-muted leading-tight">{t(`${key}Desc`)}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleProcess}
              className="inline-flex items-center gap-2 rounded-xl bg-cta px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-cta/25 transition-all hover:bg-cta-hover hover:shadow-xl active:scale-[0.98]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
              {t('processButton')}
            </button>
          </div>
        </div>
      )}

      {/* Processing */}
      {state === 'processing' && (
        <div className="p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cta/10">
            <svg className="h-8 w-8 animate-spin text-cta" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className="mt-4 font-semibold text-gray-900">{loadingMsg || t('processing')}</p>
          <p className="mt-1 text-sm text-text-muted">{t('processingHint')}</p>
          <div className="mx-auto mt-4 max-w-xs">
            <div className="h-2 rounded-full bg-gray-100">
              <div className="h-2 rounded-full bg-cta transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-xs text-text-muted">{progress}%</p>
          </div>
        </div>
      )}

      {/* Done */}
      {state === 'done' && result && (
        <div className="p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <p className="mt-4 text-xl font-bold text-gray-900">{t('done')}</p>
          <p className="mt-1 text-sm text-text-muted">{result.filename} · {formatSize(result.blob.size)}</p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-green-600/25 transition-all hover:bg-green-700 hover:shadow-xl active:scale-[0.98]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              {t('download')}
            </button>
            <button onClick={reset} className="rounded-xl border border-border px-6 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 active:scale-[0.98]">
              {t('processAnother')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
