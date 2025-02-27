'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx/lite';
import { ReactNode, useEffect, useState, useTransition } from 'react';
import LoaderButton from '../primitives/LoaderButton';
import { usePathname, useRouter } from 'next/navigation';
import { downloadFileFromBrowser } from '@/utility/url';

export default function MoreMenuItem({
  label,
  labelComplex,
  annotation,
  icon,
  href,
  hrefDownloadName,
  className,
  action,
  dismissMenu,
  shouldPreventDefault = true,
}: {
  label: string
  labelComplex?: ReactNode
  annotation?: string
  icon?: ReactNode
  href?: string
  hrefDownloadName?: string
  className?: string
  action?: () => Promise<void> | void
  dismissMenu?: () => void
  shouldPreventDefault?: boolean
}) {
  const router = useRouter();

  const pathname = usePathname();

  const [isPending, startTransition] = useTransition();

  const [transitionDidStart, setTransitionDidStart] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (transitionDidStart && !isPending) {
      dismissMenu?.();
      setTransitionDidStart(false);
    }
  }, [isPending, dismissMenu, transitionDidStart]);

  return (
    <DropdownMenu.Item
      disabled={isLoading}
      className={clsx(
        'flex items-center h-9',
        'pl-2 pr-3 py-2 rounded-sm',
        'select-none hover:outline-hidden',
        'hover:bg-gray-100/90 active:bg-gray-200/75',
        'dark:hover:bg-gray-800/60 dark:active:bg-gray-900/80',
        'whitespace-nowrap',
        isLoading
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer',
        className,
      )}
      onSelect={async e => {
        if (shouldPreventDefault) { e.preventDefault(); }
        if (action) {
          const result = action();
          if (result instanceof Promise) {
            setIsLoading(true);
            await result.finally(() => {
              setIsLoading(false);
              dismissMenu?.();
            });
          }
        }
        if (href && href !== pathname) {
          if (hrefDownloadName) {
            setIsLoading(true);
            downloadFileFromBrowser(href, hrefDownloadName)
              .finally(() => {
                setIsLoading(false);
                dismissMenu?.();
              });
          } else {
            setTransitionDidStart(true);
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
        {labelComplex ?? label}
        {annotation &&
          <span className="text-dim ml-3">
            {annotation}
          </span>}
      </LoaderButton>
    </DropdownMenu.Item>
  );
}
