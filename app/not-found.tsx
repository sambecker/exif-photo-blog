'use client';

import HttpStatusPage from '@/components/HttpStatusPage';
import { clsx } from 'clsx/lite';
import { usePathname } from 'next/navigation';

export default function NotFound() {
  const pathname = usePathname();

  return (
    <HttpStatusPage status={404}>
      <span className={clsx(
        'underline underline-offset-4 decoration-dotted',
        'cursor-not-allowed',
      )}>
        {pathname}
      </span>
      {' '}
      could not be found
    </HttpStatusPage>
  );
}
