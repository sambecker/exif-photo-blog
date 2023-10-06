'use client';

import SiteGrid from '@/components/SiteGrid';
import { cc } from '@/utility/css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
          'border-b border-gray-200 dark:border-gray-800 pb-3',
        )}>
          <div className={cc(
            'flex gap-2 md:gap-4',
          )}>
            {items.map(({ label, href, count }) =>
              <Link
                key={label}
                href={href}
                className={cc(
                  'flex gap-0.5',
                  pathname.startsWith(href) ? 'font-bold' : 'text-dim',
                )}
              >
                <span>{label}</span>
                <span>({count})</span>
              </Link>)}
          </div>
        </div>
      }
    />
  );
}
