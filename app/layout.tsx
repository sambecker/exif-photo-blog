import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { clsx } from 'clsx/lite';
import {
  BASE_URL,
  DEFAULT_THEME,
  PRESERVE_ORIGINAL_UPLOADS,
  META_DESCRIPTION,
  META_TITLE,
  HTML_LANG,
  SITE_FEEDS_ENABLED,
  ADMIN_DEBUG_TOOLS_ENABLED,
} from '@/app/config';
import AppStateProvider from '@/app/AppStateProvider';
import ToasterWithThemes from '@/toast/ToasterWithThemes';
import PhotoEscapeHandler from '@/photo/PhotoEscapeHandler';
import { Metadata } from 'next/types';
import { ThemeProvider } from 'next-themes';
import Nav from '@/app/Nav';
import Footer from '@/app/Footer';
import CommandK from '@/cmdk/CommandK';
import SwrConfigClient from '@/swr/SwrConfigClient';
import ShareModals from '@/share/ShareModals';
import AdminUploadPanel from '@/admin/upload/AdminUploadPanel';
import { revalidatePath } from 'next/cache';
import RecipeModal from '@/recipe/RecipeModal';
import ThemeColors from '@/app/ThemeColors';
import AppTextProvider from '@/i18n/state/AppTextProvider';
import SharedHoverProvider from '@/components/shared-hover/SharedHoverProvider';
import { PATH_FEED_JSON, PATH_RSS_XML } from '@/app/path';
import SelectPhotosProvider from '@/admin/select/SelectPhotosProvider';
import AdminBatchEditPanel from '@/admin/select/AdminBatchEditPanel';

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
      <body className={clsx(
        // Center on large screens
        '3xl:flex flex-col items-center',
      )}>
        <AppStateProvider areAdminDebugToolsEnabled={ADMIN_DEBUG_TOOLS_ENABLED}>
          <AppTextProvider>
            <SelectPhotosProvider>
              <ThemeColors />
              <ThemeProvider attribute="class" defaultTheme={DEFAULT_THEME}>
                <SwrConfigClient>
                  <SharedHoverProvider>
                    <div className={clsx(
                      'mx-3 mb-3',
                      'lg:mx-6 lg:mb-6',
                    )}>
                      <Nav />
                      <main>
                        <ShareModals />
                        <RecipeModal />
                        <div className={clsx(
                          'min-h-[16rem] sm:min-h-[30rem]',
                          'mb-12',
                          'space-y-5',
                        )}>
                          <AdminUploadPanel
                            shouldResize={!PRESERVE_ORIGINAL_UPLOADS}
                            onLastUpload={async () => {
                              'use server';
                              // Update upload count in admin nav
                              revalidatePath('/admin', 'layout');
                            }}
                          />
                          <AdminBatchEditPanel
                            onBatchActionComplete={async () => {
                              'use server';
                              // Update upload count in admin nav
                              revalidatePath('/admin', 'layout');
                            }}
                          />
                          {children}
                        </div>
                      </main>
                      <Footer />
                    </div>
                    <CommandK />
                  </SharedHoverProvider>
                </SwrConfigClient>
                <Analytics debug={false} />
                <SpeedInsights debug={false}  />
                <PhotoEscapeHandler />
                <ToasterWithThemes />
              </ThemeProvider>
            </SelectPhotosProvider>
          </AppTextProvider>
        </AppStateProvider>
      </body>
    </html>
  );
}
