'use client';

import React, { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useConversion } from '@/hooks/useConversion';
import FilePreview from './FilePreview';
import UploadProgress from './UploadProgress';
import FormatSelector from '@/components/conversion/FormatSelector';
import ConversionStatus from '@/components/conversion/ConversionStatus';
import DownloadReady from '@/components/conversion/DownloadReady';
import ConversionError from '@/components/conversion/ConversionError';
import TrustBar from '@/components/shared/TrustBar';
import { getCompatibleOutputFormats } from '@/lib/formats';

export default function DropZone() {
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('home');

  const {
    state: uploadState,
    uploadedFile,
    error: uploadError,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleInputChange,
    reset: resetUpload,
    setConverting,
    setCompleted,
    setErrorState,
  } = useFileUpload();

  const {
    isConverting,
    progress,
    result,
    error: conversionError,
    loadingMessage,
    convert,
    download,
    reset: resetConversion,
  } = useConversion();

  const handleFormatSelect = async (outputFormat: string) => {
    if (!uploadedFile) return;
    setConverting();
    await convert(uploadedFile.file, outputFormat);
    if (!conversionError) {
      setCompleted();
    }
  };

  const handleReset = () => {
    resetUpload();
    resetConversion();
    if (inputRef.current) inputRef.current.value = '';
  };

  const compatibleFormats = uploadedFile
    ? getCompatibleOutputFormats(uploadedFile.format)
    : [];

  // Idle / dragging state
  if (uploadState === 'idle' || uploadState === 'dragging') {
    return (
      <section className="relative overflow-hidden bg-[#080c14] pb-20 pt-16 sm:pb-28 sm:pt-24">
        {/* Glow orbs */}
        <div className="pointer-events-none absolute inset-0 -z-0">
          <div className="absolute -top-20 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-cta/10 blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-[250px] w-[250px] rounded-full bg-primary/10 blur-[80px]" />
        </div>

        {/* Dot grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 -z-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300 mb-6 backdrop-blur-sm sm:px-4 sm:py-1.5 sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-cta animate-pulse" />
            {t('badge')}
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t('hero.title')}{' '}
            <span className="bg-gradient-to-r from-primary-light via-primary to-cta bg-clip-text text-transparent">
              {t('hero.titleHighlight')}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400 sm:text-xl">
            {t('hero.subtitle')}
          </p>

          {/* Upload zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
            role="button"
            tabIndex={0}
            aria-label={t('dropzone.aria')}
            className={`mt-10 cursor-pointer rounded-3xl border-2 border-dashed p-10 transition-all duration-200 sm:p-14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#080c14] ${
              uploadState === 'dragging'
                ? 'border-cta bg-cta/10 scale-[1.02]'
                : 'border-white/15 bg-white/5 hover:border-primary/50 hover:bg-white/8'
            }`}
          >
            <div className="flex flex-col items-center gap-5">
              {/* Icon */}
              <div className={`flex h-20 w-20 items-center justify-center rounded-2xl transition-colors ${
                uploadState === 'dragging'
                  ? 'bg-cta/20 text-cta'
                  : 'bg-primary/20 text-primary-light'
              }`}>
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>

              {/* Text */}
              <div>
                <p className="text-xl font-semibold text-white">
                  {uploadState === 'dragging' ? t('dropzone.dragging') : t('dropzone.idle')}
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  {t('dropzone.subtitle')}
                </p>
              </div>

              {/* CTA button */}
              <span className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/40 transition-all hover:bg-primary-dark hover:shadow-xl">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                {t('dropzone.button')}
              </span>

              {/* Format tags */}
              <div className="flex flex-wrap justify-center gap-2">
                {['JPG', 'PNG', 'MP4', 'MP3', 'PDF', 'DOCX', 'WebP', 'GIF'].map((fmt) => (
                  <span key={fmt} className="rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-gray-400">
                    {fmt}
                  </span>
                ))}
                <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                  +90 more
                </span>
              </div>

              <p className="text-xs text-gray-500">
                {t('dropzone.maxSize')}
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={handleInputChange}
              aria-label={t('dropzone.chooseFile')}
            />
          </div>

          {/* Trust bar */}
          <div className="mt-10">
            <TrustBar dark />
          </div>
        </div>

      </section>
    );
  }

  // Invalid file
  if (uploadState === 'invalid') {
    return (
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <ConversionError error={uploadError || 'Invalid file'} onRetry={handleReset} />
        </div>
      </section>
    );
  }

  // File selected - show format picker
  if (uploadState === 'file-selected' && !isConverting && !result) {
    return (
      <section className="relative overflow-hidden bg-[#080c14] pb-24 pt-16 sm:pb-32 sm:pt-24">
        {/* Glow orbs */}
        <div className="pointer-events-none absolute inset-0 -z-0">
          <div className="absolute -top-20 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-cta/10 blur-[100px]" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 -z-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {t('chooseFormat')}
            </h1>
            <p className="mt-2 text-sm text-gray-400">{t('dropzone.subtitle')}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 mb-4">
            <FilePreview file={uploadedFile!} onRemove={handleReset} />
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
            <FormatSelector
              inputFormat={uploadedFile!.format}
              compatibleFormats={compatibleFormats}
              onSelect={handleFormatSelect}
            />
          </div>
        </div>
      </section>
    );
  }

  const sharedHero = (children: React.ReactNode) => (
    <section className="relative overflow-hidden bg-[#080c14] py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-20 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-cta/10 blur-[100px]" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 -z-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div className="relative z-10 mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );

  // Converting
  if (isConverting || uploadState === 'converting') {
    return sharedHero(
      <div className="text-center">
        <ConversionStatus
          inputFormat={uploadedFile!.format}
          outputFormat=""
          progress={progress}
          message={loadingMessage}
        />
        <div className="mt-6">
          <UploadProgress progress={progress} />
        </div>
      </div>
    );
  }

  // Completed
  if (result) {
    return sharedHero(
      <DownloadReady
        filename={result.filename}
        size={result.size}
        onDownload={download}
        onReset={handleReset}
      />
    );
  }

  // Error
  if (uploadState === 'error' || conversionError) {
    return sharedHero(
      <ConversionError
        error={conversionError || uploadError || 'Something went wrong'}
        onRetry={handleReset}
      />
    );
  }

  return null;
}
