import { Photo, PhotoDateRange } from '@/photo';
import { Camera } from '.';
import SiteGrid from '@/components/SiteGrid';
import AnimateItems from '@/components/AnimateItems';
import CameraHeader from './CameraHeader';
import PhotoGrid from '@/photo/PhotoGrid';

export default function CameraOverview({
  camera,
  photos,
  count,
  dateRange,
  showMorePath,
  animateOnFirstLoadOnly,
}: {
  camera: Camera,
  photos: Photo[],
  count: number,
  dateRange?: PhotoDateRange,
  showMorePath?: string,
  animateOnFirstLoadOnly?: boolean,
}) {
  return (
    <SiteGrid
      contentMain={<div className="space-y-8 mt-4">
        <AnimateItems
          type="bottom"
          items={[
            <CameraHeader
              key="CameraHeader"
              {...{ camera, photos, count, dateRange }}
            />,
          ]}
          animateOnFirstLoadOnly
        />
        <PhotoGrid
          {...{ photos, camera, showMorePath, animateOnFirstLoadOnly }}
        />
      </div>}
    />
  );
}
