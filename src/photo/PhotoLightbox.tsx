import { clsx } from 'clsx/lite';
import { Photo } from '.';
import { PhotoSetCategory } from '../category';
import PhotoGrid from './PhotoGrid';
import Link from 'next/link';

export default function PhotoLightbox({
  count,
  photos,
  maxPhotosToShow = 6,
  moreLink,
  ...categories
}: {
  count: number
  photos: Photo[]
  maxPhotosToShow?: number
  moreLink: string
} & PhotoSetCategory) {  
  const photoCountToShow = maxPhotosToShow < count
    ? maxPhotosToShow - 1
    : maxPhotosToShow;

  const countNotShown = count - photoCountToShow;

  const showOverageTile = countNotShown > 0;

  return (
    <div className={clsx(
      'border-main p-1 rounded-md',
      'bg-gray-50 dark:bg-gray-950',
    )}>
      <PhotoGrid
        {...categories}
        photos={photos.slice(0, photoCountToShow)}
        animate={false}
        additionalTile={showOverageTile
          ? <Link
            href={moreLink}
            className={clsx(
              'flex flex-col items-center justify-center',
              'gap-0.5',
              'text-[1.1rem] lg:text-[1.25rem]',
              // Optically adjust for leading '+' character
              'translate-x-[-1px]',
            )}
          >
            +{countNotShown}
          </Link>
          : undefined}
        classNamePhoto="rounded-sm overflow-hidden border-main"
        selectable={false}
        small
      />
    </div>
  );
}
