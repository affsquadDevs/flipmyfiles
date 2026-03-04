'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useConversion } from '@/hooks/useConversion';
import FilePreview from '@/components/upload/FilePreview';
import UploadProgress from '@/components/upload/UploadProgress';
import ConversionStatus from '@/components/conversion/ConversionStatus';
import DownloadReady from '@/components/conversion/DownloadReady';
import ConversionError from '@/components/conversion/ConversionError';
import FAQAccordion from '@/components/pages/FAQAccordion';
import RelatedConversions from '@/components/pages/RelatedConversions';
import type { ConversionPair } from '@/config/formats.config';
import { getFormatInfo, getConversionBenefits, getDetailedFaqs } from '@/lib/content';

interface Props {
  conversion: ConversionPair;
  related: ConversionPair[];
}

export default function ConversionPageTemplate({ conversion, related }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('converter');

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

  const handleConvert = async () => {
    if (!uploadedFile) return;
    setConverting();
    await convert(uploadedFile.file, conversion.to.toLowerCase());
    setCompleted();
  };

  const handleReset = () => {
    resetUpload();
    resetConversion();
    if (inputRef.current) inputRef.current.value = '';
  };

  const fromInfo = getFormatInfo(conversion.from);
  const toInfo = getFormatInfo(conversion.to);
  const benefits = getConversionBenefits(conversion.from, conversion.to);
  const faqs = getDetailedFaqs(conversion.from, conversion.to);

  const isClientSide = ['MP4', 'AVI', 'MOV', 'MKV', 'WEBM', 'FLV', 'WMV', 'MP3', 'WAV', 'OGG', 'FLAC', 'AAC', 'WMA', 'M4A'].includes(conversion.from.toUpperCase()) ||
    ['MP4', 'AVI', 'MOV', 'MKV', 'WEBM', 'FLV', 'WMV', 'MP3', 'WAV', 'OGG', 'FLAC', 'AAC', 'WMA', 'M4A', 'GIF'].includes(conversion.to.toUpperCase());

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#080c14] pb-36 pt-12 sm:pb-40 sm:pt-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-primary/15 blur-[130px]" />
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-6 flex items-center justify-center gap-1.5 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-300 transition-colors">{t('home')}</Link>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <Link href="/tools" className="hover:text-gray-300 transition-colors">{t('tools')}</Link>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <span className="text-gray-400">{conversion.from} to {conversion.to}</span>
          </nav>

          {/* Format badges */}
          <div className="mb-5 flex items-center justify-center gap-2 sm:gap-3">
            <span className="rounded-xl border border-primary/30 bg-primary/15 px-5 py-2 text-base font-bold text-primary-light">
              {conversion.from}
            </span>
            <div className="flex items-center gap-1">
              <div className="h-px w-6 bg-gradient-to-r from-primary to-cta" />
              <svg className="h-5 w-5 -ml-1 text-cta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <span className="rounded-xl border border-cta/30 bg-cta/15 px-5 py-2 text-base font-bold text-cta">
              {conversion.to}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t('howToConvert', { from: conversion.from, to: conversion.to })} {t('online')}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-gray-400">
            {conversion.description}. {t('freeSecure')}
          </p>

          {/* Trust badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-xs text-gray-500 sm:gap-x-4 sm:gap-y-2">
            {[
              { icon: '🔒', key: 'secure' },
              { icon: '⚡', key: 'fast' },
              { icon: '🆓', key: 'free' },
              { icon: '✉️', key: 'noSignup' },
              { icon: '📦', key: 'maxSize' },
            ].map(({ icon, key }) => (
              <span key={key} className="flex items-center gap-1.5">
                <span>{icon}</span>
                <span>{t(`trustBadges.${key}`)}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Converter card ─────────────────────────────────────── */}
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="relative z-20 -mt-20 rounded-2xl border border-border bg-white shadow-2xl">

            {uploadState === 'idle' || uploadState === 'dragging' ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
                role="button"
                tabIndex={0}
                aria-label={t('dropzone.aria', { format: conversion.from })}
                className={`cursor-pointer rounded-2xl p-10 text-center transition-all sm:p-14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  uploadState === 'dragging'
                    ? 'bg-cta/5 ring-2 ring-cta ring-inset scale-[1.01]'
                    : 'hover:bg-gray-50/60'
                }`}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-cta/10 text-primary shadow-sm">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {t('dropzone.title', { format: conversion.from })}
                    </p>
                    <p className="mt-1 text-sm text-text-muted">
                      {t('dropzone.subtitle')}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="mt-1 inline-flex items-center gap-2 rounded-xl bg-cta px-7 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cta/25 transition-all hover:bg-cta-hover active:scale-[0.98]"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    {t('dropzone.button')}
                  </button>
                  <p className="text-xs text-text-muted">{t('dropzone.supports', { format: conversion.from })}</p>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  onChange={handleInputChange}
                  aria-label={t('dropzone.aria', { format: conversion.from })}
                />
              </div>
            ) : uploadState === 'invalid' ? (
              <div className="p-8">
                <ConversionError error={uploadError || 'Invalid file'} onRetry={handleReset} />
              </div>
            ) : isConverting ? (
              <div className="p-8 text-center">
                <ConversionStatus inputFormat={conversion.from} outputFormat={conversion.to} progress={progress} message={loadingMessage} />
                <div className="mx-auto mt-6 max-w-sm">
                  <UploadProgress progress={progress} />
                </div>
              </div>
            ) : result ? (
              <div className="p-8">
                <DownloadReady
                  filename={result.filename}
                  size={result.size}
                  onDownload={download}
                  onReset={handleReset}
                />
              </div>
            ) : conversionError || uploadState === 'error' ? (
              <div className="p-8">
                <ConversionError
                  error={conversionError || uploadError || 'Something went wrong'}
                  onRetry={handleReset}
                />
              </div>
            ) : uploadedFile ? (
              <div className="p-8">
                <FilePreview file={uploadedFile} onRemove={handleReset} />
                <div className="mt-6 text-center">
                  <button
                    onClick={handleConvert}
                    className="inline-flex items-center gap-2 rounded-xl bg-cta px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-cta/25 transition-all hover:bg-cta-hover hover:shadow-xl active:scale-[0.98]"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                    </svg>
                    {t('convertBtn', { format: conversion.to })}
                  </button>
                </div>
              </div>
            ) : null}

          </div>

          {/* Privacy note */}
          <p className="mt-4 text-center text-xs text-text-muted">
            {isClientSide ? t('privacy.browser') : t('privacy.server')}
          </p>
        </div>
      </div>

      {/* ── Educational content ─────────────────────────────────── */}
      <div className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-14">

            {/* What is FROM + What is TO */}
            <div className="grid gap-8 sm:grid-cols-2">
              <section className="rounded-2xl border border-border bg-gray-50 p-6">
                <h2 className="text-lg font-bold text-gray-900">{t('whatIs', { format: conversion.from })}</h2>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{fromInfo.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {fromInfo.commonUses.map((use) => (
                    <li key={use} className="flex items-start gap-2 text-sm text-text-muted">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-cta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {use}
                    </li>
                  ))}
                </ul>
                {fromInfo.technicalNote && (
                  <p className="mt-3 text-xs text-text-muted italic">{fromInfo.technicalNote}</p>
                )}
              </section>

              <section className="rounded-2xl border border-border bg-gray-50 p-6">
                <h2 className="text-lg font-bold text-gray-900">{t('whatIs', { format: conversion.to })}</h2>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{toInfo.description}</p>
                <ul className="mt-4 space-y-1.5">
                  {toInfo.commonUses.map((use) => (
                    <li key={use} className="flex items-start gap-2 text-sm text-text-muted">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-cta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {use}
                    </li>
                  ))}
                </ul>
                {toInfo.technicalNote && (
                  <p className="mt-3 text-xs text-text-muted italic">{toInfo.technicalNote}</p>
                )}
              </section>
            </div>

            {/* Why convert */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                {t('whyConvert', { from: conversion.from, to: conversion.to })}
              </h2>
              <ul className="mt-5 space-y-3">
                {benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 text-text-muted">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cta/10 text-xs font-bold text-green-700">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* How to convert */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                {t('howToConvert', { from: conversion.from, to: conversion.to })}
              </h2>
              <ol className="mt-5 space-y-5">
                {[
                  {
                    title: t('steps.uploadTitle', { format: conversion.from }),
                    body: t('steps.uploadBody', { format: conversion.from }),
                  },
                  {
                    title: t('steps.convertTitle'),
                    body: t('steps.convertBody', { format: conversion.to }),
                  },
                  {
                    title: t('steps.downloadTitle'),
                    body: t('steps.downloadBody', { format: conversion.to }),
                  },
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900">{step.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-text-muted">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Security */}
            <section className="rounded-2xl border border-border bg-gray-50 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{t('securityTitle')}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-text-muted">
                    {isClientSide ? t('securityBrowser') : t('securityServer')}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* FAQ */}
          <div className="mt-16">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
              {t('faqTitle')}
            </h2>
            <div className="mt-6">
              <FAQAccordion faqs={faqs} />
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-16">
              <RelatedConversions conversions={related} />
            </div>
          )}
        </div>
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebApplication',
        name: `${conversion.from} to ${conversion.to} Converter — FlipMyFiles`,
        description: conversion.description,
        url: `https://flipmyfiles.com/convert/${conversion.slug}`,
        applicationCategory: 'UtilityApplication', operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'HowTo',
        name: `How to Convert ${conversion.from} to ${conversion.to}`,
        description: `Convert your ${conversion.from} file to ${conversion.to} format online using FlipMyFiles.`,
        step: [
          { '@type': 'HowToStep', name: `Upload your ${conversion.from} file`, text: `Drag and drop your ${conversion.from} file into the upload area, or click to browse.` },
          { '@type': 'HowToStep', name: 'Start the conversion', text: `Click "Convert to ${conversion.to}" to begin processing.` },
          { '@type': 'HowToStep', name: 'Download the result', text: `Click the download button to save your ${conversion.to} file.` },
        ],
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
          '@type': 'Question', name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      })}} />
    </div>
  );
}
