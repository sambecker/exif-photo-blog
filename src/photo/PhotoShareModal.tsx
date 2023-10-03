import PhotoOGTile from '@/photo/PhotoOGTile';
import { absolutePathForPhoto, pathForPhoto } from '@/site/paths';
import { Photo } from '.';
import ShareModal from '@/components/ShareModal';
import { Device } from '@/device';

export default function PhotoShareModal({
  photo,
  tag,
  device,
}: {
  photo: Photo
  tag?: string
  device?: Device
}) {
  return (
    <ShareModal
      title="Share Photo"
      pathShare={absolutePathForPhoto(photo, tag, device)}
      pathClose={pathForPhoto(photo, tag, device)}
    >
      <PhotoOGTile photo={photo} />
    </ShareModal>
  );
};
