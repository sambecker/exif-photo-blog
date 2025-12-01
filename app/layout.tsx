'use cache';

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
  PAGE_SCRIPT_URLS,
  VERCEL_GIT_COMMIT_SHA_SHORT,
  DEBUG_OUTPUTS_ENABLED,
  NAV_TITLE,
  NAV_CAPTION,
} from '@/app/config';
import AppStateProvider from '@/app/AppStateProvider';
import ToasterWithThemes from '@/toast/ToasterWithThemes';
import PhotoEscapeHandler from '@/photo/PhotoEscapeHandler';
import { Metadata } from 'next/types';
import { ThemeProvider } from 'next-themes';
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
import Script from 'next/script';
import { ComponentProps, Suspense } from 'react';
import { cacheTagGlobal } from '@/cache';
import SelectPhotosListener from '@/admin/select/SelectPhotosListener';
import { Nav } from '@/app/Nav';
import NavClient from '@/app/NavClient';
import { getPhotos } from '@/photo/query';

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  cacheTagGlobal();

  const photos = await getPhotos({ limit: 1 }).catch(() => []);
  const props: ComponentProps<typeof Nav> = {
    navTitle: NAV_TITLE,
    navCaption: NAV_CAPTION,
    animate: photos.length > 0,
  };

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
              <Suspense>
                <SelectPhotosListener />
              </Suspense>
              <ThemeColors />
              <ThemeProvider attribute="class" defaultTheme={DEFAULT_THEME}>
                <SwrConfigClient>
                  <SharedHoverProvider>
                    <div className={clsx(
                      'mx-3 mb-3',
                      'lg:mx-6 lg:mb-6',
                    )}>
                      <Suspense fallback={<NavClient {...props} />}>
                        <Nav {...props} />
                      </Suspense>
                      <main>
                        <ShareModals />
                        <RecipeModal />
                        <div className={clsx(
                          'min-h-[16rem] sm:min-h-[30rem]',
                          'mb-12',
                          'space-y-5',
                        )}>
                          <Suspense>
                            <AdminUploadPanel
                              shouldResize={!PRESERVE_ORIGINAL_UPLOADS}
                              onLastUpload={async () => {
                                'use server';
                                // Update upload count in admin nav
                                revalidatePath('/admin', 'layout');
                              }}
                            />
                          </Suspense>
                          <AdminBatchEditPanel
                            onBatchActionComplete={async () => {
                              'use server';
                              // Update upload count in admin nav
                              revalidatePath('/admin', 'layout');
                            }}
                          />
                          <Suspense>
                            {children}
                          </Suspense>
                        </div>
                      </main>
                      <Suspense>
                        <Footer />
                      </Suspense>
                    </div>
                    <CommandK />
                  </SharedHoverProvider>
                </SwrConfigClient>
                <Analytics debug={false} />
                <SpeedInsights debug={false} />
                <Suspense>
                  <PhotoEscapeHandler />
                </Suspense>
                <ToasterWithThemes />
              </ThemeProvider>
            </SelectPhotosProvider>
          </AppTextProvider>
        </AppStateProvider>
        {PAGE_SCRIPT_URLS.map(url => <Script key={url} src={url} />)}
      </body>
    </html>
  );
}
