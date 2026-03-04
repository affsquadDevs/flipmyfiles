'use client';

import { useState, useCallback } from 'react';
import type { BatchFile } from '@/components/upload/BatchFileList';

export function useBatchConversion() {
  const [files, setFiles] = useState<BatchFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [completedBlobs, setCompletedBlobs] = useState<{ blob: Blob; filename: string }[]>([]);

  const addFiles = useCallback((newFiles: File[]) => {
    const batch: BatchFile[] = newFiles.map(f => ({
      id: crypto.randomUUID(),
      file: f,
      name: f.name,
      size: f.size,
      extension: (f.name.split('.').pop() || '').toLowerCase(),
      status: 'pending' as const,
    }));
    setFiles(prev => [...prev, ...batch]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const convertAll = useCallback(async (outputFormat: string) => {
    setIsConverting(true);
    const results: { blob: Blob; filename: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setFiles(prev =>
        prev.map(f => f.id === file.id ? { ...f, status: 'converting' as const } : f)
      );

      try {
        const inputExt = file.extension;

        // Check if client-side
        const { isClientSideConversion, convertMediaClientSide } = await import(
          '@/lib/conversion/ffmpeg-client'
        );

        let blob: Blob;
        let filename: string;

        if (isClientSideConversion(inputExt, outputFormat)) {
          const result = await convertMediaClientSide(file.file, outputFormat);
          blob = result.blob;
          filename = result.filename;
        } else {
          // Server-side
          const formData = new FormData();
          formData.append('file', file.file);
          formData.append('outputFormat', outputFormat.toLowerCase());

          const response = await fetch('/api/convert', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.error || 'Conversion failed');
          }

          blob = await response.blob();
          const baseName = file.name.replace(/\.[^.]+$/, '');
          filename = `${baseName}.${outputFormat.toLowerCase()}`;
        }

        results.push({ blob, filename });
        setFiles(prev =>
          prev.map(f =>
            f.id === file.id
              ? { ...f, status: 'completed' as const, resultBlob: blob, resultFilename: filename }
              : f
          )
        );
      } catch (err) {
        setFiles(prev =>
          prev.map(f =>
            f.id === file.id
              ? { ...f, status: 'error' as const, error: err instanceof Error ? err.message : 'Failed' }
              : f
          )
        );
      }
    }

    setCompletedBlobs(results);
    setIsConverting(false);
  }, [files]);

  const downloadAll = useCallback(async () => {
    if (completedBlobs.length === 0) return;

    if (completedBlobs.length === 1) {
      const { blob, filename } = completedBlobs[0];
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }

    // Multiple files: create a client-side ZIP
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();

    for (const { blob, filename } of completedBlobs) {
      zip.file(filename, blob);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted-files.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [completedBlobs]);

  const reset = useCallback(() => {
    setFiles([]);
    setIsConverting(false);
    setCompletedBlobs([]);
  }, []);

  return {
    files,
    isConverting,
    completedCount: completedBlobs.length,
    addFiles,
    removeFile,
    convertAll,
    downloadAll,
    reset,
  };
}
