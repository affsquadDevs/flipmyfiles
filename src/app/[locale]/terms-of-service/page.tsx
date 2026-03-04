import { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { routing } from '@/i18n/routing';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'terms' });
  return {
    title: `${t('title')} — FlipMyFiles`,
    description: 'FlipMyFiles terms of service. Read our terms and conditions for using the free online file conversion service.',
    alternates: { canonical: 'https://flipmyfiles.com/terms-of-service' },
  };
}

function TermsContent() {
  const t = useTranslations('terms');

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          {t('title')}
        </h1>
        <p className="mt-2 text-sm text-text-muted">{t('lastUpdated')}</p>

        <div className="mt-8 space-y-8 text-text-muted leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900">1. Acceptance of Terms</h2>
            <p className="mt-3">
              By accessing or using FlipMyFiles (&ldquo;the Service&rdquo;), available at flipmyfiles.com,
              you agree to be bound by these Terms of Service. If you do not agree to these terms,
              you should not use the Service. We reserve the right to update or modify these terms
              at any time, and your continued use of the Service following any changes constitutes
              your acceptance of those changes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">2. Description of Service</h2>
            <p className="mt-3">
              FlipMyFiles is a browser-based file conversion tool that allows users to convert files
              between various formats, including images, video, audio, documents, and archives.
              The Service is provided free of charge for personal and reasonable commercial use.
            </p>
            <p className="mt-3">
              Server-side conversions process files in memory and do not retain data after the
              conversion is complete. Video and audio conversions are performed entirely within the
              user&apos;s browser and are not transmitted to our servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">3. Acceptable Use</h2>
            <p className="mt-3">
              When using FlipMyFiles, you agree to the following:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>You will not upload files containing malware, viruses, or any form of malicious code</li>
              <li>You will not upload content that you do not have the legal right to use or convert</li>
              <li>You will not use the Service to process content that is illegal under applicable law</li>
              <li>You will not attempt to overload, disrupt, or interfere with the operation of the Service</li>
              <li>You will not use automated scripts or bots to make bulk requests beyond what is reasonable for personal or individual commercial use</li>
              <li>You will not attempt to reverse-engineer, decompile, or extract the source code of the Service</li>
              <li>You will not attempt to circumvent rate limits or other protective measures</li>
            </ul>
            <p className="mt-3">
              We reserve the right to restrict access to the Service for any user who violates these terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">4. Intellectual Property</h2>
            <p className="mt-3">
              You retain all rights to the files you upload and convert through FlipMyFiles. We do
              not claim ownership of any user-submitted content. The Service processes your files
              solely for the purpose of performing the requested conversion.
            </p>
            <p className="mt-3">
              The FlipMyFiles name, logo, website design, and underlying code are the intellectual
              property of FlipMyFiles and are protected by applicable intellectual property laws.
              You may not reproduce, distribute, or create derivative works based on these materials
              without prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">5. User Responsibility</h2>
            <p className="mt-3">
              You are solely responsible for the files you upload and convert using the Service.
              This includes ensuring that:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>You have the necessary rights, licenses, or permissions to convert the files</li>
              <li>The files do not infringe on any third party&apos;s intellectual property, privacy, or other rights</li>
              <li>You maintain your own backup copies of any important files before conversion</li>
            </ul>
            <p className="mt-3">
              FlipMyFiles is not responsible for verifying the legality or ownership of uploaded content.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">6. Service Limitations</h2>
            <p className="mt-3">
              The Service operates under certain limitations:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Maximum file size per upload is 250 MB</li>
              <li>Rate limiting is applied to ensure fair access for all users</li>
              <li>Conversion output may vary depending on the complexity and encoding of the source file</li>
              <li>Not all format combinations are supported</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">7. Service Availability</h2>
            <p className="mt-3">
              We aim to keep FlipMyFiles available and functional at all times, but we do not
              guarantee uninterrupted access. The Service may be temporarily unavailable due to:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Scheduled or unscheduled maintenance</li>
              <li>Server or infrastructure issues</li>
              <li>Updates or improvements to the Service</li>
              <li>Circumstances beyond our reasonable control</li>
            </ul>
            <p className="mt-3">
              We are not liable for any loss or inconvenience caused by temporary unavailability
              of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">8. Disclaimer of Warranties</h2>
            <p className="mt-3">
              The Service is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties
              of any kind, whether express or implied. This includes, but is not limited to,
              implied warranties of merchantability, fitness for a particular purpose, and
              non-infringement.
            </p>
            <p className="mt-3">
              We do not warrant that:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>The Service will meet your specific requirements</li>
              <li>Conversions will always be error-free or produce expected results</li>
              <li>The Service will be available without interruption</li>
              <li>Any defects will be corrected within a specific timeframe</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">9. Limitation of Liability</h2>
            <p className="mt-3">
              To the maximum extent permitted by applicable law, FlipMyFiles and its operators
              shall not be held liable for any direct, indirect, incidental, special, consequential,
              or exemplary damages resulting from:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Use or inability to use the Service</li>
              <li>Data loss or file corruption during conversion</li>
              <li>Unauthorized access to or alteration of your data during transmission</li>
              <li>Any other matter relating to the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">10. Termination</h2>
            <p className="mt-3">
              We reserve the right to restrict, suspend, or terminate access to the Service for any
              user at our sole discretion, particularly in cases of suspected misuse or violation
              of these terms. We may do so without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">11. Governing Law</h2>
            <p className="mt-3">
              These Terms of Service shall be governed by and interpreted in accordance with
              applicable laws. Any disputes arising from or related to the use of the Service
              will be resolved through good-faith negotiation. If a resolution cannot be reached,
              disputes may be submitted to the competent courts of the jurisdiction in which the
              Service operator resides.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">12. Severability</h2>
            <p className="mt-3">
              If any provision of these terms is found to be unenforceable or invalid, that
              provision will be limited or eliminated to the minimum extent necessary, and the
              remaining provisions will continue in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">13. Contact</h2>
            <p className="mt-3">
              If you have questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:support@flipmyfiles.com" className="text-primary hover:text-cta">
                support@flipmyfiles.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TermsContent />;
}
