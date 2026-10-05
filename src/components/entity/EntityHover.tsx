import { ComponentProps, ReactNode, useMemo } from 'react';
import SharedHover from '../shared-hover/SharedHover';
import { Photo } from '@/photo';
import { getDimensionsFromSize } from '@/utility/size';
import PhotoMedium from '@/photo/PhotoMedium';
import clsx from 'clsx/lite';
import {
  MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
  PHOTOS_TO_SHOW_PER_CATEGORY,
} from '@/image-response';

const { width, height } = getDimensionsFromSize(300, 16 / 9);

export default function EntityHover({
  hoverKey,
  header,
  description,
  caption,
  photos,
  photosCount,
  maxPhotos = PHOTOS_TO_SHOW_PER_CATEGORY,
  gap = true,
  children,
  className,
  color,
}: {
  hoverKey: string
  header?: ReactNode
  description?: string
  caption?: ReactNode
  photos?: Photo[]
  photosCount: number
  maxPhotos?: number
  gap?: boolean
  color?: ComponentProps<typeof SharedHover>['color']
  className?: string
  children: ReactNode
}) {
  const photosToShow = useMemo(() => {
    const length = Math.min(
      photosCount,
      maxPhotos,
      MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
    );
    if (length >= 6) {
      return 6;
    } else if (length >= 5) {
      return 5;
    } else if (length >= 4) {
      return 4;
    } else {
      return length;
    }
  }, [photosCount, maxPhotos]);

  const gridClass = useMemo(() => {
    if (photosToShow >= 6) {
      return 'grid-cols-3 grid-rows-2';
    } else if (photosToShow === 5) {
      return 'grid-cols-4 grid-rows-2';
    } else if (photosToShow >= 3) {
      return 'grid-cols-2 grid-rows-2';
    } else if (photosToShow >= 2) {
      return 'grid-cols-2';
    } else {
      return 'grid-cols-1';
    }
  }, [photosToShow]);

  const hasSplitLayout = photosToShow === 3;
  const hasFiveLayout = photosToShow === 5;

  const content = useMemo(() =>
    <div className="relative w-full h-full">
      {/* Photo grid */}
      <div className={clsx(
        'absolute inset-0 grid',
        gap && 'gap-px',
        gridClass,
      )}>
        {Array.from({ length: photosToShow }).map((_, index) =>
          photos?.[index] &&
            <PhotoMedium
              key={photos[index].id}
              photo={photos[index]}
              className={clsx(
                hasFiveLayout && index === 0 && 'col-span-2 row-span-2',
                hasSplitLayout && index === 0 && 'row-span-2',
              )}
              // Hover content is inert (pointer-events-none), so never prefetch
              prefetch={false}
            />)}
      </div>
      {/* Placeholder grid */}
      <div className={clsx(
        'absolute inset-0 grid',
        gap && 'gap-px',
        gridClass,
        'transition-opacity duration-300',
        photos ? 'opacity-0' : 'opacity-100',
        gap
          ? '*:bg-gray-200 dark:*:bg-gray-800'
          : 'bg-gray-100 dark:bg-gray-900',
      )}>
        {Array.from({ length: photosToShow }).map((_, index) =>
          <div
            key={index}
            className={clsx(
              !gap && 'border-[0.5px] border-white dark:border-black',
              hasFiveLayout && index === 0 && 'col-span-2 row-span-2',
              hasSplitLayout && index === 0 && 'row-span-2',
            )}
          />)}
      </div>
      {/* Text guard */}
      <div className={clsx(
        'absolute inset-0 transition-colors duration-300',
        'bg-gradient-to-b',
        photos ? 'from-black/70' : 'from-black/30',
        'to-transparent',
      )} />
      {/* Text */}
      <div className="absolute inset-0 p-2.5">
        <div className="flex flex-col gap-1 h-full">
          {/* Header */}
          <div className="grow min-w-0">
            {header &&
              <span className={clsx(
                'flex text-base text-white',
                'grow',
                'translate-x-[4px]',
              )}>
                {header}
              </span>}
            {description &&
              <p className={clsx(
                'mt-3 mx-1',
                'text-[0.7rem] leading-snug text-white/80',
                'text-left text-pretty',
                'line-clamp-3',
              )}>
                {description}
              </p>}
          </div>
          {/* Caption */}
          {caption &&
            <div className={clsx(
              'self-start',
              'flex items-center gap-2',
              'px-1.5 py-0.5 rounded-sm',
              'text-white/90 bg-black/40 backdrop-blur-lg',
              'outline outline-medium shadow-sm',
              'uppercase text-[0.7rem]',
            )}>
              {caption}
            </div>}
        </div>
      </div>
    </div>
  , [
    gridClass,
    hasFiveLayout,
    hasSplitLayout,
    photosToShow,
    photos,
    header,
    description,
    caption,
    gap,
  ]);

  return <SharedHover {...{
    hoverKey,
    content,
    className,
    width,
    height,
    color,
  }}>
    {children}
  </SharedHover>;
}
