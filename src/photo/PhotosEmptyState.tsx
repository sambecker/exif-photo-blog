import InfoBlock from '@/components/InfoBlock';
import SiteGrid from '@/components/SiteGrid';
import { IS_SITE_READY } from '@/site/config';
import { PATH_ADMIN_CONFIGURATION, PATH_ADMIN_PHOTOS } from '@/site/paths';
import SiteChecklist from '@/site/SiteChecklist';
import { clsx } from 'clsx/lite';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { HiOutlinePhotograph } from 'react-icons/hi';

export default function PhotosEmptyState() {
  return (
    <SiteGrid
      contentMain={
        <InfoBlock
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
            ? <SiteChecklist />
            : <div className="max-w-md text-center space-y-6">
              <div className="space-y-2">
                <div>
                  Add your first photo:
                </div>
                <Link
                  href={PATH_ADMIN_PHOTOS}
                  className="button primary"
                >
                  <span>Admin Dashboard</span>
                  <FaArrowRight size={10} />
                </Link>
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
        </InfoBlock>}
    />
  );
};
