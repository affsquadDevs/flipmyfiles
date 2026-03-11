import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { routing } from '@/i18n/routing';
import '../globals.css';

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'FlipMyFiles — Free Online File Converter',
  description: 'Convert images, videos, audio, and documents for free. No signup required. Fast, secure, browser-based file conversion supporting 100+ formats.',
  keywords: 'file converter, image converter, video converter, audio converter, online converter, free converter, png to jpg, heic to jpg, mp4 to mp3',
  manifest: '/manifest.json',
  openGraph: {
    title: 'FlipMyFiles — Free Online File Converter',
    description: 'Convert images, videos, audio, and documents for free. No signup required.',
    url: 'https://flipmyfiles.com',
    siteName: 'FlipMyFiles',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlipMyFiles — Free Online File Converter',
    description: 'Convert images, videos, audio, and documents for free. No signup required.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {/* Google Tag Manager */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WPM68V79');`,
        }}
      />
      <Script
        id="adsense-script"
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2980943706375055"
        crossOrigin="anonymous"
      />
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": "https://flipmyfiles.com/#organization",
            "name": "FlipMyFiles",
            "url": "https://flipmyfiles.com/",
            "logo": {
              "@type": "ImageObject",
              "url": "https://flipmyfiles.com/logo.png",
              "width": 512,
              "height": 512
            },
            "image": "https://flipmyfiles.com/og-image.png",
            "description": "FlipMyFiles is a secure and fast online file converter that allows users to convert documents, images, audio, and video files directly in their browser without installing software.",
            "foundingDate": "2026",
            "areaServed": {
              "@type": "Place",
              "name": "Worldwide"
            },
            "knowsAbout": [
              "File conversion",
              "PDF conversion",
              "Image format conversion",
              "Video format conversion",
              "Audio format conversion",
              "Online document tools",
              "File format transformation"
            ],
            "sameAs": [
              "https://www.instagram.com/flip_my_files/",
              "https://www.facebook.com/people/Flip-My-Files/61587981662670/",
              "https://www.youtube.com/@flipmyfiles",
              "https://www.threads.com/@flip_my_files"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer support",
              "email": "support@flipmyfiles.com",
              "availableLanguage": ["English"]
            }
          }),
        }}
      />
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-WPM68V79"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="min-h-screen">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      <Footer />
    </NextIntlClientProvider>
  );
}
