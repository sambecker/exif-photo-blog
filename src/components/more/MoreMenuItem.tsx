'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx/lite';
import { ReactNode, useState, useTransition } from 'react';
import LoaderButton from '../primitives/LoaderButton';
import { usePathname, useRouter } from 'next/navigation';
import { downloadFileFromBrowser } from '@/utility/url';

export default function MoreMenuItem({
  label,
  icon,
  href,
  hrefDownloadName,
  action,
  shouldPreventDefault = true,
}: {
  label: ReactNode
  icon?: ReactNode
  href?: string
  hrefDownloadName?: string
  action?: () => Promise<void> | void
  shouldPreventDefault?: boolean
}) {
  const router = useRouter();

  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();

  const [isLoading, setIsLoading] = useState(false);

  return (
    <DropdownMenu.Item
      disabled={isLoading}
      className={clsx(
        'flex items-center h-8',
        'px-2 py-1.5 rounded-[3px]',
        'select-none hover:outline-hidden',
        'hover:bg-gray-50 active:bg-gray-100',
        'dark:hover:bg-gray-900/75 dark:active:bg-gray-900',
        'whitespace-nowrap',
        isLoading
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer',
      )}
      onClick={async e => {
        if (shouldPreventDefault) { e.preventDefault(); }
        if (action) {
          const result = action();
          if (result instanceof Promise) {
            setIsLoading(true);
            await result.finally(() => setIsLoading(false));
          }
        }
        if (href && href !== pathname) {
          if (hrefDownloadName) {
            setIsLoading(true);
            downloadFileFromBrowser(href, hrefDownloadName)
              .finally(() => setIsLoading(false));
          } else {
            startTransition(() => router.push(href));
          }
        }
      }}
    >
      <LoaderButton
        icon={icon}
        isLoading={isLoading || isPending}
        hideTextOnMobile={false}
        styleAs="link-without-hover"
        className="translate-y-[1px]"
      >
        {label}
      </LoaderButton>
    </DropdownMenu.Item>
  );
}
