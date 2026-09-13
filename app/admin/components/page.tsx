import AdminComponentPageClient from '@/admin/AdminComponentPageClient';
import { formatCameraText } from '@/camera';
import { sortCategoriesByCount } from '@/category';
import { getAlbumsWithMetaCached } from '@/album/cache';
import { PHOTO_FOLDER_PEEK_PHOTOS } from '@/components/folder';
import { PhotoQueryOptions } from '@/db';
import { labelForFilm } from '@/film';
import { formatFocalLength } from '@/focal';
import { MAX_PHOTOS_TO_SHOW_PER_CATEGORY } from '@/image-response';
import { formatLensText } from '@/lens';
import { INFINITE_SCROLL_GRID_INITIAL, Photo } from '@/photo';
import {
  getPhotosCached,
  getPhotosMetaCached,
  getUniqueCamerasCached,
  getUniqueFilmsCached,
  getUniqueFocalLengthsCached,
  getUniqueLensesCached,
  getUniqueRecipesCached,
  getUniqueTagsCached,
  getUniqueYearsCached,
} from '@/photo/cache';
import { formatRecipe } from '@/recipe';
import { formatTag, sortTagsByCount, TAG_FAVS } from '@/tag';

const FOLDER_LIMITS = [
  3,
  4,
  MAX_PHOTOS_TO_SHOW_PER_CATEGORY,
] as const;

const getRandomPreviewPhotos = (
  options: PhotoQueryOptions,
  limit: number,
) => getPhotosCached({ ...options, sortBy: 'random', limit })
  .catch(() => [] as Photo[]);

const previewIndexes = (length: number) =>
  [...new Set([0, 1, length - 1].filter(i => i >= 0 && i < length))];

type FolderQuery = {
  options: PhotoQueryOptions
  caption: string
  count?: number
};

export default async function ComponentsPage() {
  const [
    photos,
    photosCount,
    photosFavs,
    tags,
    cameras,
    lenses,
    albums,
    years,
    films,
    recipes,
    focalLengths,
  ] = await Promise.all([
    getPhotosCached({ limit: INFINITE_SCROLL_GRID_INITIAL }),
    getPhotosMetaCached()
      .then(({ count }) => count),
    getPhotosCached({ tag: TAG_FAVS }),
    getUniqueTagsCached().catch(() => []),
    getUniqueCamerasCached().catch(() => []),
    getUniqueLensesCached().catch(() => []),
    getAlbumsWithMetaCached().catch(() => []),
    getUniqueYearsCached().catch(() => []),
    getUniqueFilmsCached().catch(() => []),
    getUniqueRecipesCached().catch(() => []),
    getUniqueFocalLengthsCached().catch(() => []),
  ]);

  const tagsByCount = sortTagsByCount(tags, TAG_FAVS);
  const camerasByCount = sortCategoriesByCount(cameras);
  const lensesByCount = sortCategoriesByCount(lenses);
  const filmsByCount = sortCategoriesByCount(films);
  const recipesByCount = sortCategoriesByCount(recipes);
  const focalLengthsByCount = sortCategoriesByCount(focalLengths);

  const foldersFrom = <T,>(
    items: T[],
    toQuery: (item: T) => FolderQuery,
  ): FolderQuery[] =>
    previewIndexes(items.length).map(index => toQuery(items[index]));

  const folderQueries: FolderQuery[] = [
    {
      options: { tag: TAG_FAVS },
      caption: formatTag(TAG_FAVS),
      count: tagsByCount.find(({ tag }) => tag === TAG_FAVS)?.count ??
        photosFavs.length,
    },
    {
      options: { recent: true },
      caption: 'Recents',
      count: photosCount,
    },
    ...foldersFrom(tagsByCount, ({ tag, count }) => ({
      options: { tag },
      caption: formatTag(tag),
      count,
    })),
    ...foldersFrom(years, ({ year, count }) => ({
      options: { year },
      caption: year,
      count,
    })),
    ...foldersFrom(camerasByCount, ({ camera, count }) => ({
      options: { camera },
      caption: formatCameraText(camera),
      count,
    })),
    ...foldersFrom(lensesByCount, ({ lens, count }) => ({
      options: { lens },
      caption: formatLensText(lens),
      count,
    })),
    ...foldersFrom(albums, ({ album, count }) => ({
      options: { album },
      caption: album.title,
      count,
    })),
    ...foldersFrom(recipesByCount, ({ recipe, count }) => ({
      options: { recipe },
      caption: formatRecipe(recipe),
      count,
    })),
    ...foldersFrom(filmsByCount, ({ film, count }) => ({
      options: { film },
      caption: labelForFilm(film).medium,
      count,
    })),
    ...foldersFrom(focalLengthsByCount, ({ focal, count }) => ({
      options: { focal },
      caption: formatFocalLength(focal),
      count,
    })),
  ];

  const folderPhotos = await Promise.all(
    folderQueries.map((query, index) =>
      getRandomPreviewPhotos(
        query.options,
        FOLDER_LIMITS[index % FOLDER_LIMITS.length] +
          PHOTO_FOLDER_PEEK_PHOTOS,
      )),
  );

  const photoFolders = folderQueries
    .map((query, index) => ({
      photos: folderPhotos[index],
      caption: query.caption,
      maxPhotos: FOLDER_LIMITS[index % FOLDER_LIMITS.length],
      count: query.count,
    }))
    .filter(folder => folder.photos.length > 0);

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
