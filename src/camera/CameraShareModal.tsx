import { absolutePathForCamera } from '@/app/paths';
import { PhotoSetAttributes } from '../category';
import ShareModal from '@/share/ShareModal';
import CameraOGTile from './CameraOGTile';
import { Camera, formatCameraText } from '.';
import { shareTextForCamera } from './meta';
import { useAppText } from '@/i18n/state/client';

export default function CameraShareModal({
  camera,
  photos,
  count,
  dateRange,
}: {
  camera: Camera
} & PhotoSetAttributes) {
  const appText = useAppText();
  return (
    <ShareModal
      pathShare={absolutePathForCamera(camera, true)}
      navigatorTitle={formatCameraText(camera)}
      socialText={shareTextForCamera(camera, photos, appText)}
    >
      <CameraOGTile {...{ camera, photos, count, dateRange }} />
    </ShareModal>
  );
};
