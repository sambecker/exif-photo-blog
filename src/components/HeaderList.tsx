'use client';

import { clsx } from 'clsx/lite';
import AnimateItems from './AnimateItems';
import { ReactNode, useState } from 'react';
import LoaderButton from './primitives/LoaderButton';
import { IoChevronDownOutline, IoChevronUpOutline } from 'react-icons/io5';
import { COLLAPSE_SIDEBAR_CATEGORIES } from '@/app/config';

export default function HeaderList({
  title,
  className,
  icon,
  items,
  maxItems = 5,
}: {
  title?: string,
  className?: string,
  icon?: ReactNode,
  items: ReactNode[],
  maxItems?: number,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasItemsToExpand =
    COLLAPSE_SIDEBAR_CATEGORIES &&
    // Don't show expand button if it only reveals 1 item
    items.length > (maxItems + 1);

  return (
    <AnimateItems
      className={clsx(
        'space-y-1',
        className,
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
            'uppercase select-none',
          )}
        >
          {icon &&
            <span className="text-icon w-[1rem]">
              {icon}
            </span>}
          {title}
        </div>]
        : [] as ReactNode[]
      )
        .concat(items.slice(
          0,
          hasItemsToExpand && !isExpanded ? maxItems : items.length,
        ))
        .concat(hasItemsToExpand
          ? [
            <LoaderButton
              key="expand-button"
              onClick={() => setIsExpanded(!isExpanded)}
              styleAs="link"
              className={clsx(
                'mt-0.5',
                'text-xs font-medium tracking-wider',
                'border-medium rounded-md',
                'px-[5px] h-5!',
                'hover:bg-dim hover:text-main active:bg-main',
                'group',
              )}
            >
              {<span className="flex items-center gap-1">
                {isExpanded
                  ? 'LESS'
                  : <>
                    MORE
                    <span className="hidden group-hover:inline text-dim!">
                      {' '}
                      {items.length - maxItems}
                    </span>
                  </>}
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
