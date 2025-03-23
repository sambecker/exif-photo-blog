'use client';

import { clsx } from 'clsx/lite';
import AnimateItems from './AnimateItems';
import { ReactNode, useState } from 'react';
import LoaderButton from './primitives/LoaderButton';
import { IoChevronDownOutline, IoChevronUpOutline } from 'react-icons/io5';

const SIDEBAR_MAX_COLLAPSE_ITEMS = 5;

export default function HeaderList({
  title,
  className,
  icon,
  items,
}: {
  title?: string,
  className?: string,
  icon?: ReactNode,
  items: ReactNode[]
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasMoreItems = items.length > SIDEBAR_MAX_COLLAPSE_ITEMS;

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
            <span className="text-icon w-[1rem]">
              {icon}
            </span>}
          {title}
        </div>]
        :[] as ReactNode[]
      )
        .concat(items.slice(0, isExpanded
          ? items.length
          : SIDEBAR_MAX_COLLAPSE_ITEMS))
        .concat(hasMoreItems
          ? [
            <LoaderButton
              key="expand-button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={clsx(
                'mt-1',
                'text-xs tracking-wide',
                'border-medium rounded-md',
                'px-1.5 h-6!',
                'hover:bg-dim active:bg-main',
              )}
            >
              {<span className="flex items-center gap-1">
                <span>{isExpanded ? 'HIDE' : 'MORE'}</span>
                {isExpanded
                  ? <IoChevronUpOutline size={12} />
                  : <IoChevronDownOutline size={12} />}
              </span>}
            </LoaderButton>,
          ]
          : null)}
      classNameItem="text-dim uppercase"
    />
  );
}
