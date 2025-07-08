import { ComponentProps, ReactNode, useMemo } from 'react';
import SharedHover from '../shared-hover/SharedHover';
import { Photo, photoQuantityText } from '@/photo';
import { useSharedHoverState } from '../shared-hover/state';
import useSWR from 'swr';
import { getDimensionsFromSize } from '@/utility/size';
import PhotoMedium from '@/photo/PhotoMedium';
import Spinner from '../Spinner';
import clsx from 'clsx/lite';
import { useAppText } from '@/i18n/state/client';
import { SWR_KEYS } from '@/swr';

const { width, height } = getDimensionsFromSize(300, 16 / 9);

export default function EntityHover({
  hoverKey,
  header,
  getPhotos,
  photosCount,
  children,
  color,
}: {
  hoverKey: string
  header: ReactNode
  getPhotos: () => Promise<Photo[]>
  photosCount: number
  color?: ComponentProps<typeof SharedHover>['color']
  children: ReactNode
}) {
  const appText = useAppText();

  const { isHoverBeingShown } = useSharedHoverState();

  const isHovering = isHoverBeingShown?.(hoverKey);

  const {
    data: photos,
    isLoading,
  } = useSWR(
    isHovering ? `${SWR_KEYS.SHARED_HOVER}-${hoverKey}` : null,
    getPhotos, {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    });

  const photosToShow = useMemo(() => {
    if (photosCount >= 6) {
      return 6;
    } else if (photosCount >= 4) {
      return 4;
    } else if (photosCount >= 2) {
      return 2;
    } else {
      return 1;
    }
  }, [photosCount]);

  const gridClass = useMemo(() => {
    if (photosCount >= 6) {
      return 'grid-cols-3 grid-rows-2';
    } else if (photosCount >= 4) {
      return 'grid-cols-2 grid-rows-2';
    } else if (photosCount >= 2) {
      return 'grid-cols-2';
    } else {
      return 'grid-cols-1';
    }
  }, [photosCount]);

  const content = useMemo(() =>
    <div className="relative w-full h-full">
      {/* Photo grid */}
      <div className={clsx('absolute inset-0 grid', gridClass)}>
        {Array.from({ length: photosToShow }).map((_, index) =>
          photos?.[index] &&
            <PhotoMedium
              key={photos[index].id}
              photo={photos[index]}
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
            className="border-[0.5px] border-main"
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
      <div className={clsx(
        'absolute inset-0 p-2.5',
      )}>
        <div className="flex flex-col gap-1 h-full">
          {/* Header */}
          <div className="grow">
            <span className={clsx(
              'flex text-base',
              'grow',
              'translate-x-[4px]',
            )}>
              {header}
            </span>
          </div>
          {/* Caption */}
          <div className={clsx(
            'self-start',
            'flex items-center gap-2',
            'px-1.5 py-0.5 rounded-sm',
            'text-white/90 bg-black/40 backdrop-blur-lg',
            'outline-medium shadow-sm',
            'uppercase text-[0.7rem]',
          )}>
            {photoQuantityText(photosCount, appText, false)}
            {isLoading &&
              <Spinner size={9} />}
          </div>
        </div>
      </div>
    </div>
  , [
    gridClass,
    photosToShow,
    photos,
    header,
    photosCount,
    appText,
    isLoading,
  ]);

  return <SharedHover {...{
    hoverKey,
    content,
    width,
    height,
    color,
  }} >
    {children}
  </SharedHover>;
}
