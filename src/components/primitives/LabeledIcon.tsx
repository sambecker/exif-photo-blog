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
  className,
  classNameIcon,
  children,
  iconWide,
  uppercase = true,
  debug,
}: {
  icon?: ReactNode,
  type?: LabeledIconType,
  className?: string,
  classNameIcon?: string,
  children: ReactNode,
  iconWide?:boolean,
  uppercase?: boolean,
  debug?: boolean,
}) {
  return (
    <span className={ clsx(
      'inline-flex gap-x-1.5 md:gap-x-2 min-w-0',
      className,
      debug && 'border border-green-500 m-[-1px]',
    )}>
      {icon && type !== 'text-only' &&
        <Icon {...{
          className: clsx(
            type === 'icon-last' && 'order-1',
            classNameIcon,
          ),
          wide: iconWide,
          debug,
        }}>
          {icon}
        </Icon>}
      {children && type !== 'icon-only' &&
        <span className={clsx(
          'overflow-hidden',
          uppercase && 'uppercase',
          debug && 'bg-gray-300 dark:bg-gray-700',
        )}>
          {children}
        </span>}
    </span>
  );
}
