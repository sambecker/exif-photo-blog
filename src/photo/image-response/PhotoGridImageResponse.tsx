import { getNextImageUrlForRequest } from '@/utility/image';
import { Photo } from '..';

const IMAGE_WIDTH = 400;

export default function PhotoGridImageResponse({
  photos,
  request,
  width,
  colCount,
  rowCount,
  gap = 12,
}: {
  photos: Photo[]
  request: Request
  width: number
  colCount: number
  rowCount: number
  gap?: number
}) {
  const imageWidth = (width - ((colCount - 1) * gap)) / colCount ;

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
    }}>
      {photos
        .slice(0, colCount * rowCount)
        .map((photo, index) =>
          <img
            key={photo.id}
            src={getNextImageUrlForRequest(
              photo.url,
              request,
              IMAGE_WIDTH,
            )}
            alt={photo.title}
            width={IMAGE_WIDTH}
            height={IMAGE_WIDTH / photo.aspectRatio}
            style={{
              width: imageWidth,
              height: imageWidth / photo.aspectRatio,
              ...(index + 1) % colCount !== 0 && {
                marginRight: gap,
              },
              ...index < colCount * (rowCount - 1) && {
                marginBottom: gap,
              },
            }}
          />)}
    </div>
  );
}
