import { clsx } from 'clsx/lite';
import AnimateItems from './AnimateItems';
import { ReactNode } from 'react';

export default function HeaderList({
  title,
  className,
  icon,
  items,
}: {
  title?: string,
  className?: string,
  icon?: JSX.Element,
  items: ReactNode[]
}) {
  return (
    <AnimateItems
      className={clsx(
        className,
        'space-y-1',
      )}
      scaleOffset={0.95}
      duration={0.5}
      staggerDelay={0.05}
      items={(title || icon
        ? [<div
          key="header"
          className={clsx(
            'text-gray-900',
            'dark:text-gray-100',
            'flex items-center mb-1 gap-1',
            'uppercase',
          )}
        >
          {icon &&
            <span className="w-[1rem]">
              {icon}
            </span>}
          {title}
        </div>]
        :[] as ReactNode[]
      ).concat(items)}
      classNameItem="text-dim uppercase"
    />
  );
}
