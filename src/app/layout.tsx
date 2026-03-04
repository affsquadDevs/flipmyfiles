import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.variable} antialiased bg-white text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
