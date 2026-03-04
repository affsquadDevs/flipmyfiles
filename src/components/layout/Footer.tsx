import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const socialLinks = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/flip_my_files/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/people/Flip-My-Files/61587981662670/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@flipmyfiles',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name: 'Threads',
    href: 'https://www.threads.com/@flip_my_files',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.086.718 5.496 2.057 7.164 1.432 1.781 3.632 2.695 6.54 2.717 2.227-.02 4.358-.631 5.8-1.673 1.566-1.132 2.312-2.654 2.312-4.708 0-1.975-.717-3.49-2.07-4.386-1.177-.78-2.794-1.197-4.593-1.197-.143 0-.287.003-.432.008-2.048.07-3.622.548-4.584 1.392-.878.77-1.325 1.83-1.325 3.15 0 1.097.383 2.008 1.108 2.637.77.667 1.856 1.02 3.14 1.046 1.654.032 3.073-.43 3.991-1.3.615-.582.94-1.3.94-2.075 0-.543-.192-1-.555-1.32-.39-.343-.95-.523-1.622-.523-.496 0-.95.098-1.313.284-.33.169-.573.407-.702.689l-1.85-.78c.288-.682.79-1.218 1.46-1.558.72-.367 1.55-.553 2.464-.553 1.197 0 2.2.342 2.9.99.74.683 1.131 1.644 1.131 2.78 0 1.27-.535 2.397-1.548 3.258-1.292 1.098-3.132 1.68-5.32 1.683h-.073c-1.806-.03-3.328-.555-4.404-1.52-1.107-.993-1.693-2.36-1.693-3.952 0-1.834.65-3.326 1.88-4.406 1.328-1.165 3.298-1.79 5.696-1.807.17-.006.34-.009.51-.009 2.165 0 4.108.52 5.617 1.52 1.783 1.18 2.728 3.11 2.728 5.584 0 2.626-1.01 4.694-2.918 5.973C17.378 23.28 14.88 23.978 12.186 24z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const t = useTranslations('footer');

  const siteLinks = [
    { href: '/tools' as const, label: t('allTools') },
    { href: '/tools/image' as const, label: t('imageConverter') },
    { href: '/tools/video' as const, label: t('videoConverter') },
    { href: '/tools/audio' as const, label: t('audioConverter') },
    { href: '/about' as const, label: t('about') },
    { href: '/contact' as const, label: t('contact') },
    { href: '/privacy-policy' as const, label: t('privacyPolicy') },
    { href: '/terms-of-service' as const, label: t('termsOfService') },
  ];

  return (
    <footer className="relative bg-[#080c14] text-gray-400 mt-auto overflow-hidden">
      {/* Accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Subtle glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-primary/5 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1a2235]">
                <span className="text-xl font-extrabold text-cta">F</span>
              </div>
              <span className="text-xl font-bold text-white">
                Flip<span className="text-cta">My</span>Files
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-500 max-w-xs">
              {t('description')}
            </p>
          </div>

          {/* Links */}
          <div className="lg:col-span-2">
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">{t('links')}</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 sm:gap-x-8 sm:gap-y-2.5">
              {siteLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">{t('followUs')}</h4>
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  className="text-gray-600 hover:text-white transition-all duration-200 hover:scale-110"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 mt-12 pt-8 text-xs text-gray-600 text-center">
          <p>&copy; {new Date().getFullYear()} FlipMyFiles.com. {t('rights')}</p>
        </div>
      </div>
    </footer>
  );
}
