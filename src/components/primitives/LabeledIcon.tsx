import { ReactNode } from 'react';
import Icon from './Icon';
import { clsx } from 'clsx/lite';

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
  debug,
}: {
  icon?: ReactNode,
  type?: LabeledIconType,
  className?: string,
  children: ReactNode,
  iconWide?:boolean,
  debug?: boolean,
}) {
  return (
    <span className={ clsx(
      'inline-flex gap-x-1 md:gap-x-1.5 min-w-0',
      classNameProp,
      debug && 'border border-green-500 m-[-1px]',
    )}>
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
          'uppercase overflow-hidden',
          debug && 'bg-gray-300 dark:bg-gray-700',
        )}>
          {children}
        </span>}
    </span>
  );
}
