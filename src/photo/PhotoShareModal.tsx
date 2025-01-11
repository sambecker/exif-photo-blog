import PhotoOGTile from '@/photo/PhotoOGTile';
import { absolutePathForPhoto, pathForPhoto } from '@/site/paths';
import { Photo, PhotoSetCategory } from '.';
import ShareModal from '@/components/ShareModal';

export default function PhotoShareModal(props: {
  photo: Photo
} & PhotoSetCategory) {
  return (
    <ShareModal
      pathShare={absolutePathForPhoto(props)}
      pathClose={pathForPhoto(props)}
      socialText="Check out this photo"
    >
      <PhotoOGTile photo={props.photo} />
    </ShareModal>
  );
};
