/* eslint-disable jsx-a11y/alt-text */

import { Photo } from '@/photo';
import {
  NextImageSize,
  getNextImageUrlForRequest,
} from '@/services/next-image';

export default function ImagePhotoGrid({
  photos,
  width,
  widthArbitrary,
  height,
  imagePosition = 'center',
  gap = 4,
}: ({
  photos: Photo[]
  height: number
  imagePosition?: 'center' | 'top'
  gap?: number
} & (
  { width: NextImageSize, widthArbitrary?: undefined } |
  { width?: undefined, widthArbitrary: number }
))) {
  let count = 1;
  if (photos.length >= 12) { count = 12; }
  else if (photos.length >= 6) { count = 6; }
  else if (photos.length >= 4) { count = 4; }
  else if (photos.length >= 2) { count = 2; }

  const nextImageWidth: NextImageSize = count <= 2
    ? width ?? 1080
    : 640;

  let rows = 1;
  if (count > 12) { rows = 4; }
  else if (count > 6) { rows = 3; }
  else if (count > 3) { rows = 2; }

  const imagesPerRow = count / rows;

  const cellWidth = (width ?? widthArbitrary) / imagesPerRow -
    (imagesPerRow - 1) * gap / (imagesPerRow);
  const cellHeight= height / rows -
    (rows - 1) * gap / rows;

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      gap,
    }}>
      {photos.slice(0, count).map(({ id, url }) =>
        <div
          key={id}
          style={{
            display: 'flex',
            width: cellWidth,
            height: cellHeight,
            overflow: 'hidden',
          }}
        >
          <img {...{
            src: getNextImageUrlForRequest(url, nextImageWidth),
            style: {
              width: '100%',
              ...imagePosition === 'center' && {
                height: '100%',
              },
              objectFit: 'cover',
            },
          }} />
        </div>
      )}
    </div>
  );
}
