'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx/lite';
import {
  ComponentProps,
  ReactNode,
  useEffect,
  useState,
  useTransition,
} from 'react';
import LoaderButton from '../primitives/LoaderButton';
import { usePathname, useRouter } from 'next/navigation';
import { downloadFileFromBrowser } from '@/utility/url';
import KeyCommand from '../primitives/KeyCommand';

export default function MoreMenuItem({
  label,
  labelComplex,
  annotation,
  icon,
  color = 'grey',
  href,
  hrefDownloadName,
  className,
  action,
  dismissMenu,
  shouldPreventDefault = true,
  keyCommand,
  keyCommandModifier,
}: {
  label: string
  labelComplex?: ReactNode
  annotation?: ReactNode
  icon?: ReactNode
  color?: 'grey' | 'red'
  href?: string
  hrefDownloadName?: string
  className?: string
  action?: () => Promise<void | boolean> | void
  dismissMenu?: () => void
  shouldPreventDefault?: boolean
  keyCommand?: string
  keyCommandModifier?: ComponentProps<typeof KeyCommand>['modifier']
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
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }, [isPending, dismissMenu, transitionDidStart]);

  const getColorClasses = () => {
    switch (color) {
    case 'grey': return clsx(
      'hover:bg-gray-100/90 active:bg-gray-200/75',
      'dark:hover:bg-gray-800/60 dark:active:bg-gray-900/80',
    );
    case 'red': return clsx(
      'hover:bg-red-100/50 active:bg-red-100/75',
      'dark:hover:bg-red-950/55 dark:active:bg-red-950/80',
    );
    }
  };

  return (
    <DropdownMenu.Item
      disabled={isLoading}
      className={clsx(
        'flex items-center h-8.5 gap-4',
        'px-2 py-2 rounded-sm',
        'select-none hover:outline-hidden',
        getColorClasses(),
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
            await result
              .then(shouldClose => {
                if (
                  shouldClose === undefined ||
                  shouldClose === true
                ) {
                  dismissMenu?.();
                }
              })
              .finally(() => {
                setIsLoading(false);
              });
          } else {
            dismissMenu?.();
          }
        }
        if (href) {
          if (href !== pathname) {
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
          } else {
            dismissMenu?.();
          }
        }
      }}
    >
      <LoaderButton
        icon={icon}
        isLoading={isLoading || isPending}
        hideTextOnMobile={false}
        styleAs="link-without-hover"
        className="translate-y-[0.5px] text-sm grow"
        classNameIcon="translate-y-[-0.5px]!"
      >
        <span>
          {labelComplex ?? label}
        </span>
        {annotation &&
          <span className="text-dim ml-3">
            {annotation}
          </span>}
      </LoaderButton>
      {keyCommand &&
        <KeyCommand
          modifier={keyCommandModifier}
          className="hidden! sm:inline-flex!"
        >
          {keyCommand}
        </KeyCommand>}
    </DropdownMenu.Item>
  );
}
