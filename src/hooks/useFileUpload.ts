'use client';

import { useState, useCallback } from 'react';
import { validateFile, getFileExtension, formatFileSize } from '@/lib/validators';
import { normalizeExtension } from '@/lib/formats';

export type UploadState =
  | 'idle'
  | 'dragging'
  | 'file-selected'
  | 'invalid'
  | 'converting'
  | 'completed'
  | 'error';

export interface UploadedFile {
  file: File;
  name: string;
  size: number;
  sizeFormatted: string;
  extension: string;
  format: string;
}

export function useFileUpload() {
  const [state, setState] = useState<UploadState>('idle');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback((file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      setState('invalid');
      setError(validation.error || 'Invalid file');
      setUploadedFile(null);
      return;
    }

    const ext = getFileExtension(file.name);
    const normalized = normalizeExtension(ext);

    setUploadedFile({
      file,
      name: file.name,
      size: file.size,
      sizeFormatted: formatFileSize(file.size),
      extension: normalized,
      format: normalized.toUpperCase(),
    });
    setState('file-selected');
    setError(null);
  }, []);

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;
    processFile(fileArray[0]);
  }, [processFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState('idle');

    const files = e.dataTransfer.files;
    handleFiles(files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState('dragging');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState(uploadedFile ? 'file-selected' : 'idle');
  }, [uploadedFile]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) handleFiles(files);
  }, [handleFiles]);

  const reset = useCallback(() => {
    setState('idle');
    setUploadedFile(null);
    setError(null);
  }, []);

  const setConverting = useCallback(() => setState('converting'), []);
  const setCompleted = useCallback(() => setState('completed'), []);
  const setErrorState = useCallback((msg: string) => {
    setState('error');
    setError(msg);
  }, []);

  return {
    state,
    uploadedFile,
    error,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleInputChange,
    reset,
    setConverting,
    setCompleted,
    setErrorState,
  };
}
