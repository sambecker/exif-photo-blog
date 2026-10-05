import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { clsx } from 'clsx/lite';
import {
  BASE_URL,
  PRESERVE_ORIGINAL_UPLOADS,
  META_DESCRIPTION,
  META_TITLE,
  HTML_LANG,
  SITE_FEEDS_ENABLED,
  PAGE_SCRIPT_URLS,
  VERCEL_GIT_COMMIT_SHA_SHORT,
  DEBUG_OUTPUTS_ENABLED,
} from '@/app/config';
import StateProviders from '@/app/StateProviders';
import ToasterWithThemes from '@/toast/ToasterWithThemes';
import PhotoEscapeHandler from '@/photo/PhotoEscapeHandler';
import { Metadata } from 'next/types';
import Nav from '@/app/Nav';
import Footer from '@/app/Footer';
import CommandK from '@/cmdk/CommandK';
import ShareModals from '@/share/ShareModals';
import AdminUploadPanel from '@/admin/upload/AdminUploadPanel';
import { revalidatePath } from 'next/cache';
import RecipeModal from '@/recipe/RecipeModal';
import ThemeColors from '@/app/ThemeColors';
import { PATH_FEED_JSON, PATH_RSS_XML } from '@/app/path';
import AdminBatchEditPanel from '@/admin/select/AdminBatchEditPanel';
import AdminEditTitlesPanel from '@/admin/edit-titles/AdminEditTitlesPanel';
import Script from 'next/script';

import '../tailwind.css';

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESCRIPTION,
  ...BASE_URL && { metadataBase: new URL(BASE_URL) },
  openGraph: {
    title: META_TITLE,
    description: META_DESCRIPTION,
  },
  twitter: {
    title: META_TITLE,
    description: META_DESCRIPTION,
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
  ...DEBUG_OUTPUTS_ENABLED && {
    other: {
      'build': VERCEL_GIT_COMMIT_SHA_SHORT ?? 'unknown',
    },
  },
  ...SITE_FEEDS_ENABLED && {
    alternates: {
      types: {
        'application/rss+xml': PATH_RSS_XML,
        'application/json': PATH_FEED_JSON,
      },
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang={HTML_LANG}
      // Suppress hydration errors due to next-themes behavior
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className={clsx(
        // Center on large screens
        '3xl:flex flex-col items-center',
      )}>
        <StateProviders>
          <ThemeColors />
          <div className={clsx(
            'mx-3 pb-3',
            'lg:mx-6 lg:pb-6',
            'min-h-dvh flex flex-col',
          )}>
            <Nav />
            <main className="grow">
              <ShareModals />
              <RecipeModal />
              <div className={clsx(
                'mb-5',
                'space-y-5',
              )}>
                <AdminUploadPanel
                  shouldResize={!PRESERVE_ORIGINAL_UPLOADS}
                />
                <AdminBatchEditPanel
                  onBatchActionComplete={async () => {
                    'use server';
                    // Update upload count in admin nav
                    revalidatePath('/admin', 'layout');
                  }}
                />
                <AdminEditTitlesPanel />
                {children}
              </div>
            </main>
            <Footer />
          </div>
          <CommandK />
          <Analytics debug={false} />
          <SpeedInsights debug={false} />
          <PhotoEscapeHandler />
          <ToasterWithThemes />
        </StateProviders>
        {PAGE_SCRIPT_URLS.map(url => <Script key={url} src={url} />)}
      </body>
    </html>
  );
}
