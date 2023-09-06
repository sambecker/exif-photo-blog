import InfoBlock from '@/components/InfoBlock';
import SiteGrid from '@/components/SiteGrid';
import { CONFIG_CHECKLIST_STATUS } from '@/site/config';
import SiteChecklist from '@/site/SiteChecklist';
import { cc } from '@/utility/css';
import Link from 'next/link';
import { HiOutlinePhotograph } from 'react-icons/hi';

export default function PhotosEmptyState() {
  const showChecklist = Object.values(CONFIG_CHECKLIST_STATUS).some(v => !v);

  return (
    <SiteGrid
      contentMain={
        <InfoBlock>
          <HiOutlinePhotograph
            className="text-gray-500 dark:text-gray-400"
            size={24}
          />
          <div className={cc(
            'font-bold text-2xl',
            'text-gray-700 dark:text-gray-200',
          )}>
            {showChecklist ? 'Finish Setup' : 'Welcome!'}
          </div>
          {showChecklist
            ? <SiteChecklist />
            : <div className="max-w-md leading-[1.7] text-center">
              <div className="mb-2">
                1. Visit
                {' '}
                <Link
                  href="/admin"
                  className="underline hover:no-underline"
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
