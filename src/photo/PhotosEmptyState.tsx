import InfoBlock from '@/components/InfoBlock';
import SiteGrid from '@/components/SiteGrid';
import { IS_SITE_READY } from '@/site/config';
import SiteChecklist from '@/site/SiteChecklist';
import { cc } from '@/utility/css';
import Link from 'next/link';
import { HiOutlinePhotograph } from 'react-icons/hi';

export default function PhotosEmptyState() {
  return (
    <SiteGrid
      contentMain={
        <InfoBlock>
          <HiOutlinePhotograph
            className="text-medium"
            size={24}
          />
          <div className={cc(
            'font-bold text-2xl',
            'text-gray-700 dark:text-gray-200',
          )}>
            {!IS_SITE_READY ? 'Finish Setup' : 'Welcome!'}
          </div>
          {!IS_SITE_READY
            ? <SiteChecklist />
            : <div className="max-w-md leading-[1.7] text-center">
              <div className="mb-2">
                1. Visit
                {' '}
                <Link
                  href="/admin"
                  className="hover:text-gray-800 hover:dark:text-gray-100"
                >
                  /admin
                </Link>
                {' '}
                to add your first photo
              </div>
              <div>
                2. Change the name of this blog and other configuration
                by editing environment variables referenced in
                {' '}
                <span className={cc(
                  'px-1.5',
                  'bg-gray-100',
                  'border border-gray-200 dark:border-gray-700',
                  'dark:bg-gray-800 dark:text-gray-400',
                  'rounded-md',
                )}>
                  src/site/config.ts
                </span>
              </div>
            </div>}
        </InfoBlock>}
    />
  );
};
