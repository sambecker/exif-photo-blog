import PhotoOGTile from '@/photo/PhotoOGTile';
import { absolutePathForPhoto } from '@/app/paths';
import { Photo, PhotoSetCategory } from '.';
import ShareModal from '@/share/ShareModal';

export default function PhotoShareModal(
  props: { photo: Photo } & PhotoSetCategory,
) {
  return (
    <ShareModal
      pathShare={absolutePathForPhoto(props)}
      socialText="Check out this photo"
    >
      <PhotoOGTile {...props} />
    </ShareModal>
  );
}
