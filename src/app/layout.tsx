import type { ReactNode } from 'react';

// The <html>/<body> tags (and lang attribute) are rendered by the locale layout
// at src/app/[locale]/layout.tsx so that each locale serves the correct lang.
// This root layout only needs to pass children through.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
