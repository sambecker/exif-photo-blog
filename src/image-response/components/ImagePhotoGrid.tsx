/* eslint-disable jsx-a11y/alt-text */

import { Photo } from '@/photo';
import { NextImageSize } from '@/platforms/next-image';
import { IS_PREVIEW } from '@/app/config';
import { getDataUrlsForPhotos } from '@/photo/storage';
import { PHOTOS_TO_SHOW_PER_CATEGORY } from '@/image-response';

const splitSize = (total: number, gap: number, parts: number) => {
  const available = total - gap * Math.max(0, parts - 1);
  const base = Math.floor(available / parts);
  const sizes = Array.from({ length: parts }, () => base);
  if (parts > 0) {
    sizes[parts - 1] += available - base * parts;
  }
  return sizes;
};

export default async function ImagePhotoGrid({
  photos,
  width,
  widthArbitrary,
  height,
  imagePosition = 'center',
  gap: gapProp = true,
  imageStyle,
  maxPhotos = PHOTOS_TO_SHOW_PER_CATEGORY,
}: ({
  photos: Photo[]
  height: number
  imagePosition?: 'center' | 'top'
  gap?: number | boolean
  imageStyle?: React.CSSProperties
  maxPhotos?: number
} & (
  { width: NextImageSize, widthArbitrary?: undefined } |
  { width?: undefined, widthArbitrary: number }
))) {
  const length = Math.min(photos.length, maxPhotos);
  let count = length;
  if (length >= 12) { count = 12; }
  else if (length >= 6) { count = 6; }
  else if (length >= 5) { count = 5; }
  else if (length >= 4) { count = 4; }

  const hasSplitLayout = count === 3;
  const hasFiveLayout = count === 5;

  const nextImageWidth: NextImageSize = count <= 2
    ? width ?? 1080
    : 640;

  const optimizedSuffix = count <= 2
    ? 'lg'
    : 'md';

  let rows = 1;
  if (count > 12) { rows = 4; }
  else if (count > 6) { rows = 3; }
  else if (count >= 3) { rows = 2; }

  const imagesPerRow = Math.round(count / rows);

  const totalWidth = width ?? widthArbitrary;
  // ~1px at hover width (300), so OG images keep a similar hairline
  const gap = gapProp === false
    ? 0
    : typeof gapProp === 'number'
      ? gapProp
      : Math.max(1, Math.round(totalWidth / 300));
  const columnWidths = splitSize(totalWidth, gap, imagesPerRow);
  const rowHeights = splitSize(height, gap, rows);
  const [fiveLeftWidth, fiveRightWidth] = splitSize(totalWidth, gap, 2);
  const [fiveCellWidth, fiveCellWidthLast] = splitSize(fiveRightWidth, gap, 2);
  const [fiveCellHeight, fiveCellHeightLast] = splitSize(height, gap, 2);
  const [splitLeftWidth, splitRightWidth] = columnWidths;
  const [splitTopHeight, splitBottomHeight] = rowHeights;

  const photoUrls = await getDataUrlsForPhotos(
    photos,
    optimizedSuffix,
    nextImageWidth,
    IS_PREVIEW,
  );

  const renderPhoto = (
    { id, urlData }: NonNullable<typeof photoUrls>[number],
    width: number,
    height: number,
    style?: React.CSSProperties,
  ) =>
    <div
      key={id}
      style={{
        display: 'flex',
        flexShrink: 0,
        width,
        height,
        overflow: 'hidden',
        filter: 'saturate(1.1)',
        ...style,
      }}
    >
      <img {...{
        src: urlData,
        style: {
          ...imageStyle,
          width: '100%',
          ...imagePosition === 'center' && {
            height: '100%',
          },
          objectFit: 'cover',
        },
      }} />
    </div>;

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: hasFiveLayout || hasSplitLayout ? 'nowrap' : 'wrap',
        width: totalWidth,
        height,
        backgroundColor: 'white',
        overflow: 'hidden',
      }}
    >
      {photoUrls && photoUrls.length > 0
        ? hasFiveLayout
          ? <>
            {renderPhoto(photoUrls[0], fiveLeftWidth, height, {
              marginRight: gap,
            })}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              flexShrink: 0,
              width: fiveRightWidth,
              height,
            }}>
              {photoUrls.slice(1, 5).map((photo, index) => {
                const col = index % 2;
                const row = Math.floor(index / 2);
                return renderPhoto(
                  photo,
                  col === 1 ? fiveCellWidthLast : fiveCellWidth,
                  row === 1 ? fiveCellHeightLast : fiveCellHeight,
                  {
                    marginRight: col === 0 ? gap : 0,
                    marginBottom: row === 0 ? gap : 0,
                  },
                );
              })}
            </div>
          </>
          : hasSplitLayout
            ? <>
              {renderPhoto(photoUrls[0], splitLeftWidth, height, {
                marginRight: gap,
              })}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
                width: splitRightWidth,
                height,
              }}>
                {photoUrls.slice(1, 3).map((photo, index) =>
                  renderPhoto(
                    photo,
                    splitRightWidth,
                    index === 0 ? splitTopHeight : splitBottomHeight,
                    { marginBottom: index === 0 ? gap : 0 },
                  ))}
              </div>
            </>
            : photoUrls.slice(0, count).map((photo, index) => {
              const col = index % imagesPerRow;
              const row = Math.floor(index / imagesPerRow);
              return renderPhoto(
                photo,
                columnWidths[col],
                rowHeights[row],
                {
                  marginRight: col < imagesPerRow - 1 ? gap : 0,
                  marginBottom: row < rows - 1 ? gap : 0,
                },
              );
            })
        : null}
    </div>
  );
}
