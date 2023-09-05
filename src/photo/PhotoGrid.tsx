import { Photo } from '.';
import PhotoSmall from './PhotoSmall';
import { cc } from '@/utility/css';
import AnimateItems from '@/components/AnimateItems';
import Link from 'next/link';

const PHOTOS_PER_PAGE = 6;
const PHOTOS_MAX = 35;

export default function PhotoGrid({
  photos,
  selectedPhoto,
  offset = 0,
  fast,
  animateOnFirstLoadOnly,
  staggerOnFirstLoadOnly,
  showMore,
}: {
  photos: Photo[]
  selectedPhoto?: Photo
  offset?: number
  fast?: boolean
  animate?: boolean
  animateOnFirstLoadOnly?: boolean
  staggerOnFirstLoadOnly?: boolean
  showMore?: boolean
}) {
  return (
    <>
      <AnimateItems
        className={cc(
          'grid gap-1 sm:gap-2',
          'grid-cols-2 sm:grid-cols-4 md:grid-cols-3',
          'items-center',
        )}
        duration={fast ? 0.3 : undefined}
        staggerDelay={0.075}
        distanceOffset={40}
        animateOnFirstLoadOnly={animateOnFirstLoadOnly}
        staggerOnFirstLoadOnly={staggerOnFirstLoadOnly}
        items={photos.map(photo =>
          <PhotoSmall
            key={photo.id}
            photo={photo}
            selected={photo.id === selectedPhoto?.id}
          />)}
      />
      {showMore && (offset + PHOTOS_PER_PAGE) < PHOTOS_MAX &&
        <Link
          className="button mt-12"
          href={`/grid/${offset + PHOTOS_PER_PAGE}`}
        >
          More
        </Link>}
    </>
  );
};
