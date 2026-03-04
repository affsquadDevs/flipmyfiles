'use client';

import { useEffect, useState } from 'react';

export default function ReadingProgressBar({ slug }: { slug: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      if (scrollHeight <= 0) return;
      const pct = Math.min(100, Math.round((scrollTop / scrollHeight) * 100));
      setProgress(pct);
      const key = `blog-progress-${slug}`;
      const saved = Number(localStorage.getItem(key) ?? 0);
      if (pct > saved) localStorage.setItem(key, String(pct));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [slug]);

  return (
    <div className="fixed left-0 top-16 z-50 h-[3px] w-full bg-transparent lg:h-[2px]">
      <div
        className="h-full bg-gradient-to-r from-primary to-cta transition-[width] duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
