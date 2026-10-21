import { clsx } from 'clsx/lite';
import { SHOULD_PREFETCH_ALL_LINKS } from '@/app/config';
import { ComponentProps, ReactNode, RefObject } from 'react';
import Spinner from '../Spinner';
import LinkWithIconLoader from '../LinkWithIconLoader';
import Tooltip from '../Tooltip';

export const SWITCHER_ITEM_WIDTH = 46;

export const WIDTH_CLASS         = 'w-[46px]';
export const WIDTH_CLASS_NARROW  = 'w-[36px] sm:w-[42px]';
export const HEIGHT_CLASS        = 'h-[32px]';

// Segmented Switcher controls (e.g. theme switch)
export const SWITCHER_ITEM_INTERACTIVE_BG = clsx(
  'hover:bg-gray-100/60 active:bg-gray-100',
  'dark:hover:bg-gray-900/75 dark:active:bg-gray-900',
);

// Flat nav toolbar icons — matches compact view trigger / MoreMenu
export const NAV_ITEM_INTERACTIVE_BG = clsx(
  'hover:bg-gray-100 active:bg-gray-200/75',
  'dark:hover:bg-gray-800/75 dark:active:bg-gray-900',
);

// Persistent "hovered" chrome (e.g. non-default sort)
export const NAV_ITEM_INTERACTIVE_BG_PERSIST = clsx(
  'bg-gray-100 dark:bg-gray-800/75',
);

export default function SwitcherItem({
  icon,
  title,
  href,
  hrefRef,
  className: classNameProp,
  onClick,
  active,
  isInteractive = true,
  noPadding,
  naked,
  persistHover,
  prefetch = SHOULD_PREFETCH_ALL_LINKS,
  tooltip,
  width = 'normal',
  iconIsFocusable,
}: {
  icon: ReactNode
  title?: string
  href?: string
  hrefRef?: RefObject<HTMLAnchorElement | null>
  className?: string
  onClick?: () => void
  active?: boolean
  isInteractive?: boolean
  noPadding?: boolean
  // Icon-only nav control (hover chrome, no permanent container)
  naked?: boolean
  // Keep hover background applied (e.g. non-default sort)
  persistHover?: boolean
  prefetch?: boolean
  tooltip?: ComponentProps<typeof Tooltip>
  width?: 'narrow' | 'normal'
  // Set when `icon` contains its own focusable element, so the tooltip
  // doesn't wrap it in a button. See `triggerIsFocusable` on TooltipPrimitive
  iconIsFocusable?: boolean
}) {
  const ariaLabel = typeof tooltip?.content === 'string'
    ? tooltip.content
    : undefined;

  const widthClass = width === 'narrow' ? WIDTH_CLASS_NARROW : WIDTH_CLASS;
  const className = clsx(
    'link',
    'flex items-center justify-center',
    naked && 'rounded-lg',
    `${widthClass} ${HEIGHT_CLASS}`,
    isInteractive && 'cursor-pointer',
    isInteractive && (naked
      ? NAV_ITEM_INTERACTIVE_BG
      : SWITCHER_ITEM_INTERACTIVE_BG),
    persistHover && NAV_ITEM_INTERACTIVE_BG_PERSIST,
    active
      ? 'text-black dark:text-white'
      : 'text-gray-400 dark:text-gray-600',
    active
      ? 'hover:text-black dark:hover:text-white'
      : 'hover:text-gray-700 dark:hover:text-gray-400',
    classNameProp,
  );

  const renderIcon = () => noPadding
    ? icon
    : <div className={clsx(
      'w-[32px] h-[24px]',
      'flex items-center justify-center',
    )}>
      {icon}
    </div>;

  const content = href
    ? <LinkWithIconLoader {...{
      href,
      ref: hrefRef,
      title,
      onClick,
      className,
      prefetch,
      icon: renderIcon(),
      loader: <Spinner size={16} />,
    }}
    aria-label={ariaLabel ?? title}
    />
    : onClick
      ? <button
        type="button"
        {...{ title, onClick, className }}
        aria-label={ariaLabel ?? title}
      >
        {renderIcon()}
      </button>
      : <div {...{ title, className }}>
        {renderIcon()}
      </div>;

  return (
    tooltip
      ? <Tooltip
        {...tooltip}
        classNameTrigger={widthClass}
        delayDuration={500}
        triggerIsFocusable={Boolean(href || onClick || iconIsFocusable)}
      >
        {content}
      </Tooltip>
      : content
  );
};
