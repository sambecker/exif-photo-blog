import CameraOGTile from '@/camera/CameraOGTile';
import FocalLengthOGTile from '@/focal/FocalLengthOGTile';
import PhotoOGTile from '@/photo/PhotoOGTile';
import { getPhotosCached } from '@/photo/cache';
import FilmOGTile from '@/film/FilmOGTile';
import { TAG_FAVS } from '@/tag';
import TagOGTile from '@/tag/TagOGTile';

const tag = 'cicadas';
const camera = { make: 'Fujifilm', model: 'X-T5' };
const cameraIcon = { make: 'Apple', model: 'iPhone 13 Pro' };
const film = 'acros';
const focal = 90;

export default async function OGOverviewPage() {
  const [
    photoBasic,
    photoIcon,
    photosTag,
    photosFavs,
    photosCamera,
    photosFilm,
    photosFocal,
  ] = await Promise.all([
    getPhotosCached({ limit: 1 }).then(photos => photos[0])
      .catch(() => undefined),
    getPhotosCached({ limit: 1, camera: cameraIcon }).then(photos => photos[0])
      .catch(() => undefined),
    getPhotosCached({ limit: 1, tag })
      .catch(() => []),
    getPhotosCached({ limit: 1, tag: TAG_FAVS })
      .catch(() => []),
    getPhotosCached({ limit: 1, camera })
      .catch(() => []),
    getPhotosCached({ limit: 1, film })
      .catch(() => []),
    getPhotosCached({ limit: 1, focal })
      .catch(() => []),
  ]);

  return (
    <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {photoBasic && <PhotoOGTile photo={photoBasic} />}
      {photoIcon && <PhotoOGTile photo={photoIcon} />}
      <TagOGTile tag={tag} photos={photosTag} />
      <TagOGTile tag={TAG_FAVS} photos={photosFavs} />
      <CameraOGTile camera={camera} photos={photosCamera} />
      <FilmOGTile film={film} photos={photosFilm} />
      <FocalLengthOGTile focal={focal} photos={photosFocal} />
    </div>
  );
}
