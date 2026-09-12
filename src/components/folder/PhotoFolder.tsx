import {
  Photo,
  altTextForPhoto,
  doesPhotoNeedBlurCompatibility,
} from '@/photo';
import ImageMedium from '@/components/image/ImageMedium';
import Badge from '@/components/Badge';
import clsx from 'clsx/lite';
import Link from 'next/link';
import { CSSProperties, ReactNode } from 'react';
import {
  convertOklchToCss,
  getProminentColorFromPhotos,
  Oklch,
} from '@/photo/color/client';
import { PHOTO_FOLDER_MAX_PHOTOS } from '.';

const FOLDER_WIDTH = 143;
const FOLDER_HEIGHT = 93;
const FOLDER_TAB_HEIGHT = 7.55;
const FOLDER_TAB_WIDTH = 47;
const FOLDER_STROKE_WIDTH = 0.794811;
const FOLDER_INSET = 4;
const FOLDER_RADIUS = 5;

const getFolderPath = () => {
  const inset = FOLDER_STROKE_WIDTH / 2;
  const radius = FOLDER_RADIUS + FOLDER_INSET;
  const left = inset;
  const top = inset;
  const right = FOLDER_WIDTH - inset;
  const bottom = FOLDER_HEIGHT - inset;
  const tabY = FOLDER_TAB_HEIGHT;
  const s45 = Math.SQRT1_2;
  const tabDrop = tabY - top;
  const chamfer = tabDrop + 2 * radius * (Math.SQRT2 - 1);
  const tabRight = FOLDER_TAB_WIDTH;
  const tabTopEnd = tabRight - chamfer;

  const arc = (
    r: number,
    sweep: 0 | 1,
    x: number,
    y: number,
  ) =>
    `A${r} ${r} 0 0 ${sweep} ${x} ${y}`;

  return [
    `M${left + radius} ${top}`,
    `H${tabTopEnd}`,
    arc(
      radius,
      1,
      tabTopEnd + radius * s45,
      top + radius * (1 - s45),
    ),
    `L${tabRight - radius * s45} ${tabY - radius * (1 - s45)}`,
    arc(radius, 0, tabRight, tabY),
    `H${right - radius}`,
    arc(radius, 1, right, tabY + radius),
    `V${bottom - radius}`,
    arc(radius, 1, right - radius, bottom),
    `H${left + radius}`,
    arc(radius, 1, left, bottom - radius),
    `V${top + radius}`,
    arc(radius, 1, left + radius, top),
    'Z',
  ].join('');
};

const FOLDER_PATH = getFolderPath();

const PHOTO_FOLDER_LAYOUT_MAX_PHOTOS = 6;

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

const getPhotoFolderLayout = (
  count: number,
  maxPhotos = PHOTO_FOLDER_MAX_PHOTOS,
) => {
  const length = Math.min(
    count,
    maxPhotos,
    PHOTO_FOLDER_LAYOUT_MAX_PHOTOS,
  );
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
  href,
  maxPhotos = PHOTO_FOLDER_MAX_PHOTOS,
}: {
  photos: Photo[]
  className?: string
  width?: number
  channel?: boolean
  tint?: boolean
  caption?: ReactNode
  href?: string
  maxPhotos?: number
}) {
  const {
    photosToShow,
    gridClass,
    hasSplitLayout,
  } = getPhotoFolderLayout(photos.length, maxPhotos);

  const photosInFolder = photos.slice(0, photosToShow);

  const tintColor = tint
    ? getProminentColorFromPhotos(photosInFolder)
    : undefined;
  const tintStyle = tintColor
    ? getFolderTint(tintColor)
    : undefined;

  const classNameFolder = clsx(
    'group hover:cursor-pointer',
    'flex flex-col items-center gap-2',
    'shrink-0',
    className,
  );

  const content = <>
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
          strokeWidth={FOLDER_STROKE_WIDTH}
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
            borderRadius: width * FOLDER_RADIUS / FOLDER_WIDTH + 1,
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
  </>;

  const folderStyle = { width };

  return href
    ? <Link
      href={href}
      className={classNameFolder}
      style={folderStyle}
    >
      {content}
    </Link>
    : <div
      className={classNameFolder}
      style={folderStyle}
    >
      {content}
    </div>;
}
