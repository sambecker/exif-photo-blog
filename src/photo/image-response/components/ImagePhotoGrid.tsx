/* eslint-disable jsx-a11y/alt-text */

import { Photo } from '@/photo';
import { getNextImageUrlForRequest } from '@/utility/image';

export default function ImagePhotoGrid({
  photos,
  request,
  width,
  height,
  gap = 3,
}: {
  photos: Photo[]
  request: Request
  width: number
  height: number
  gap?: number
}) {
  let count = 1;
  if (photos.length >= 12) { count = 12; }
  else if (photos.length >= 6) { count = 6; }
  else if (photos.length >= 4) { count = 4; }
  else if (photos.length >= 2) { count = 2; }

  const imageQuality = count <= 2 ? 1050 : 400;

  let rows = 1;
  if (count > 12) { rows = 4; }
  else if (count > 6) { rows = 3; }
  else if (count > 3) { rows = 2; }

  const imagesPerRow = count / rows;

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      gap,
    }}>
      {photos.slice(0, count).map(photo =>
        <div
          key={photo.id}
          style={{
            display: 'flex',
            width:
              width / imagesPerRow -
              (imagesPerRow - 1) * gap / (imagesPerRow),
            height: height / rows - (rows - 1) * gap / rows,
          }}
        >
          <img {...{
            src: getNextImageUrlForRequest(photo.url, request, imageQuality),
            style: {
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            },
          }} />
        </div>)}
    </div>
  );
}
