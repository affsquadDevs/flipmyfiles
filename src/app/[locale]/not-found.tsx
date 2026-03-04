import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <div className="flex min-h-[60vh] items-center justify-center py-16">
      <div className="text-center">
        <p className="text-6xl font-extrabold text-primary">404</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          {t('title')}
        </h1>
        <p className="mt-2 text-text-muted">
          {t('message')}
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark"
          >
            {t('goHome')}
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
          >
            {t('browseTools')}
          </Link>
        </div>
      </div>
    </div>
  );
}
