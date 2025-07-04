import { ComponentProps, ReactNode, useMemo } from 'react';
import SharedHover from '../shared-hover/SharedHover';
import { Photo, photoQuantityText } from '@/photo';
import { useSharedHoverState } from '../shared-hover/state';
import useSWR from 'swr';
import { getDimensionsFromSize } from '@/utility/size';
import PhotoMedium from '@/photo/PhotoMedium';
import Spinner from '../Spinner';
import clsx from 'clsx';
import { useAppText } from '@/i18n/state/client';

const { width, height } = getDimensionsFromSize(300, 16 / 9);

export default function EntityHover({
  hoverKey,
  icon,
  title,
  getPhotos,
  photosCount,
  children,
  color,
}: {
  hoverKey: string
  icon?: ReactNode
  title: string
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
  } = useSWR(isHovering ? hoverKey : null, getPhotos, {
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
        'bg-gray-100',
        'transition-opacity duration-300',
        photos?.length ?? 0 > 0 ? 'opacity-0' : 'opacity-100',
      )}>
        {Array.from({ length: photosToShow }).map((_, index) =>
          <div
            key={index}
            className={clsx(
              'bg-linear-to-br from-gray-200 to-gray-100',
            )}
          />)}
      </div>
      {/* Text guard */}
      <div className={clsx(
        'absolute inset-0',
        'bg-gradient-to-b from-black/50 to-transparent',
      )} />
      {/* Text */}
      <div className={clsx(
        'absolute inset-0',
        'px-3 py-2.5',
      )}>
        <div className="flex flex-col gap-1 h-full">
          <div className="grow">
            <span className={clsx(
              'flex items-center gap-1.5 grow',
              'text-base text-white',
            )}>
              {icon}
              <span className="uppercase">{title}</span>
            </span>
          </div>
          <div className={clsx(
            'self-start',
            'flex items-center gap-2',
            'px-1.5 py-0.5 rounded-md',
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
    icon,
    title,
    isLoading,
    photosCount,
    appText,
    photos,
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
