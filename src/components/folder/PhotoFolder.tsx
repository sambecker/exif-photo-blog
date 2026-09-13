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
import { PHOTO_FOLDER_MAX_PHOTOS, PHOTO_FOLDER_PEEK_PHOTOS } from '.';
import {
  formatCount,
  formatCountDescriptive,
} from '@/utility/string';

const FOLDER_WIDTH = 143;
const FOLDER_HEIGHT = 93;
const FOLDER_TAB_HEIGHT = 7.55;
const FOLDER_TAB_WIDTH = 47;
const FOLDER_STROKE_WIDTH = 1;
const FOLDER_INSET = 4;
const FOLDER_RADIUS = 5;

const FOLDER_PATH_INSET = FOLDER_STROKE_WIDTH / 2;
const FOLDER_OUTER_RADIUS = FOLDER_RADIUS + FOLDER_INSET;

const FOLDER_COVER_TOP = FOLDER_TAB_HEIGHT / FOLDER_HEIGHT * 100;
const FOLDER_COVER_SIDE = FOLDER_PATH_INSET / FOLDER_WIDTH * 100;
const FOLDER_COVER_BOTTOM = FOLDER_PATH_INSET / FOLDER_HEIGHT * 100;

const FOLDER_COVER_WIDTH = FOLDER_WIDTH - FOLDER_STROKE_WIDTH;
const FOLDER_COVER_HEIGHT = FOLDER_HEIGHT
  - FOLDER_TAB_HEIGHT
  - FOLDER_PATH_INSET;

const FOLDER_PHOTO_TOP = FOLDER_INSET / FOLDER_COVER_HEIGHT * 100;
const FOLDER_PHOTO_SIDE =
  (FOLDER_INSET - FOLDER_PATH_INSET) / FOLDER_COVER_WIDTH * 100;
const FOLDER_PHOTO_BOTTOM =
  (FOLDER_INSET - FOLDER_PATH_INSET) / FOLDER_COVER_HEIGHT * 100;

const PEEK_SIZE = 0.36;

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

const PEEK_DIRECTIONS = [
  { x: -28, y: -40, r: -14 },
  { x: -16, y: -48, r: -4 },
  { x: 0, y: -52, r: 0 },
  { x: 16, y: -48, r: 6 },
  { x: 28, y: -40, r: 14 },
] as const;

type PeekSlot = (typeof PEEK_DIRECTIONS)[number];

const getCenteredPeekSlots = (count: number) => {
  const length = PEEK_DIRECTIONS.length;
  const n = Math.min(count, length);
  if (n <= 0) { return [] as PeekSlot[]; }
  if (n % 2 === 1) {
    const start = Math.floor((length - n) / 2);
    return PEEK_DIRECTIONS.slice(start, start + n);
  }
  const center = Math.floor(length / 2);
  const withoutCenter = [
    ...PEEK_DIRECTIONS.slice(0, center),
    ...PEEK_DIRECTIONS.slice(center + 1),
  ];
  const start = Math.floor((withoutCenter.length - n) / 2);
  return withoutCenter.slice(start, start + n);
};

const hashToUnit = (value: string, salt: number) => {
  let hash = salt;
  for (let i = 0; i < value.length; i++) {
    hash = (Math.imul(31, hash) + value.charCodeAt(i)) | 0;
  }
  return (hash >>> 0) / 0xFFFFFFFF;
};

const getPeekStyle = (
  photo: Photo,
  index: number,
  folderWidth: number,
  slot: PeekSlot,
): CSSProperties => {
  const folderHeight = folderWidth * FOLDER_HEIGHT / FOLDER_WIDTH;
  const x = slot.x + (hashToUnit(photo.id, 1) - 0.5) * 8;
  const y = slot.y + (hashToUnit(photo.id, 2) - 0.5) * 10;
  const rotate = slot.r + (hashToUnit(photo.id, 3) - 0.5) * 14;
  return {
    '--peek-x': `${x / 100 * folderWidth}px`,
    '--peek-y': `${y / 100 * folderHeight}px`,
    '--peek-rotate': `${rotate}deg`,
    transitionDelay: `${index * 35}ms`,
  } as CSSProperties;
};

const getFolderTint = (color: Oklch) => {
  const c = Math.min(color.c * 0.55, FOLDER_TINT_CHROMA_MAX);
  return {
    '--folder-fill-light': convertOklchToCss(
      { l: 0.94, c, h: color.h }),
    '--folder-stroke-light': convertOklchToCss(
      { l: 0.87, c: c * 0.7, h: color.h }),
    '--folder-fill-dark': convertOklchToCss(
      { l: 0.27, c, h: color.h }),
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

function FolderPhotoImage({
  photo,
  className,
  classNameImage,
}: {
  photo: Photo
  className?: string
  classNameImage?: string
}) {
  return (
    <ImageMedium
      src={photo.url}
      aspectRatio={photo.aspectRatio}
      blurDataURL={photo.blurData}
      blurCompatibilityMode={doesPhotoNeedBlurCompatibility(photo)}
      className={className}
      classNameImage={classNameImage}
      alt={altTextForPhoto(photo)}
    />
  );
}

export default function PhotoFolder({
  photos,
  className,
  width = FOLDER_WIDTH,
  channel = true,
  tint,
  caption,
  count,
  href,
  maxPhotos = PHOTO_FOLDER_MAX_PHOTOS,
}: {
  photos: Photo[]
  className?: string
  width?: number
  channel?: boolean
  tint?: boolean
  caption?: ReactNode
  count?: number
  href?: string
  maxPhotos?: number
}) {
  const {
    photosToShow,
    gridClass,
    hasSplitLayout,
  } = getPhotoFolderLayout(photos.length, maxPhotos);

  const photosInFolder = photos.slice(0, photosToShow);
  const unusedPhotos = photos.slice(photosToShow);
  const photosPeeking = unusedPhotos.length > 0
    ? unusedPhotos.slice(0, PHOTO_FOLDER_PEEK_PHOTOS)
    : photosInFolder.slice(0, PHOTO_FOLDER_PEEK_PHOTOS);
  const peekSlots = getCenteredPeekSlots(photosPeeking.length);

  const tintColor = tint
    ? getProminentColorFromPhotos(photosInFolder)
    : undefined;
  const tintStyle = tintColor
    ? getFolderTint(tintColor)
    : undefined;

  const classNameFolder = clsx(
    'group hover:cursor-pointer',
    'flex flex-col items-center gap-2',
    'shrink-0 relative hover:z-10',
    className,
  );

  const coverOuterRadius = width * FOLDER_OUTER_RADIUS / FOLDER_WIDTH;
  const coverInnerRadius = width * FOLDER_RADIUS / FOLDER_WIDTH + 1;
  const folderStroke = width * FOLDER_STROKE_WIDTH / FOLDER_WIDTH;
  const peekChannel = 2;
  const peekInnerRadius = width * PEEK_SIZE * FOLDER_RADIUS / FOLDER_WIDTH;
  const peekOuterRadius = peekInnerRadius + peekChannel;

  const content = <>
    <div
      className={clsx(
        'relative w-full',
        'perspective-midrange transform-3d',
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
        className={clsx(
          'absolute inset-0 size-full translate-z-0',
          'drop-shadow-[0px_2px_1px_rgba(0,0,0,0.1)]',
        )}
        viewBox={`0 0 ${FOLDER_WIDTH} ${FOLDER_HEIGHT}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d={FOLDER_PATH}
          className={clsx(
            !tintStyle && 'fill-gray-100 dark:fill-gray-800',
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
      {photosPeeking.map((photo, index) =>
        <div
          key={photo.id}
          className={clsx(
            'absolute left-1/2 top-[54%] z-[1]',
            'aspect-square pointer-events-none',
            'folder-peek-rest',
            'shadow-[0_1px_3px_rgba(0,0,0,0.18)]',
            'transition-transform duration-200 ease-out',
            'motion-reduce:transition-none',
            'group-hover:folder-peek-open',
            'motion-reduce:group-hover:folder-peek-rest',
            !tintStyle && 'bg-gray-100 dark:bg-gray-800',
          )}
          style={{
            width: `${PEEK_SIZE * 100}%`,
            borderRadius: peekOuterRadius,
            padding: peekChannel,
            ...(tintStyle
              ? { backgroundColor: 'var(--folder-fill)' }
              : undefined),
            ...getPeekStyle(
              photo,
              index,
              width,
              peekSlots[index] ?? PEEK_DIRECTIONS[2],
            ),
          }}
        >
          <div
            className="relative size-full overflow-hidden"
            style={{ borderRadius: peekInnerRadius }}
          >
            <FolderPhotoImage
              photo={photo}
              className="absolute inset-0 w-full h-full"
              classNameImage="object-cover w-full h-full"
            />
          </div>
        </div>)}
      <div
        className={clsx(
          'absolute z-[2]',
          'origin-bottom translate-z-[8px]',
          'transition-transform duration-300 ease-out',
          'group-hover:-rotate-x-[34deg]',
          'motion-reduce:transition-none',
          'motion-reduce:group-hover:rotate-x-0',
          'after:pointer-events-none after:absolute after:inset-0',
          'after:rounded-[inherit] after:content-[\'\']',
          'after:bg-linear-to-b after:from-black/50 after:to-black/10',
          'after:opacity-0 after:transition-opacity',
          'after:duration-300 after:ease-out',
          'group-hover:after:opacity-100',
          'motion-reduce:group-hover:after:opacity-0',
          !tintStyle && 'bg-gray-100 dark:bg-gray-800',
          !tintStyle && 'outline-gray-300 dark:outline-gray-700',
        )}
        style={{
          top: `${FOLDER_COVER_TOP}%`,
          left: `${FOLDER_COVER_SIDE}%`,
          right: `${FOLDER_COVER_SIDE}%`,
          bottom: `${FOLDER_COVER_BOTTOM}%`,
          borderRadius: coverOuterRadius,
          outlineWidth: folderStroke,
          outlineStyle: 'solid',
          outlineOffset: -folderStroke / 2,
          ...(tintStyle
            ? {
              backgroundColor: 'var(--folder-fill)',
              outlineColor: 'var(--folder-stroke)',
            }
            : undefined),
        }}
      >
        {photosInFolder.length > 0 &&
          <div
            className={clsx(
              'absolute overflow-hidden',
              'grid',
              gridClass,
              channel && 'gap-[1.5px]',
            )}
            style={{
              top: `${FOLDER_PHOTO_TOP}%`,
              left: `${FOLDER_PHOTO_SIDE}%`,
              right: `${FOLDER_PHOTO_SIDE}%`,
              bottom: `${FOLDER_PHOTO_BOTTOM}%`,
              borderRadius: coverInnerRadius,
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
                <FolderPhotoImage
                  photo={photo}
                  className="absolute inset-0 w-full h-full"
                  classNameImage="object-cover w-full h-full"
                />
              </div>)}
          </div>}
      </div>
    </div>
    {caption &&
      <div className={clsx(
        'flex items-center justify-center',
        'w-full h-[17px] md:h-[18px]',
      )}>
        <Badge
          type="small"
          uppercase
          className={clsx(
            'min-w-0',
            count !== undefined &&
              'group-hover:max-w-[calc(100%-2.75rem)]',
          )}
        >
          {caption}
        </Badge>
        {count !== undefined &&
          <span
            className={clsx(
              'max-w-0 overflow-hidden opacity-0',
              'group-hover:max-w-16 group-hover:opacity-100',
              'transition-[max-width,opacity] duration-300 ease-out',
              'motion-reduce:transition-none',
              'pointer-events-none shrink-0',
            )}
            aria-label={formatCountDescriptive(count)}
          >
            <span
              className="pl-1 text-dim text-[0.7rem] whitespace-nowrap"
              aria-hidden
            >
              {formatCount(count)}
            </span>
          </span>}
      </div>}
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
