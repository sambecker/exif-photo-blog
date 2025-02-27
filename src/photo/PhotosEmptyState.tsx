import AdminCTA from '@/admin/AdminCTA';
import Container from '@/components/Container';
import SiteGrid from '@/components/SiteGrid';
import { IS_SITE_READY } from '@/app/config';
import { PATH_ADMIN_CONFIGURATION } from '@/app/paths';
import AdminAppConfiguration from '@/admin/AdminAppConfiguration';
import { clsx } from 'clsx/lite';
import Link from 'next/link';
import { HiOutlinePhotograph } from 'react-icons/hi';

export default function PhotosEmptyState() {
  return (
    <SiteGrid
      contentMain={
        <Container
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
              <div className="space-y-2">
                <div>
                  Add your first photo:
                </div>
                <AdminCTA />
              </div>
              <div>
                Change the name of this blog and other configuration
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
        </Container>}
    />
  );
};
