import PhotoOGTile from '@/photo/PhotoOGTile';
import { absolutePathForPhoto } from '@/app/paths';
import { Photo, titleForPhoto } from '.';
import { PhotoSetCategory } from '../category';
import ShareModal from '@/share/ShareModal';

export default function PhotoShareModal(
  props: { photo: Photo } & PhotoSetCategory,
) {
  return (
    <ShareModal
      pathShare={absolutePathForPhoto(props, true)}
      navigatorTitle={titleForPhoto(props.photo)}
      socialText="Check out this photo"
    >
      <PhotoOGTile {...props} />
    </ShareModal>
  );
}
