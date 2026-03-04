import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import MobileNav from './MobileNav';
import LocaleSwitcher from './LocaleSwitcher';

export default function Header() {
  const t = useTranslations('nav');

  return (
    <header className="sticky top-0 z-50 bg-[#080c14]">
      {/* Accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1a2235]">
            <span className="text-xl font-extrabold text-cta">F</span>
          </div>
          <span className="text-xl font-bold text-white">
            Flip<span className="text-cta">My</span>Files
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/tools" className="text-sm font-medium text-gray-400 transition-colors hover:text-white">
            {t('tools')}
          </Link>
          <Link href="/blog" className="text-sm font-medium text-gray-400 transition-colors hover:text-white">
            {t('blog')}
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-400 transition-colors hover:text-white">
            {t('about')}
          </Link>
          <Link href="/contact" className="text-sm font-medium text-gray-400 transition-colors hover:text-white">
            {t('contact')}
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <Link
            href="/tools"
            className="hidden items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-dark md:inline-flex"
          >
            {t('allTools')}
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
