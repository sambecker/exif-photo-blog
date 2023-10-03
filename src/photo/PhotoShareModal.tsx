import PhotoOGTile from '@/photo/PhotoOGTile';
import { absolutePathForPhoto, pathForPhoto } from '@/site/paths';
import { Photo } from '.';
import ShareModal from '@/components/ShareModal';
import { Camera } from '@/camera';

export default function PhotoShareModal({
  photo,
  tag,
  camera,
}: {
  photo: Photo
  tag?: string
  camera?: Camera
}) {
  return (
    <ShareModal
      title="Share Photo"
      pathShare={absolutePathForPhoto(photo, tag, camera)}
      pathClose={pathForPhoto(photo, tag, camera)}
    >
      <PhotoOGTile photo={photo} />
    </ShareModal>
  );
};
