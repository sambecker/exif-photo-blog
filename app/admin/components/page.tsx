import AdminComponentPageClient from '@/admin/AdminComponentPageClient';
import { formatCameraText } from '@/camera';
import { sortCategoriesByCount } from '@/category';
import { getAlbumsWithMetaCached } from '@/album/cache';
import { labelForFilm } from '@/film';
import { MAX_PHOTOS_TO_SHOW_PER_CATEGORY } from '@/image-response';
import { INFINITE_SCROLL_GRID_INITIAL, Photo } from '@/photo';
import {
  getPhotosCached,
  getPhotosMetaCached,
  getUniqueCamerasCached,
  getUniqueFilmsCached,
  getUniqueRecipesCached,
  getUniqueTagsCached,
  getUniqueYearsCached,
} from '@/photo/cache';
import { formatRecipe } from '@/recipe';
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
    films,
    recipes,
  ] = await Promise.all([
    getPhotosCached({ limit: INFINITE_SCROLL_GRID_INITIAL }),
    getPhotosMetaCached()
      .then(({ count }) => count),
    getPhotosCached({ tag: TAG_FAVS }),
    getUniqueTagsCached().catch(() => []),
    getUniqueCamerasCached().catch(() => []),
    getAlbumsWithMetaCached().catch(() => []),
    getUniqueYearsCached().catch(() => []),
    getUniqueFilmsCached().catch(() => []),
    getUniqueRecipesCached().catch(() => []),
  ]);

  const tagsByCount = sortTagsByCount(tags, TAG_FAVS);
  const camerasByCount = sortCategoriesByCount(cameras);
  const filmsByCount = sortCategoriesByCount(films);
  const recipesByCount = sortCategoriesByCount(recipes);

  const topTag = tagsByCount[0];
  const secondTag = tagsByCount[1];
  const topCamera = camerasByCount[0];
  const leastCamera = camerasByCount.length > 1
    ? camerasByCount[camerasByCount.length - 1]
    : undefined;
  const recentAlbum = albums[0];
  const secondAlbum = albums[1];
  const recentYear = years[0];
  const leastFilm = filmsByCount[filmsByCount.length - 1];
  const leastRecipe = recipesByCount[recipesByCount.length - 1];

  const limit = MAX_PHOTOS_TO_SHOW_PER_CATEGORY;

  const [
    photosTopTag,
    photosSecondTag,
    photosTopCamera,
    photosLeastCamera,
    photosRecentAlbum,
    photosSecondAlbum,
    photosRecentYear,
    photosLeastFilm,
    photosLeastRecipe,
  ] = await Promise.all([
    topTag
      ? getPhotosCached({ tag: topTag.tag, limit }).catch(() => [])
      : [],
    secondTag
      ? getPhotosCached({ tag: secondTag.tag, limit }).catch(() => [])
      : [],
    topCamera
      ? getPhotosCached({ camera: topCamera.camera, limit })
        .catch(() => [])
      : [],
    leastCamera
      ? getPhotosCached({ camera: leastCamera.camera, limit })
        .catch(() => [])
      : [],
    recentAlbum
      ? getPhotosCached({ album: recentAlbum.album, limit })
        .catch(() => [])
      : [],
    secondAlbum
      ? getPhotosCached({ album: secondAlbum.album, limit })
        .catch(() => [])
      : [],
    recentYear
      ? getPhotosCached({ year: recentYear.year, limit })
        .catch(() => [])
      : [],
    leastFilm
      ? getPhotosCached({ film: leastFilm.film, limit }).catch(() => [])
      : [],
    leastRecipe
      ? getPhotosCached({ recipe: leastRecipe.recipe, limit })
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
    secondTag && {
      photos: photosSecondTag,
      caption: formatTag(secondTag.tag),
    },
    topCamera && {
      photos: photosTopCamera,
      caption: formatCameraText(topCamera.camera),
    },
    leastCamera && {
      photos: photosLeastCamera,
      caption: formatCameraText(leastCamera.camera),
    },
    recentAlbum && {
      photos: photosRecentAlbum,
      caption: recentAlbum.album.title,
    },
    secondAlbum && {
      photos: photosSecondAlbum,
      caption: secondAlbum.album.title,
    },
    recentYear && {
      photos: photosRecentYear,
      caption: recentYear.year,
    },
    leastFilm && {
      photos: photosLeastFilm,
      caption: labelForFilm(leastFilm.film).medium,
    },
    leastRecipe && {
      photos: photosLeastRecipe,
      caption: formatRecipe(leastRecipe.recipe),
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
