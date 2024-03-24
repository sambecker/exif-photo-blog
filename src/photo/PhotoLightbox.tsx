import { clsx } from 'clsx/lite';
import { Photo } from '.';
import PhotoGrid from './PhotoGrid';
import Link from 'next/link';

export default function PhotoLightbox({
  count,
  photos,
  maxPhotosToShow = 6,
  moreLink,
}: {
  count: number
  photos: Photo[]
  maxPhotosToShow?: number
  moreLink: string
}) {
  const photoCountToShow = maxPhotosToShow < count
    ? maxPhotosToShow - 1
    : maxPhotosToShow;

  const countNotShown = count - photoCountToShow;

  const showOverageTile = countNotShown > 0;

  return (
    <div className={clsx(
      'border dark:border-gray-800 p-1.5 lg:p-2 rounded-md',
      'bg-gray-50 dark:bg-gray-950',
    )}>
      <PhotoGrid
        photos={photos.slice(0, photoCountToShow)}
        animate={false}
        additionalTile={showOverageTile
          ? <Link
            href={moreLink}
            className={clsx(
              'flex flex-col items-center justify-center',
              'gap-0.5 lg:gap-1',
            )}
          >
            <div className="text-[1.1rem] lg:text-[1.5rem]">
              +{countNotShown}
            </div>
            <div className="text-dim">More</div>
          </Link>
          : undefined}
        small
      />
    </div>
  );
}
