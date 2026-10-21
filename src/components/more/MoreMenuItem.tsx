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
import IconCheck from '../icons/IconCheck';
import { getMenuItemColorClasses } from '../primitives/surface';

/** Default icon column — fits typical 14–16px glyphs */
export const MENU_ICON_SLOT_CLASS = clsx(
  'inline-flex items-center justify-center shrink-0',
  'w-5 h-5',
);

/** Wide icon column — fits 32×24 nav glyphs (full/grid/sort/etc.) */
export const MENU_ICON_SLOT_WIDE_CLASS = clsx(
  'inline-flex items-center justify-center shrink-0',
  'w-8 h-6',
);

export const getMenuIconSlotClass = (wide?: boolean) =>
  wide ? MENU_ICON_SLOT_WIDE_CLASS : MENU_ICON_SLOT_CLASS;

// Indicate the active option in a menu of mutually-exclusive choices.
// Always reserves check-sized space so labels stay left-aligned.
export const renderMenuItemCheck = (isChecked: boolean) =>
  <span className="size-[13px] inline-flex items-center justify-center">
    {isChecked && <IconCheck size={13} />}
  </span>;

export default function MoreMenuItem({
  label,
  labelComplex,
  annotation,
  icon,
  iconWide,
  accessoryEnd,
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
  // Use for 32×24 nav icons so labels align with checkmarks
  iconWide?: boolean
  accessoryEnd?: ReactNode
  color?: 'grey' | 'red' | 'yellow'
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

  const iconSlotClass = getMenuIconSlotClass(iconWide);

  // Stretch the label so a trailing annotation sits on the menu's right edge
  const classNameContent = annotation
    ? 'flex grow items-center'
    : undefined;

  const buttonContent = <>
    <span className={clsx(annotation && 'grow text-left')}>
      {labelComplex ?? label}
    </span>
    {annotation &&
      <span className="text-dim ml-3 shrink-0">
        {annotation}
      </span>}
  </>;

  return (
    <DropdownMenu.Item
      disabled={isLoading}
      className={clsx(
        'flex items-center h-8.5 gap-3',
        'px-2 py-2 rounded-lg',
        'select-none hover:outline-hidden',
        getMenuItemColorClasses(color),
        'whitespace-nowrap',
        isLoading
          ? 'cursor-not-allowed'
          : 'cursor-pointer',
        isLoading && icon && 'text-dim',
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
            // Enlarge clickable area
            '-m-2 p-2',
            keyCommand && 'sm:-mr-10',
          )}
          classNameIcon={iconSlotClass}
          classNameWrapper={annotation ? 'grow' : undefined}
          classNameContent={classNameContent}
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
          // h-auto: link style defaults to h-4, which clips tall nav icons
          className="text-sm grow text-left h-auto!"
          classNameIcon={iconSlotClass}
          classNameContent={classNameContent}
        >
          {buttonContent}
        </LoaderButton>}
      {accessoryEnd &&
        <span className="shrink-0 text-dim pointer-events-none">
          {accessoryEnd}
        </span>}
      {keyCommand &&
        <KeyCommand
          modifier={keyCommandModifier}
          className="max-sm:hidden pointer-events-none"
        >
          {keyCommand}
        </KeyCommand>}
    </DropdownMenu.Item>
  );
}
