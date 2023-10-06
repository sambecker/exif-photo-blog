'use client';

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
    <div className={cc(
      'border-b border-gray-900 pb-2',
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
              !pathname.startsWith(href) && 'text-dim',
            )}
          >
            <span>{label}</span>
            <span>({count})</span>
          </Link>)}
      </div>
    </div>
  );
}
