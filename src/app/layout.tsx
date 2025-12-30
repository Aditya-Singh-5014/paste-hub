import './globals.css';
import type { ReactNode } from 'react';
import { IBM_Plex_Mono, Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '600', '700']
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '600']
});

export const metadata = {
  title: 'Pastebin Lite',
  description: 'Share text with optional expiry or view limits.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plexMono.variable}`}>
      <body>
        <div className="bg-sheen" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
