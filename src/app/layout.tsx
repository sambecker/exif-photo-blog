import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { cc } from '@/utility/css';
import { IBM_Plex_Mono } from 'next/font/google';
import { Metadata } from 'next';
import { BASE_URL, SITE_DESCRIPTION, SITE_TITLE } from '@/site/config';
import StateProvider from '@/state/AppStateProvider';
import ThemeProviderClient from '@/site/ThemeProviderClient';
import Nav from '@/site/Nav';
import ToasterWithThemes from '@/toast/ToasterWithThemes';
import PhotoEscapeHandler from '@/photo/PhotoEscapeHandler';

import '../site/globals.css';

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-ibm-plex-mono',
});

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  icons: [{
    url: '/favicon.ico',
    rel: 'icon',
    type: 'image/png',
    sizes: '180x180',
  }, {
    url: '/favicons/light.png',
    rel: 'icon',
    media: '(prefers-color-scheme: light)',
    type: 'image/png',
    sizes: '32x32',
  }, {
    url: '/favicons/dark.png',
    rel: 'icon',
    media: '(prefers-color-scheme: dark)',
    type: 'image/png',
    sizes: '32x32',
  }, {
    url: '/favicons/apple-touch-icon.png',
    rel: 'icon',
    type: 'image/png',
    sizes: '180x180',
  }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      // Suppress hydration errors due to
      // next-themes behavior
      suppressHydrationWarning
    >
      <body className={ibmPlexMono.variable}>
        <ThemeProviderClient>
          <main className={cc(
            'px-3 pb-3',
            'lg:px-6 lg:pb-6',
          )}>
            <Nav />
            <StateProvider>
              {children}
            </StateProvider>
            <Analytics />
            <SpeedInsights />
          </main>
          <PhotoEscapeHandler />
          <ToasterWithThemes />
        </ThemeProviderClient>
      </body>
    </html>
  );
}
