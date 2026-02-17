/* eslint-disable jsx-a11y/alt-text */

import { Photo } from '@/photo';
import { NextImageSize } from '@/platforms/next-image';
import { IS_PREVIEW } from '@/app/config';
import {
  doAllPhotosHaveOptimizedFiles,
  getOptimizedPhotoUrl,
} from '@/photo/storage';
import { fetchBase64ImageFromUrl } from '@/utility/image';

export default async function ImagePhotoGrid({
  photos,
  width,
  widthArbitrary,
  height,
  imagePosition = 'center',
  gap = 0,
  imageStyle,
}: ({
  photos: Photo[]
  height: number
  imagePosition?: 'center' | 'top'
  gap?: number
  imageStyle?: React.CSSProperties
} & (
  { width: NextImageSize, widthArbitrary?: undefined } |
  { width?: undefined, widthArbitrary: number }
))) {
  let count = photos.length;
  if (photos.length >= 12) { count = 12; }
  else if (photos.length >= 6) { count = 6; }
  else if (photos.length >= 4) { count = 4; }

  const hasSplitLayout = count === 3;

  const nextImageWidth: NextImageSize = count <= 2
    ? width ?? 1080
    : 640;

  let rows = 1;
  if (count > 12) { rows = 4; }
  else if (count > 6) { rows = 3; }
  else if (count >= 3) { rows = 2; }

  const imagesPerRow = Math.round(count / rows);

  const cellWidth = (
    (width ?? widthArbitrary) / imagesPerRow -
    (imagesPerRow - 1) * gap / (imagesPerRow)
  );
  const cellHeight= height / rows -
    (rows - 1) * gap / rows;

  const doOptimizedFilesExist = await doAllPhotosHaveOptimizedFiles(photos);

  const photoData = await Promise.all(photos.map(async ({ id, url }) => {
    const data = await fetchBase64ImageFromUrl(
      getOptimizedPhotoUrl({
        imageUrl: url,
        size: nextImageWidth,
        addBypassSecret: IS_PREVIEW,
        compatibilityMode: !doOptimizedFilesExist,
      }),
      { mode: 'no-cors' },
    );
    return { id, data };
  }));

  const renderPhoto = (
    { id, data }: typeof photoData[number],
    width: number,
    height: number,
  ) =>
    <div
      key={id}
      style={{
        display: 'flex',
        width,
        height,
        overflow: 'hidden',
        filter: 'saturate(1.1)',
      }}
    >
      <img {...{
        src: data,
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
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap,
      }}
    >
      {hasSplitLayout
        ? <>
          {/* Large image (L) */}
          <div style={{
            display: 'flex',
            width: cellWidth,
            height: cellHeight * 2,
          }}>
            {renderPhoto(photoData[0], cellWidth, cellHeight * 2)}
          </div>
          {/* Small images (R) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: cellWidth,
            height: cellHeight,
          }}>
            {photoData.slice(1).map(photo =>
              renderPhoto(photo, cellWidth, cellHeight),
            )}
          </div>
        </>
        : photoData.slice(0, count).map(photo =>
          renderPhoto(photo, cellWidth, cellHeight),
        )}
    </div>
  );
}
