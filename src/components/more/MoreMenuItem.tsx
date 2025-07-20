'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx/lite';
import {
  ComponentProps,
  ReactNode,
  useState,
} from 'react';
import LoaderButton from '../primitives/LoaderButton';
import { downloadFileFromBrowser } from '@/utility/url';
import KeyCommand from '../primitives/KeyCommand';
import LoaderLink from '../LoaderLink';

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
  const [isLoading, setIsLoading] = useState(false);

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

  const buttonContent = <>
    <span>
      {labelComplex ?? label}
    </span>
    {annotation &&
      <span className="text-dim ml-3">
        {annotation}
      </span>}
  </>;

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
        if (action && !href) {
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
        if (href && hrefDownloadName) {
          setIsLoading(true);
          downloadFileFromBrowser(href, hrefDownloadName)
            .finally(() => {
              setIsLoading(false);
              dismissMenu?.();
            });
        }
      }}
    >
      {href && !hrefDownloadName
        ? <LoaderLink
          icon={icon}
          href={href}
          className={clsx(
            'inline-flex items-center grow',
            'text-sm text-main hover:text-main',
          )}
          onLoad={() => {
            action?.();
            dismissMenu?.();
          }}
          flickerThreshold={0}
        >
          {buttonContent}
        </LoaderLink>
        : <LoaderButton
          icon={icon}
          isLoading={isLoading}
          hideText="never"
          styleAs="link-without-hover"
          className="translate-y-[0.5px] text-sm grow"
          classNameIcon="translate-y-[-0.5px]!"
        >
          {buttonContent}
        </LoaderButton>}
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
