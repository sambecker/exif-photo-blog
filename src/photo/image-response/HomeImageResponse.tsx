import { Photo } from '..';
import PhotoGridImageResponse from './PhotoGridImageResponse';

export default function HomeImageResponse({
  photos,
  request,
  width,
  height,
}: {
  photos: Photo[]
  request: Request
  width: number
  height: number
}) {
  const grid = photos.length >= 12
    ? { colCount: 4, rowCount: 3 }
    : { colCount: 3, rowCount: 2 };

  const photosPerGrid = grid.colCount * grid.rowCount;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      background: 'transparent',
      width,
      height,
    }}>
      <PhotoGridImageResponse {...{
        photos: photos.slice(0, photosPerGrid),
        request,
        nextImageWidth: 200,
        ...grid,
        gap: 6,
        width,
        height,
      }} />
    </div>
  );
}
