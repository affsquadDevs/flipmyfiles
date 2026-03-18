import { useTranslations } from 'next-intl';
import Link from 'next/link';

type FormatKey = 'images' | 'video' | 'audio' | 'documents' | 'archives';

const formatGroups: {
  key: FormatKey;
  formats: string[];
  link: string;
  iconColor: string;
  accentBorder: string;
  linkColor: string;
  icon: React.ReactNode;
}[] = [
  {
    key: 'images',
    formats: ['JPG', 'PNG', 'WebP', 'GIF', 'BMP', 'TIFF', 'AVIF', 'SVG', 'ICO', 'HEIC'],
    link: '/tools/image',
    iconColor: 'bg-violet-100 text-violet-600',
    accentBorder: 'hover:border-violet-200',
    linkColor: 'text-violet-600',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    key: 'video',
    formats: ['MP4', 'AVI', 'MOV', 'MKV', 'WebM', 'FLV', 'WMV'],
    link: '/tools/video',
    iconColor: 'bg-rose-100 text-rose-600',
    accentBorder: 'hover:border-rose-200',
    linkColor: 'text-rose-600',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    key: 'audio',
    formats: ['MP3', 'WAV', 'OGG', 'FLAC', 'AAC', 'WMA', 'M4A'],
    link: '/tools/audio',
    iconColor: 'bg-emerald-100 text-emerald-600',
    accentBorder: 'hover:border-emerald-200',
    linkColor: 'text-emerald-600',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
      </svg>
    ),
  },
  {
    key: 'documents',
    formats: ['PDF', 'DOCX', 'TXT', 'CSV', 'XLSX'],
    link: '/tools/document',
    iconColor: 'bg-blue-100 text-blue-600',
    accentBorder: 'hover:border-blue-200',
    linkColor: 'text-blue-600',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    key: 'archives',
    formats: ['ZIP', 'TAR', 'GZ'],
    link: '/tools/archive',
    iconColor: 'bg-amber-100 text-amber-600',
    accentBorder: 'hover:border-amber-200',
    linkColor: 'text-amber-600',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
  },
];

export default function SupportedFormats() {
  const t = useTranslations('supportedFormats');

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {t('title')}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-text-muted">
            {t('subtitle')}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {formatGroups.map((group) => (
            <Link
              key={group.key}
              href={group.link}
              className={`group flex flex-col rounded-2xl border border-border bg-white p-8 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${group.accentBorder}`}
            >
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${group.iconColor}`}>
                  {group.icon}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-widest text-text-muted">
                    {t(`${group.key}.desc`)}
                  </p>
                  <h3 className="text-lg font-bold text-gray-900">
                    {t(`${group.key}.title`)}
                  </h3>
                </div>
              </div>

              {/* Divider */}
              <div className="my-6 h-px bg-border" />

              {/* Format badges */}
              <div className="flex flex-wrap gap-2">
                {group.formats.map((format) => (
                  <span
                    key={format}
                    className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600"
                  >
                    {format}
                  </span>
                ))}
              </div>

              {/* Link */}
              <div className={`mt-6 flex items-center gap-1.5 text-sm font-medium ${group.linkColor} opacity-0 transition-all group-hover:opacity-100`}>
                {t(`${group.key}.viewConversions`)}
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
