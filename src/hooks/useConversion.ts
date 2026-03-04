'use client';

import { useState, useCallback } from 'react';
import { ConversionOptions } from '@/types/formats';

interface ConversionResult {
  blob: Blob;
  filename: string;
  size: number;
}

export function useConversion() {
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const convert = useCallback(async (
    file: File,
    outputFormat: string,
    options: ConversionOptions = {}
  ) => {
    setIsConverting(true);
    setProgress(0);
    setError(null);
    setResult(null);
    setLoadingMessage('');

    try {
      const inputExt = (file.name.split('.').pop() || '').toLowerCase();

      // Check if this is a client-side media conversion
      const { isClientSideConversion } = await import('@/lib/conversion/ffmpeg-client');

      if (isClientSideConversion(inputExt, outputFormat)) {
        // Client-side conversion via FFmpeg WASM
        setLoadingMessage('Loading FFmpeg engine (first time may take a moment)...');
        setProgress(5);

        const { convertMediaClientSide } = await import('@/lib/conversion/ffmpeg-client');

        setLoadingMessage('Processing your file...');
        setProgress(15);

        const { blob, filename } = await convertMediaClientSide(
          file,
          outputFormat,
          options,
          (p) => {
            // FFmpeg progress is 0-100, map to 15-95
            setProgress(15 + Math.round(p * 0.8));
          }
        );

        setProgress(100);
        setResult({ blob, filename, size: blob.size });
      } else {
        // Server-side conversion (images, documents)
        setLoadingMessage('Uploading file...');
        setProgress(10);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('outputFormat', outputFormat.toLowerCase());
        formData.append('options', JSON.stringify(options));

        setProgress(30);
        setLoadingMessage('Converting...');

        const response = await fetch('/api/convert', {
          method: 'POST',
          body: formData,
        });

        setProgress(70);

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || `Conversion failed (${response.status})`);
        }

        const blob = await response.blob();
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `converted.${outputFormat.toLowerCase()}`;
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^";\n]+)"?/);
          if (match) filename = match[1];
        }

        setProgress(100);
        setResult({ blob, filename, size: blob.size });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setIsConverting(false);
      setLoadingMessage('');
    }
  }, []);

  const download = useCallback(() => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [result]);

  const reset = useCallback(() => {
    setIsConverting(false);
    setProgress(0);
    setResult(null);
    setError(null);
    setLoadingMessage('');
  }, []);

  return {
    isConverting,
    progress,
    result,
    error,
    loadingMessage,
    convert,
    download,
    reset,
  };
}
