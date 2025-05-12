import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { clsx } from 'clsx/lite';
import {
  BASE_URL,
  DEFAULT_THEME,
  PRESERVE_ORIGINAL_UPLOADS,
  META_DESCRIPTION,
  NAV_TITLE_OR_DOMAIN,
  META_TITLE,
} from '@/app/config';
import AppStateProvider from '@/state/AppStateProvider';
import ToasterWithThemes from '@/toast/ToasterWithThemes';
import PhotoEscapeHandler from '@/photo/PhotoEscapeHandler';
import { Metadata } from 'next/types';
import { ThemeProvider } from 'next-themes';
import Nav from '@/app/Nav';
import Footer from '@/app/Footer';
import CommandK from '@/cmdk/CommandK';
import SwrConfigClient from '@/state/SwrConfigClient';
import AdminBatchEditPanel from '@/admin/AdminBatchEditPanel';
import ShareModals from '@/share/ShareModals';
import AdminUploadPanel from '@/admin/upload/AdminUploadPanel';
import { revalidatePath } from 'next/cache';
import RecipeModal from '@/recipe/RecipeModal';
import ThemeColors from '@/app/ThemeColors';
import AppTextProvider from '@/i18n/state/AppTextProvider';

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
      <body className={clsx(
        // Center on large screens
        '3xl:flex flex-col items-center',
      )}>
        <AppStateProvider>
          <AppTextProvider>
            <ThemeColors />
            <ThemeProvider attribute="class" defaultTheme={DEFAULT_THEME}>
              <SwrConfigClient>
                <div className={clsx(
                  'mx-3 mb-3',
                  'lg:mx-6 lg:mb-6',
                )}>
                  <Nav navTitleOrDomain={NAV_TITLE_OR_DOMAIN} />
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
                      <AdminBatchEditPanel />
                      {children}
                    </div>
                  </main>
                  <Footer />
                </div>
                <CommandK />
              </SwrConfigClient>
              <Analytics debug={false} />
              <SpeedInsights debug={false}  />
              <PhotoEscapeHandler />
              <ToasterWithThemes />
            </ThemeProvider>
          </AppTextProvider>
        </AppStateProvider>
      </body>
    </html>
  );
}
