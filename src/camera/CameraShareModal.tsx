import { absolutePathForCamera, pathForCamera } from '@/site/paths';
import { Photo } from '../photo';
import ShareModal from '@/components/ShareModal';
import CameraOGTile from './CameraOGTile';
import { Camera } from '.';

export default function CameraShareModal({
  camera,
  photos,
}: {
  camera: Camera
  photos: Photo[]
}) {
  return (
    <ShareModal
      title="Share Photos"
      pathShare={absolutePathForCamera(camera)}
      pathClose={pathForCamera(camera)}
    >
      <CameraOGTile {...{ camera, photos }} />
    </ShareModal>
  );
};
