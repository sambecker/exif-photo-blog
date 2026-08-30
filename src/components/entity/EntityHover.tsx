import { ComponentProps, ReactNode, useMemo } from 'react';
import SharedHover from '../shared-hover/SharedHover';
import { Photo } from '@/photo';
import { getDimensionsFromSize } from '@/utility/size';
import PhotoMedium from '@/photo/PhotoMedium';
import clsx from 'clsx/lite';

const { width, height } = getDimensionsFromSize(300, 16 / 9);

export default function EntityHover({
  hoverKey,
  header,
  caption,
  photos,
  photosCount,
  children,
  className,
  color,
}: {
  hoverKey: string
  header?: ReactNode
  caption?: ReactNode
  photos?: Photo[]
  photosCount: number
  color?: ComponentProps<typeof SharedHover>['color']
  className?: string
  children: ReactNode
}) {
  const photosToShow = useMemo(() => {
    if (photosCount >= 6) {
      return 6;
    } else if (photosCount >= 4) {
      return 4;
    } else {
      return photosCount;
    }
  }, [photosCount]);

  const gridClass = useMemo(() => {
    if (photosCount >= 6) {
      return 'grid-cols-3 grid-rows-2';
    } else if (photosCount >= 3) {
      return 'grid-cols-2 grid-rows-2';
    } else if (photosCount >= 2) {
      return 'grid-cols-2';
    } else {
      return 'grid-cols-1';
    }
  }, [photosCount]);

  const hasSplitLayout = photosCount === 3;

  const content = useMemo(() =>
    <div className="relative w-full h-full">
      {/* Photo grid */}
      <div className={clsx('absolute inset-0 grid', gridClass)}>
        {Array.from({ length: photosToShow }).map((_, index) =>
          photos?.[index] &&
            <PhotoMedium
              key={photos[index].id}
              photo={photos[index]}
              className={clsx(hasSplitLayout && index === 0 && 'row-span-2')}
              // Hover content is inert (pointer-events-none), so never prefetch
              prefetch={false}
            />)}
      </div>
      {/* Placeholder grid */}
      <div className={clsx(
        'absolute inset-0 grid',
        gridClass,
        'transition-opacity duration-300',
        photos ? 'opacity-0' : 'opacity-100',
        'bg-gray-100 dark:bg-gray-900',
      )}>
        {Array.from({ length: photosToShow }).map((_, index) =>
          <div
            key={index}
            className={clsx(
              'border-[0.5px] border-main',
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
          <div className="grow">
            {header &&
              <span className={clsx(
                'flex text-base text-white',
                'grow',
                'translate-x-[4px]',
              )}>
                {header}
              </span>}
          </div>
          {/* Caption */}
          {caption &&
            <div className={clsx(
              'self-start',
              'flex items-center gap-2',
              'px-1.5 py-0.5 rounded-sm',
              'text-white/90 bg-black/40 backdrop-blur-lg',
              'outline-medium shadow-sm',
              'uppercase text-[0.7rem]',
            )}>
              {caption}
            </div>}
        </div>
      </div>
    </div>
  , [
    gridClass,
    hasSplitLayout,
    photosToShow,
    photos,
    header,
    caption,
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
