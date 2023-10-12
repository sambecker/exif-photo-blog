'use client';

import SiteGrid from '@/components/SiteGrid';
import {
  PATH_ADMIN_CONFIGURATION,
  checkPathPrefix,
  isPathAdminConfiguration,
} from '@/site/paths';
import { cc } from '@/utility/css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BiCog } from 'react-icons/bi';

export default function AdminNav({
  items,
}: {
  items: {
    label: string,
    href: string,
    count: number,
  }[]
}) {
  const pathname = usePathname();

  return (
    <SiteGrid
      contentMain={
        <div className={cc(
          'flex gap-2 md:gap-4',
          'border-b border-gray-200 dark:border-gray-800 pb-3',
        )}>
          <div className={cc(
            'flex gap-2 md:gap-4',
            'flex-grow overflow-x-scroll',
          )}>
            {items.map(({ label, href, count }) =>
              <Link
                key={label}
                href={href}
                className={cc(
                  'flex gap-0.5',
                  checkPathPrefix(pathname, href) ? 'font-bold' : 'text-dim',
                )}
              >
                <span>{label}</span>
                <span>({count})</span>
              </Link>)}
          </div>
          <Link
            href={PATH_ADMIN_CONFIGURATION}
            className={isPathAdminConfiguration(pathname)
              ? 'font-bold'
              : 'text-dim'}
          >
            <BiCog
              size={18}
              className="inline-block"
              aria-label="Blog Configuration"
            />
          </Link>
        </div>
      }
    />
  );
}
