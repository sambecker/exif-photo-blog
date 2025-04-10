import { absolutePathForCamera } from '@/app/paths';
import { PhotoSetAttributes } from '../category';
import ShareModal from '@/share/ShareModal';
import CameraOGTile from './CameraOGTile';
import { Camera, formatCameraText } from '.';
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
      navigatorTitle={formatCameraText(camera)}
      socialText={shareTextForCamera(camera, photos)}
    >
      <CameraOGTile {...{ camera, photos, count, dateRange }} />
    </ShareModal>
  );
};
