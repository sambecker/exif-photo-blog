import InfoBlock from '@/components/InfoBlock';
import SiteGrid from '@/components/SiteGrid';
import { IS_SITE_READY } from '@/site/config';
import SiteChecklist from '@/site/SiteChecklist';
import { clsx } from 'clsx/lite';
import Link from 'next/link';
import { HiOutlinePhotograph } from 'react-icons/hi';

export default function PhotosEmptyState() {
  const renderLink = (href: string) =>
    <Link
      href={href}
      className="hover:underline hover:text-main"
    >
      {href}
    </Link>;

  return (
    <SiteGrid
      contentMain={
        <InfoBlock padding="loose">
          <HiOutlinePhotograph
            className="text-medium"
            size={24}
          />
          <div className={clsx(
            'font-bold text-2xl',
            'text-gray-700 dark:text-gray-200',
          )}>
            {!IS_SITE_READY ? 'Finish Setup' : 'Welcome!'}
          </div>
          {!IS_SITE_READY
            ? <SiteChecklist />
            : <div className="max-w-md leading-relaxed text-center">
              <div className="mb-3">
                1. Visit
                {' '}
                {renderLink('/admin/photos')}
                {' '}
                to add your first photo
              </div>
              <div>
                2. Change the name of this blog and other configuration
                by editing environment variables referenced in
                {' '}
                {renderLink('/admin/configuration')}
              </div>
            </div>}
        </InfoBlock>}
    />
  );
};
