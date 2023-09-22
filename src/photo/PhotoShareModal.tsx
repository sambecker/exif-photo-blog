import PhotoOGTile from '@/photo/PhotoOGTile';
import { absolutePathForPhoto, pathForPhoto } from '@/site/paths';
import { Photo } from '.';
import ShareModal from '@/components/ShareModal';

export default function PhotoShareModal({
  photo,
  tag,
}: {
  photo: Photo
  tag?: string
}) {
  return (
    <ShareModal
      title="Share Photo"
      pathShare={absolutePathForPhoto(photo, tag)}
      pathClose={pathForPhoto(photo, tag)}
    >
      <PhotoOGTile photo={photo} />
    </ShareModal>
  );
};
