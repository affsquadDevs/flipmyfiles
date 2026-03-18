'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';

type ToolState = 'idle' | 'ready' | 'processing' | 'done' | 'error';

const IMAGE_EXTS = new Set(['jpg', 'jpeg', 'png', 'webp', 'gif', 'tiff', 'tif', 'avif', 'bmp']);
const PDF_EXTS = new Set(['pdf']);
const VIDEO_EXTS = new Set(['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv']);
const AUDIO_EXTS = new Set(['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma']);

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getExt(file: File) {
  return file.name.split('.').pop()?.toLowerCase() || '';
}

function getIcon(ext: string): string {
  if (IMAGE_EXTS.has(ext)) return '🖼';
  if (PDF_EXTS.has(ext)) return '📄';
  if (VIDEO_EXTS.has(ext)) return '🎬';
  if (AUDIO_EXTS.has(ext)) return '🎵';
  return '📁';
}

const SUPPORTED_ALL = new Set([...IMAGE_EXTS, ...PDF_EXTS, ...VIDEO_EXTS, ...AUDIO_EXTS]);

export default function MetadataEraserTool() {
  const t = useTranslations('metadataEraser');
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<ToolState>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');

  const handleFile = useCallback((f: File) => {
    const ext = getExt(f);
    if (!SUPPORTED_ALL.has(ext)) {
      setError(`Unsupported format: .${ext}`);
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

    const ext = getExt(file);
    const isServer = IMAGE_EXTS.has(ext) || PDF_EXTS.has(ext);

    try {
      if (isServer) {
        setLoadingMsg(t('uploadingMsg'));
        setProgress(20);
        const formData = new FormData();
        formData.append('file', file);
        setProgress(40);
        setLoadingMsg(t('processingMsg'));
        const res = await fetch('/api/tools/metadata-eraser', { method: 'POST', body: formData });
        setProgress(80);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to erase metadata');
        }
        const blob = await res.blob();
        const cd = res.headers.get('Content-Disposition');
        let filename = `${file.name.replace(/\.[^.]+$/, '')}_clean.${ext}`;
        if (cd) {
          const m = cd.match(/filename="?([^";\n]+)"?/);
          if (m) filename = m[1];
        }
        setProgress(100);
        setResult({ blob, filename });
        setState('done');
      } else {
        // Client-side via FFmpeg (video / audio)
        setLoadingMsg(t('loadingFFmpeg'));
        setProgress(5);

        const { getFFmpeg } = await import('@/lib/conversion/ffmpeg-client');
        const { fetchFile } = await import('@ffmpeg/util');

        const ff = await getFFmpeg();
        ff.on('progress', ({ progress: p }) => {
          setProgress(10 + Math.round(p * 85));
        });

        const inputName = `input.${ext}`;
        const outputName = `output.${ext}`;

        setLoadingMsg(t('processingMsg'));
        setProgress(10);

        const fileData = await fetchFile(file);
        await ff.writeFile(inputName, fileData);

        // Stream copy — fast, no re-encode, just strips container metadata
        const exitCode = await ff.exec([
          '-i', inputName,
          '-map_metadata', '-1',
          '-c', 'copy',
          outputName,
        ]);

        if (exitCode !== 0) {
          throw new Error('Could not process this file. Try a different format.');
        }

        const data = await ff.readFile(outputName);
        await ff.deleteFile(inputName).catch(() => {});
        await ff.deleteFile(outputName).catch(() => {});

        const mimeMap: Record<string, string> = {
          mp4: 'video/mp4', mov: 'video/quicktime', avi: 'video/x-msvideo',
          mkv: 'video/x-matroska', webm: 'video/webm', flv: 'video/x-flv',
          wmv: 'video/x-ms-wmv', mp3: 'audio/mpeg', wav: 'audio/wav',
          ogg: 'audio/ogg', flac: 'audio/flac', aac: 'audio/aac',
          m4a: 'audio/mp4', wma: 'audio/x-ms-wma',
        };

        const bytes = data instanceof Uint8Array ? data : new Uint8Array(data as unknown as ArrayBuffer);
        const blob = new Blob([bytes], { type: mimeMap[ext] || 'application/octet-stream' });
        const filename = `${file.name.replace(/\.[^.]+$/, '')}_clean.${ext}`;

        setProgress(100);
        setResult({ blob, filename });
        setState('done');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to erase metadata');
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
          className={`cursor-pointer p-10 sm:p-14 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${isDragging ? 'bg-primary/5 ring-2 ring-primary ring-inset scale-[1.01]' : 'hover:bg-gray-50/60'}`}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-cta/10 text-primary shadow-sm">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{t('dropTitle')}</p>
              <p className="mt-1 text-sm text-text-muted">{t('dropSubtitle')}</p>
            </div>
            <button type="button" className="mt-1 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark active:scale-[0.98]">
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
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>
      )}

      {/* Ready — file info + process button */}
      {state === 'ready' && file && (
        <div className="p-8">
          <div className="flex items-center gap-4 rounded-xl border border-border bg-gray-50 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-2xl">
              {getIcon(getExt(file))}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-gray-900">{file.name}</p>
              <p className="text-sm text-text-muted">{formatSize(file.size)} · .{getExt(file).toUpperCase()}</p>
            </div>
            <button onClick={reset} className="shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={handleProcess}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl active:scale-[0.98]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              {t('eraseButton')}
            </button>
          </div>
        </div>
      )}

      {/* Processing */}
      {state === 'processing' && (
        <div className="p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <svg className="h-8 w-8 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <p className="mt-4 font-semibold text-gray-900">{loadingMsg || t('processingMsg')}</p>
          <div className="mx-auto mt-4 max-w-xs">
            <div className="h-2 rounded-full bg-gray-100">
              <div className="h-2 rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
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
              {t('cleanAnother')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
