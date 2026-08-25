import { Photo, PhotoDateRangePostgres } from '@/photo';
import { Camera, createCameraKey } from '.';
import CameraHeader from './CameraHeader';
import PhotoGridHybridContainer from '@/photo/PhotoGridHybridContainer';

export default function CameraOverview({
  camera,
  photos,
  count,
  dateRange,
  animateOnFirstLoadOnly,
}: {
  camera: Camera,
  photos: Photo[],
  count: number,
  dateRange?: PhotoDateRangePostgres,
  animateOnFirstLoadOnly?: boolean,
}) {
  return (
    <PhotoGridHybridContainer {...{
      cacheKey: `camera-${createCameraKey(camera)}`,
      photos,
      count,
      camera,
      animateOnFirstLoadOnly,
      header: <CameraHeader {...{
        camera,
        photos,
        count,
        dateRange,
      }} />,
    }} />
  );
}
