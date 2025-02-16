import { absolutePathForCamera } from '@/app-core/paths';
import { PhotoSetAttributes } from '../photo';
import ShareModal from '@/share/ShareModal';
import CameraOGTile from './CameraOGTile';
import { Camera } from '.';
import { shareTextForCamera } from './meta';

export default function CameraShareModal({
  camera,
  photos,
  count,
  dateRange,
}: {
  camera: Camera
} & PhotoSetAttributes) {
  return (
    <ShareModal
      pathShare={absolutePathForCamera(camera)}
      socialText={shareTextForCamera(camera, photos)}
    >
      <CameraOGTile {...{ camera, photos, count, dateRange }} />
    </ShareModal>
  );
};
