import { absolutePathForCamera } from '@/app/paths';
import { PhotoSetAttributes } from '../category';
import ShareModal from '@/share/ShareModal';
import CameraOGTile from './CameraOGTile';
import { Camera, formatCameraText } from '.';
import { shareTextForCamera } from './meta';
import { getAppText } from '@/i18n/state/server';

export default async function CameraShareModal({
  camera,
  photos,
  count,
  dateRange,
}: {
  camera: Camera
} & PhotoSetAttributes) {
  const appText = await getAppText();
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
