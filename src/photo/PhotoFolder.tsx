import {
  Photo,
  altTextForPhoto,
  doesPhotoNeedBlurCompatibility,
} from '.';
import ImageMedium from '@/components/image/ImageMedium';
import Badge from '@/components/Badge';
import clsx from 'clsx/lite';
import { ReactNode } from 'react';

const FOLDER_WIDTH = 143;
const FOLDER_HEIGHT = 93;
const FOLDER_TAB_HEIGHT = 7.55;
const FOLDER_INSET = 5.5;

/* eslint-disable-next-line max-len */
const FOLDER_PATH = 'M10 0.397461H31.2734C33.9059 0.397461 36.4234 1.47807 38.2363 3.38672L39.1162 4.31348C41.0792 6.38029 43.8049 7.55071 46.6553 7.55078H132.271C137.575 7.55091 141.874 11.85 141.874 17.1533V82.9932C141.874 88.2963 137.575 92.5956 132.271 92.5957H10C4.69672 92.5957 0.397587 88.2964 0.397461 82.9932V10C0.397461 4.69663 4.69663 0.397461 10 0.397461Z';

const getPhotoFolderLayout = (count: number) => {
  const length = Math.min(count, 6);
  const photosToShow = length >= 6
    ? 6
    : length >= 4
      ? 4
      : length;
  const gridClass = photosToShow >= 6
    ? 'grid-cols-3 grid-rows-2'
    : photosToShow >= 3
      ? 'grid-cols-2 grid-rows-2'
      : photosToShow >= 2
        ? 'grid-cols-2'
        : 'grid-cols-1';
  return {
    photosToShow,
    gridClass,
    hasSplitLayout: photosToShow === 3,
  };
};

export default function PhotoFolder({
  photos,
  className,
  width = FOLDER_WIDTH,
  channel = true,
  caption,
}: {
  photos: Photo[]
  className?: string
  width?: number
  channel?: boolean
  caption?: ReactNode
}) {
  const {
    photosToShow,
    gridClass,
    hasSplitLayout,
  } = getPhotoFolderLayout(photos.length);

  const photosInFolder = photos.slice(0, photosToShow);

  return (
    <div
      className={clsx(
        'flex flex-col items-center gap-1.5',
        'shrink-0',
        className,
      )}
      style={{ width }}
    >
      <div
        className="relative w-full"
        style={{
          aspectRatio: `${FOLDER_WIDTH} / ${FOLDER_HEIGHT}`,
        }}
      >
        <svg
          className="absolute inset-0 size-full"
          viewBox={`0 0 ${FOLDER_WIDTH} ${FOLDER_HEIGHT}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d={FOLDER_PATH}
            className={clsx(
              'fill-gray-100/66 dark:fill-gray-800/66',
              'stroke-gray-200 dark:stroke-gray-700',
            )}
            strokeWidth="0.794811"
          />
        </svg>
        {photosInFolder.length > 0 &&
          <div
            className={clsx(
              'absolute overflow-hidden',
              'grid',
              gridClass,
              channel && 'gap-[2px]',
            )}
            style={{
              top: `${(FOLDER_TAB_HEIGHT + FOLDER_INSET) /
                FOLDER_HEIGHT * 100}%`,
              left: `${FOLDER_INSET / FOLDER_WIDTH * 100}%`,
              right: `${FOLDER_INSET / FOLDER_WIDTH * 100}%`,
              bottom: `${FOLDER_INSET / FOLDER_HEIGHT * 100}%`,
              borderRadius: width * 5 / FOLDER_WIDTH,
            }}
          >
            {photosInFolder.map((photo, index) =>
              <div
                key={photo.id}
                className={clsx(
                  'relative min-h-0 overflow-hidden',
                  hasSplitLayout && index === 0 && 'row-span-2',
                )}
              >
                <ImageMedium
                  src={photo.url}
                  aspectRatio={photo.aspectRatio}
                  blurDataURL={photo.blurData}
                  blurCompatibilityMode={
                    doesPhotoNeedBlurCompatibility(photo)
                  }
                  className="absolute inset-0 w-full h-full"
                  classNameImage="object-cover w-full h-full"
                  alt={altTextForPhoto(photo)}
                />
              </div>)}
          </div>}
      </div>
      {caption &&
        <Badge type="small" uppercase>
          {caption}
        </Badge>}
    </div>
  );
}
