import AdminComponentPageClient from '@/admin/AdminComponentPageClient';
import { formatCameraText } from '@/camera';
import { sortCategoriesByCount } from '@/category';
import { getAlbumsWithMetaCached } from '@/album/cache';
import { MAX_PHOTOS_TO_SHOW_PER_CATEGORY } from '@/image-response';
import { INFINITE_SCROLL_GRID_INITIAL, Photo } from '@/photo';
import {
  getPhotosCached,
  getPhotosMetaCached,
  getUniqueCamerasCached,
  getUniqueTagsCached,
  getUniqueYearsCached,
} from '@/photo/cache';
import { formatTag, sortTagsByCount, TAG_FAVS } from '@/tag';

type PhotoFolderPreview = {
  photos: Photo[]
  caption: string
};

export default async function ComponentsPage() {
  const [
    photos,
    photosCount,
    photosFavs,
    tags,
    cameras,
    albums,
    years,
  ] = await Promise.all([
    getPhotosCached({ limit: INFINITE_SCROLL_GRID_INITIAL }),
    getPhotosMetaCached()
      .then(({ count }) => count),
    getPhotosCached({ tag: TAG_FAVS }),
    getUniqueTagsCached().catch(() => []),
    getUniqueCamerasCached().catch(() => []),
    getAlbumsWithMetaCached().catch(() => []),
    getUniqueYearsCached().catch(() => []),
  ]);

  const topTag = sortTagsByCount(tags, TAG_FAVS)[0];
  const topCamera = sortCategoriesByCount(cameras)[0];
  const recentAlbum = albums[0];
  const recentYear = years[0];

  const limit = MAX_PHOTOS_TO_SHOW_PER_CATEGORY;

  const [
    photosTopTag,
    photosTopCamera,
    photosRecentAlbum,
    photosRecentYear,
  ] = await Promise.all([
    topTag
      ? getPhotosCached({ tag: topTag.tag, limit }).catch(() => [])
      : [],
    topCamera
      ? getPhotosCached({ camera: topCamera.camera, limit })
        .catch(() => [])
      : [],
    recentAlbum
      ? getPhotosCached({ album: recentAlbum.album, limit })
        .catch(() => [])
      : [],
    recentYear
      ? getPhotosCached({ year: recentYear.year, limit })
        .catch(() => [])
      : [],
  ]);

  const photoFolders = ([
    {
      photos: photosFavs.slice(0, limit),
      caption: formatTag(TAG_FAVS),
    },
    topTag && {
      photos: photosTopTag,
      caption: formatTag(topTag.tag),
    },
    topCamera && {
      photos: photosTopCamera,
      caption: formatCameraText(topCamera.camera),
    },
    recentAlbum && {
      photos: photosRecentAlbum,
      caption: recentAlbum.album.title,
    },
    recentYear && {
      photos: photosRecentYear,
      caption: recentYear.year,
    },
  ]).filter((folder): folder is PhotoFolderPreview =>
    Boolean(folder && folder.photos.length > 0));

  return (
    <AdminComponentPageClient
      photo={photos[0]}
      photos={photos}
      photosCount={photosCount}
      photosFavs={photosFavs}
      photoFolders={photoFolders}
    />
  );
}
