'use client';

import { ComponentProps, useRef } from 'react';
import { clsx } from 'clsx/lite';
import Link from 'next/link';
import useVisibility from '@/utility/useVisibility';
import OGLoaderImage from './OGLoaderImage';

export type OGTilePropsCore = Omit<
  ComponentProps<typeof OGTile>,
  'title' | 'description' | 'path' | 'pathImage'
>;

export default function OGTile({
  path,
  pathImage,
  description,
  riseOnHover,
  onVisible,
  ...props
}: {
  description: string
  pathImage: string
  riseOnHover?: boolean
  onVisible?: () => void
} & ComponentProps<typeof OGLoaderImage>) {
  const ref = useRef<HTMLAnchorElement>(null);

  useVisibility({ ref, onVisible });

  return (
    <Link
      ref={ref}
      href={path}
      className={clsx(
        'group',
        'block w-full rounded-md overflow-hidden',
        'border-medium shadow-xs',
        riseOnHover && 'hover:-translate-y-1.5 transition-transform',
      )}
    >
      <OGLoaderImage {...{ ...props, path: pathImage }} />
      <div className={clsx(
        'h-full flex flex-col gap-0.5 p-3',
        'font-sans leading-tight',
        'bg-gray-50 dark:bg-gray-900/50',
        'group-active:bg-gray-50 dark:group-active:bg-gray-900/50',
        'group-hover:bg-gray-100 dark:group-hover:bg-gray-900/70',
        'border-t border-gray-200 dark:border-gray-800',
      )}>
        <div className="text-gray-800 dark:text-white font-medium">
          {props.title}
        </div>
        <div className="text-medium">
          {description}
        </div>
      </div>
    </Link>
  );
};
