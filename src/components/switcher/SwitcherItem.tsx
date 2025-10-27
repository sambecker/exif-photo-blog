import { clsx } from 'clsx/lite';
import { SHOULD_PREFETCH_ALL_LINKS } from '@/app/config';
import { ComponentProps, ReactNode, RefObject } from 'react';
import Spinner from '../Spinner';
import LinkWithIconLoader from '../LinkWithIconLoader';
import Tooltip from '../Tooltip';

const WIDTH_CLASS         = 'w-[42px]';
const WIDTH_CLASS_NARROW  = 'w-[36px]';

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
  prefetch = SHOULD_PREFETCH_ALL_LINKS,
  tooltip,
  width = 'normal',
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
  prefetch?: boolean
  tooltip?: ComponentProps<typeof Tooltip>
  width?: 'narrow' | 'normal'
}) {
  const widthClass = width === 'narrow' ? WIDTH_CLASS_NARROW : WIDTH_CLASS;
  const className = clsx(
    'flex items-center justify-center',
    `${widthClass} h-[28px]`,
    isInteractive && 'cursor-pointer',
    isInteractive && 'hover:bg-gray-100/60 active:bg-gray-100',
    isInteractive && 'dark:hover:bg-gray-900/75 dark:active:bg-gray-900',
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
      'w-[28px] h-[24px]',
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
      loader: <Spinner />,
    }} />
    : <div {...{ title, onClick, className }}>
      {renderIcon()}
    </div>;

  return (
    tooltip
      ? <Tooltip
        {...tooltip}
        classNameTrigger={widthClass}
        delayDuration={500}
      >
        {content}
      </Tooltip>
      : content
  );
};
