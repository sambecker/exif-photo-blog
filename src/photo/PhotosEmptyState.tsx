import Container from '@/components/Container';
import SiteGrid from '@/components/SiteGrid';
import { IS_SITE_READY, PRESERVE_ORIGINAL_UPLOADS } from '@/app/config';
import AdminAppConfiguration from '@/admin/AdminAppConfiguration';
import { clsx } from 'clsx/lite';
import { HiOutlinePhotograph } from 'react-icons/hi';
import { revalidatePath } from 'next/cache';
import SignInOrUploadClient from '@/admin/SignInOrUploadClient';
import Link from 'next/link';
import { PATH_ADMIN_CONFIGURATION } from '@/app/paths';
import AnimateItems from '@/components/AnimateItems';

export default function PhotosEmptyState() {
  return (
    <SiteGrid
      contentMain={
        <AnimateItems
          items={[
            <Container
              key="PhotosEmptyState"
              className="min-h-[20rem] sm:min-h-[30rem] px-8"
              padding="loose"
            >
              <HiOutlinePhotograph
                className="text-medium"
                size={24}
              />
              <div className={clsx(
                'font-bold text-2xl',
                'text-gray-700 dark:text-gray-200',
              )}>
                {!IS_SITE_READY ? 'Finish Setup' : 'Setup Complete!'}
              </div>
              {!IS_SITE_READY
                ? <AdminAppConfiguration simplifiedView />
                : <div className="max-w-md text-center space-y-6">
                  <SignInOrUploadClient
                    shouldResize={!PRESERVE_ORIGINAL_UPLOADS}
                    onLastUpload={async () => {
                      'use server';
                      // Update upload count in admin nav
                      revalidatePath('/admin', 'layout');
                    }}
                  />
                  <div>
                    Change this site&apos;s name and other configuration
                    by editing environment variables referenced in
                    {' '}
                    <Link
                      href={PATH_ADMIN_CONFIGURATION}
                      className="text-main hover:underline"
                    >
                      /admin/configuration
                    </Link>
                  </div>
                </div>}
            </Container>,
          ]}
        />
      }
    />
  );
};
