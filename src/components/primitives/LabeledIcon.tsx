import { ComponentProps, ReactNode } from 'react';
import Icon from './Icon';
import { clsx } from 'clsx/lite';
import Link from 'next/link';

export type LabeledIconType =
  'icon-first' |
  'icon-last' |
  'icon-only' |
  'text-only';

export default function LabeledIcon({
  icon,
  type = 'icon-first',
  className: classNameProp,
  children,
  iconWide,
  href,
  prefetch,
  debug,
}: {
  icon?: ReactNode,
  type?: LabeledIconType,
  className?: string,
  children: ReactNode,
  iconWide?:boolean,
  debug?: boolean,
} & Partial<ComponentProps<typeof Link>>) {
  const className = clsx(
    'inline-flex gap-x-1 md:gap-x-1.5',
    classNameProp,
    debug && 'border border-green-500 m-[-1px]',
  );

  const renderContent = () => <>
    {icon && type !== 'text-only' &&
      <Icon {...{
        className: clsx(type === 'icon-last' && 'order-1'),
        wide: iconWide,
        debug,
      }}>
        {icon}
      </Icon>}
    {children && type !== 'icon-only' &&
      <span className={clsx(
        'uppercase',
        debug && 'bg-gray-700'
      )}>
        {children}
      </span>}
  </>;
  
  return href
    ? <Link {...{ href, prefetch, className }}>
      {renderContent()}
    </Link>
    : <div {...{ className }}>
      {renderContent()}
    </div>;
}
