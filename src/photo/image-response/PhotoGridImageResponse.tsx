import { getNextImageUrlForRequest } from '@/utility/image';
import { Photo, titleForPhoto } from '..';

const IMAGE_WIDTH = 400;

export default function PhotoGridImageResponse({
  photos,
  request,
  height,
  width,
  colCount,
  rowCount,
  gap = 12,
  verticalOffset,
}: {
  photos: Photo[]
  request: Request
  height?: number
  width: number
  colCount: number
  rowCount: number
  gap?: number
  verticalOffset?: number
}) {
  const imageWidth = (width - ((colCount - 1) * gap)) / colCount;
  const imageHeight = height
    ? (height - ((rowCount - 1) * gap)) / rowCount
    : undefined;

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      ...verticalOffset && { transform: `translateY(${verticalOffset}px)` },
    }}>
      {photos
        .slice(0, colCount * rowCount)
        .map((photo, index) => {
          const photoWidth = imageHeight
            ? imageHeight * photo.aspectRatio
            : imageWidth;
          const photoHeight = imageHeight ?? imageWidth / photo.aspectRatio;
          const horizontalOffset = imageHeight
            ? Math.abs((imageHeight * photo.aspectRatio - imageWidth) / 2)
            : undefined;

          return (
            <div
              key={photo.id}
              style={{
                display: 'flex',
                position: 'relative',
                width: imageWidth,
                height: imageHeight ?? imageWidth / photo.aspectRatio,
                ...(index + 1) % colCount !== 0 && {
                  marginRight: gap,
                },
                ...index < colCount * (rowCount - 1) && {
                  marginBottom: gap,
                },
                overflow: 'hidden',
              }}
            >
              <img
                src={getNextImageUrlForRequest(
                  photo.url,
                  request,
                  IMAGE_WIDTH,
                )}
                alt={titleForPhoto(photo)}
                width={IMAGE_WIDTH}
                height={IMAGE_WIDTH / photo.aspectRatio}
                style={{
                  display: 'flex',
                  width: photoWidth,
                  height: photoHeight,
                  ...horizontalOffset && {
                    marginLeft: `-${horizontalOffset}px`,
                  },
                }}
              />
            </div>
          );
        })}
    </div>
  );
}
