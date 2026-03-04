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
  const t = await getTranslations({ locale, namespace: 'privacy' });
  return {
    title: `${t('title')} — FlipMyFiles`,
    description: 'FlipMyFiles privacy policy. Learn how we handle uploaded files, what data we collect, and how we protect your privacy.',
    alternates: { canonical: 'https://flipmyfiles.com/privacy-policy' },
  };
}

function PrivacyContent() {
  const t = useTranslations('privacy');

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          {t('title')}
        </h1>
        <p className="mt-2 text-sm text-text-muted">{t('lastUpdated')}</p>

        <div className="mt-8 space-y-8 text-text-muted leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-900">1. Introduction</h2>
            <p className="mt-3">
              FlipMyFiles (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates the file conversion
              service available at flipmyfiles.com. This Privacy Policy describes what information
              we collect, how we handle uploaded files, and the choices available to you when using
              our service.
            </p>
            <p className="mt-3">
              By using FlipMyFiles, you acknowledge that you have read and understood this policy.
              If you do not agree with any part of this policy, please discontinue use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">2. Information We Collect</h2>

            <h3 className="mt-4 font-semibold text-gray-800">2.1 Technical Information</h3>
            <p className="mt-2">
              When you visit our website, our hosting infrastructure may automatically collect
              certain technical information, including:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>IP address (used for rate limiting and abuse prevention)</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Referring URL</li>
              <li>Pages visited and time spent on each page</li>
            </ul>
            <p className="mt-2">
              This data is collected in aggregate form and is not used to identify individual users.
            </p>

            <h3 className="mt-4 font-semibold text-gray-800">2.2 Uploaded Files</h3>
            <p className="mt-2">
              Files that you upload for conversion are handled as follows:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>
                <strong>Server-side conversions</strong> (images, documents, archives): Files are processed
                in server memory. They are not saved to disk and are discarded immediately once the
                converted output is returned to your browser.
              </li>
              <li>
                <strong>Client-side conversions</strong> (video and audio): These files are processed entirely
                within your browser using WebAssembly technology. They are never transmitted to our servers.
              </li>
            </ul>
            <p className="mt-2">
              We do not review, store, copy, index, or share the contents of any uploaded file.
            </p>

            <h3 className="mt-4 font-semibold text-gray-800">2.3 Personal Information</h3>
            <p className="mt-2">
              FlipMyFiles does not require account creation, registration, or any form of personal
              information to use the conversion tools. We do not collect names, email addresses,
              or payment details through normal use of the service.
            </p>
            <p className="mt-2">
              If you contact us via email, we may retain the correspondence to respond to your inquiry.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">3. Cookies and Local Storage</h2>
            <p className="mt-3">
              We use a limited number of cookies and local storage mechanisms:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>
                <strong>Theme preference:</strong> Your light/dark mode selection is stored in
                your browser&apos;s local storage so that it persists between visits.
              </li>
              <li>
                <strong>Essential cookies:</strong> Used for basic site functionality and rate
                limiting purposes.
              </li>
            </ul>
            <p className="mt-2">
              Third-party services integrated into our site (such as analytics or advertising
              providers) may set their own cookies. Please refer to Section 5 for more details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">4. How We Use Information</h2>
            <p className="mt-3">
              The technical information we collect is used for the following purposes:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>Operating and maintaining the service</li>
              <li>Preventing abuse through rate limiting</li>
              <li>Understanding general usage patterns to improve the service</li>
              <li>Diagnosing technical issues</li>
            </ul>
            <p className="mt-2">
              We do not sell, rent, or share any collected information with third parties for
              marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">5. Third-Party Services</h2>
            <p className="mt-3">
              FlipMyFiles uses the following third-party services:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-2">
              <li>
                <strong>Vercel:</strong> Our hosting provider. Vercel may collect server logs and
                performance data. See{' '}
                <a href="https://vercel.com/legal/privacy-policy" className="text-primary hover:text-cta" target="_blank" rel="noopener noreferrer">
                  Vercel&apos;s Privacy Policy
                </a>.
              </li>
              <li>
                <strong>Google Analytics / Google Tag Manager:</strong> We use Google&apos;s analytics
                tools to understand how visitors interact with our website. This may involve the
                use of cookies. See{' '}
                <a href="https://policies.google.com/privacy" className="text-primary hover:text-cta" target="_blank" rel="noopener noreferrer">
                  Google&apos;s Privacy Policy
                </a>.
              </li>
              <li>
                <strong>Google AdSense:</strong> We display advertisements through Google AdSense.
                Google may use cookies and web beacons to serve ads based on your prior visits to
                our website or other websites. You can opt out of personalized advertising by
                visiting{' '}
                <a href="https://www.google.com/settings/ads" className="text-primary hover:text-cta" target="_blank" rel="noopener noreferrer">
                  Google Ads Settings
                </a>.
              </li>
            </ul>
            <p className="mt-2">
              We encourage you to review the privacy policies of these third-party providers to
              understand how they handle data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">6. Data Security</h2>
            <p className="mt-3">
              We implement reasonable security measures to protect the information processed
              through our service:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>All data transmitted between your browser and our servers is encrypted using HTTPS/TLS</li>
              <li>Server-side file processing occurs in memory and data is not persisted to storage</li>
              <li>Rate limiting is applied to prevent abuse of the service</li>
            </ul>
            <p className="mt-2">
              While we take steps to protect the information we handle, no method of electronic
              transmission or processing is completely secure. We cannot guarantee absolute security
              of data during transmission or processing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">7. Your Rights and Choices</h2>
            <p className="mt-3">
              Depending on your location, you may have certain rights regarding your data:
            </p>
            <ul className="mt-2 list-disc pl-6 space-y-1">
              <li>You can clear cookies and local storage through your browser settings at any time</li>
              <li>You can opt out of personalized advertising through Google Ads Settings</li>
              <li>You can use browser extensions or settings to block third-party cookies</li>
              <li>You can contact us to inquire about any data we may have associated with your correspondence</li>
            </ul>
            <p className="mt-2">
              Since we do not require accounts or collect personal information during normal use,
              there is generally no personal data for us to delete or provide upon request.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">8. Children&apos;s Privacy</h2>
            <p className="mt-3">
              FlipMyFiles is a general-purpose utility tool and is not directed at children under
              the age of 13. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">9. Changes to This Policy</h2>
            <p className="mt-3">
              We may update this Privacy Policy from time to time to reflect changes in our
              practices or for legal and regulatory reasons. When we make changes, we will update
              the &ldquo;Last updated&rdquo; date at the top of this page. We encourage you to review this
              policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-900">10. Contact Us</h2>
            <p className="mt-3">
              If you have questions or concerns about this Privacy Policy or how your data is
              handled, you can reach us at{' '}
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

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PrivacyContent />;
}
