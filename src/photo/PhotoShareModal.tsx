import PhotoOGTile from '@/photo/PhotoOGTile';
import { absolutePathForPhoto, pathForPhoto } from '@/site/paths';
import { Photo } from '.';
import ShareModal from '@/components/ShareModal';
import { Camera } from '@/camera';
import { FilmSimulation } from '@/simulation';

export default function PhotoShareModal(props: {
  photo: Photo
  tag?: string
  camera?: Camera
  simulation?: FilmSimulation
  focal?: number
}) {
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
