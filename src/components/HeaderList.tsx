import { cc } from '@/utility/css';
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
      className={className}
      scaleOffset={0.95}
      duration={0.5}
      staggerDelay={0.05}
      items={(title || icon
        ? [<div
          key="header"
          className={cc(
            'text-gray-900',
            'dark:text-gray-100',
            'flex items-center mb-0.5 gap-1',
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
