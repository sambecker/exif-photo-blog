import PhotoOGTile from '@/photo/PhotoOGTile';
import { absolutePathForPhoto, pathForPhoto } from '@/site/paths';
import { Photo } from '.';
import ShareModal from '@/components/ShareModal';
import { Camera } from '@/camera';
import { FilmSimulation } from '@/simulation';

export default function PhotoShareModal({
  photo,
  tag,
  camera,
  simulation,
}: {
  photo: Photo
  tag?: string
  camera?: Camera
  simulation?: FilmSimulation
}) {
  return (
    <ShareModal
      title="Share Photo"
      pathShare={absolutePathForPhoto(photo, tag, camera, simulation)}
      pathClose={pathForPhoto(photo, tag, camera, simulation)}
    >
      <PhotoOGTile photo={photo} />
    </ShareModal>
  );
};
