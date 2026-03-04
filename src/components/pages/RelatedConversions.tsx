import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { ConversionPair } from '@/config/formats.config';
import { ConversionAppIcon } from '@/components/shared/ConversionAppIcon';

interface RelatedConversionsProps {
  conversions: ConversionPair[];
}

export default function RelatedConversions({ conversions }: RelatedConversionsProps) {
  const t = useTranslations('converter');

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
        {t('relatedConversions')}
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {conversions.map(c => (
          <Link
            key={c.slug}
            href={`/convert/${c.slug}`}
            className="group flex flex-col items-center rounded-xl border border-border bg-white p-4 text-center transition-all hover:border-cta/30 hover:shadow-md dark:border-border-dark dark:bg-card-dark dark:hover:border-cta/30"
          >
            <ConversionAppIcon from={c.from} to={c.to} />
            <p className="mt-3 text-sm font-bold text-gray-900 dark:text-white">
              {c.from} to {c.to}
            </p>
            <p className="mt-1 text-xs text-text-muted line-clamp-1">{c.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
