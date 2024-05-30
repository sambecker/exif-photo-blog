'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx/lite';
import { ReactNode, useState, useTransition } from 'react';
import LoaderButton from '../primitives/LoaderButton';
import { useRouter } from 'next/navigation';

export default function MoreMenuItem({
  label,
  icon,
  href,
  action,
}: {
  label: ReactNode
  icon?: ReactNode
  href?: string
  action?: () => Promise<void> | void
}) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [isLoading, setIsLoading] = useState(false);

  return (
    <DropdownMenu.Item
      disabled={isLoading}
      className={clsx(
        'px-2 py-1.5 rounded-[3px]',
        'select-none hover:outline-none',
        'hover:bg-gray-50 active:bg-gray-100',
        'hover:dark:bg-gray-900/75 active:dark:bg-gray-900',
        'whitespace-nowrap',
        isLoading
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer',
      )}
      onClick={e => {
        e.preventDefault();
        if (href) {
          startTransition(() => router.push(href));
        } else {
          const result = action?.();
          if (result instanceof Promise) {
            setIsLoading(true);
            result.finally(() => setIsLoading(false));
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
