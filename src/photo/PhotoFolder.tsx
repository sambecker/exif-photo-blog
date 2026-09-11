import {
  Photo,
  altTextForPhoto,
  doesPhotoNeedBlurCompatibility,
} from '.';
import ImageMedium from '@/components/image/ImageMedium';
import Badge from '@/components/Badge';
import clsx from 'clsx/lite';
import { CSSProperties, ReactNode } from 'react';
import {
  convertOklchToCss,
  getProminentColorFromPhotos,
  Oklch,
} from './color/client';

const FOLDER_WIDTH = 143;
const FOLDER_HEIGHT = 93;
const FOLDER_TAB_HEIGHT = 7.55;
const FOLDER_INSET = 4;

/* eslint-disable-next-line max-len */
const FOLDER_PATH = 'M10 0.397461H31.2734C33.9059 0.397461 36.4234 1.47807 38.2363 3.38672L39.1162 4.31348C41.0792 6.38029 43.8049 7.55071 46.6553 7.55078H132.271C137.575 7.55091 141.874 11.85 141.874 17.1533V82.9932C141.874 88.2963 137.575 92.5956 132.271 92.5957H10C4.69672 92.5957 0.397587 88.2964 0.397461 82.9932V10C0.397461 4.69663 4.69663 0.397461 10 0.397461Z';

const FOLDER_TINT_CHROMA_MAX = 0.07;

const getFolderTint = (color: Oklch) => {
  const c = Math.min(color.c * 0.55, FOLDER_TINT_CHROMA_MAX);
  return {
    '--folder-fill-light': convertOklchToCss(
      { l: 0.94, c, h: color.h }, 0.66),
    '--folder-stroke-light': convertOklchToCss(
      { l: 0.87, c: c * 0.7, h: color.h }),
    '--folder-fill-dark': convertOklchToCss(
      { l: 0.27, c, h: color.h }, 0.66),
    '--folder-stroke-dark': convertOklchToCss(
      { l: 0.36, c: c * 0.75, h: color.h }),
  } as CSSProperties;
};

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
  tint,
  caption,
}: {
  photos: Photo[]
  className?: string
  width?: number
  channel?: boolean
  tint?: boolean
  caption?: ReactNode
}) {
  const {
    photosToShow,
    gridClass,
    hasSplitLayout,
  } = getPhotoFolderLayout(photos.length);

  const photosInFolder = photos.slice(0, photosToShow);

  const tintColor = tint
    ? getProminentColorFromPhotos(photosInFolder)
    : undefined;
  const tintStyle = tintColor
    ? getFolderTint(tintColor)
    : undefined;

  return (
    <div
      className={clsx(
        'group hover:cursor-pointer',
        'flex flex-col items-center gap-2',
        'shrink-0',
        className,
      )}
      style={{ width }}
    >
      <div
        className={clsx(
          'relative w-full',
          'origin-bottom',
          'transition-transform duration-200',
          'group-hover:scale-[1.05]',
          'drop-shadow-[0px_2px_1px_rgba(0,0,0,0.1)]',
          tintStyle && clsx(
            '[--folder-fill:var(--folder-fill-light)]',
            '[--folder-stroke:var(--folder-stroke-light)]',
            'dark:[--folder-fill:var(--folder-fill-dark)]',
            'dark:[--folder-stroke:var(--folder-stroke-dark)]',
          ),
        )}
        style={{
          aspectRatio: `${FOLDER_WIDTH} / ${FOLDER_HEIGHT}`,
          ...tintStyle,
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
              !tintStyle && 'fill-gray-100/66 dark:fill-gray-800/66',
              !tintStyle && 'stroke-gray-300 dark:stroke-gray-700',
            )}
            style={tintStyle
              ? {
                fill: 'var(--folder-fill)',
                stroke: 'var(--folder-stroke)',
              }
              : undefined}
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
              borderRadius: width * 5 / FOLDER_WIDTH + 1,
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
        <Badge
          type="small"
          uppercase
          className={clsx(
            'transition-transform duration-200',
            'group-hover:translate-y-0.5',
          )}
        >
          {caption}
        </Badge>}
    </div>
  );
}
