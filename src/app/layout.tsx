import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { clsx } from 'clsx/lite';
import { IBM_Plex_Mono } from 'next/font/google';
import {
  BASE_URL,
  SITE_DESCRIPTION,
  SITE_DOMAIN_OR_TITLE,
  SITE_TITLE,
} from '@/site/config';
import AppStateProvider from '@/state/AppStateProvider';
import ToasterWithThemes from '@/toast/ToasterWithThemes';
import PhotoEscapeHandler from '@/photo/PhotoEscapeHandler';
import { Metadata } from 'next/types';
import { ThemeProvider } from 'next-themes';
import Nav from '@/site/Nav';
import Footer from '@/site/Footer';
import CommandK from '@/site/CommandK';
import SwrConfigClient from '../state/SwrConfigClient';

import '../site/globals.css';
import '../site/sonner.css';

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-ibm-plex-mono',
});

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  ...BASE_URL && { metadataBase: new URL(BASE_URL) },
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
      // Suppress hydration errors due to next-themes behavior
      suppressHydrationWarning
    >
      <body className={ibmPlexMono.variable}>
        <AppStateProvider>
          <SwrConfigClient>
            <ThemeProvider attribute="class">
              <main className={clsx(
                'mx-3 mb-3',
                'lg:mx-6 lg:mb-6',
              )}>
                <Nav siteDomainOrTitle={SITE_DOMAIN_OR_TITLE} />
                <div className={clsx(
                  'min-h-[16rem] sm:min-h-[30rem]',
                  'mb-12',
                )}>
                  {children}
                </div>
                <Footer />
              </main>
              <CommandK />
            </ThemeProvider>
          </SwrConfigClient>
          <Analytics debug={false} />
          <SpeedInsights debug={false}  />
          <PhotoEscapeHandler />
          <ToasterWithThemes />
        </AppStateProvider>
      </body>
    </html>
  );
}
