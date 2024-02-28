import { absolutePathForCamera, pathForCamera } from '@/site/paths';
import { Photo, PhotoDateRange } from '../photo';
import ShareModal from '@/components/ShareModal';
import CameraOGTile from './CameraOGTile';
import { Camera } from '.';

export default function CameraShareModal({
  camera,
  photos,
  count,
  dateRange,
}: {
  camera: Camera
  photos: Photo[]
  count: number
  dateRange?: PhotoDateRange,
}) {
  return (
    <ShareModal
      title="Share Photos"
      pathShare={absolutePathForCamera(camera)}
      pathClose={pathForCamera(camera)}
    >
      <CameraOGTile {...{ camera, photos, count, dateRange }} />
    </ShareModal>
  );
};
