'use client';

import { useTranslations } from 'next-intl';
import FAQAccordion from '@/components/pages/FAQAccordion';

export default function HomeFAQ() {
  const t = useTranslations('faq');

  const homeFaqs = [
    { question: t('q1'), answer: t('a1') },
    { question: t('q2'), answer: t('a2') },
    { question: t('q3'), answer: t('a3') },
    { question: t('q4'), answer: t('a4') },
    { question: t('q5'), answer: t('a5') },
    { question: t('q6'), answer: t('a6') },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {t('title')}
          </h2>
          <p className="mt-3 text-text-muted">
            {t('subtitle')}
          </p>
        </div>

        <div className="mt-8">
          <FAQAccordion faqs={homeFaqs} />
        </div>
      </div>

      {/* Homepage FAQPage schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: homeFaqs.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </section>
  );
}
