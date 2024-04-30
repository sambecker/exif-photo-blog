'use client';

import SiteGrid from '@/components/SiteGrid';
import { PATH_ROOT } from '@/site/paths';
import { clsx } from 'clsx/lite';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NotFound() {
  const pathname = usePathname();

  return (
    <SiteGrid contentMain={
      <div className={clsx(
        'min-h-72 sm:min-h-96',
        'flex flex-col items-center justify-center gap-3',
      )}>
        <h1 className={clsx(
          'text-[100px] sm:text-[120px] leading-none',
          'text-gray-800 dark:text-gray-200',
        )}>
          404
        </h1>
        <div className="flex flex-col gap-6 text-center text-dim">
          <div>
            <span className={clsx(
              'underline underline-offset-2 decoration-dotted',
              'cursor-not-allowed',
            )}>
              {pathname}
            </span>
            {' '}
            could not be found
          </div>
          <Link
            href={PATH_ROOT}
            className="text-main"
          >
            Return Home
          </Link>
        </div>
      </div>
    } />
  );
}
