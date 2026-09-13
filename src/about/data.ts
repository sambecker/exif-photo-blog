import {
  CATEGORY_VISIBILITY,
  HIDE_TAGS_WITH_ONE_PHOTO,
} from '@/app/config';
import {
  PREFIX_RECENTS,
  pathForAlbum,
  pathForCamera,
  pathForFilm,
  pathForFocalLength,
  pathForLens,
  pathForRecipe,
  pathForTag,
  pathForYear,
} from '@/app/path';
import { formatCameraText } from '@/camera';
import { CategoryKey, PhotoSetCategories } from '@/category';
import { PhotoQueryOptions } from '@/db';
import { labelForFilm } from '@/film';
import { formatFocalLength } from '@/focal';
import { AppTextState } from '@/i18n/state';
import { formatLensText } from '@/lens';
import { Photo } from '@/photo';
import { getPhotoCached, getPhotosCached } from '@/photo/cache';
import {
  AboutSetFolder,
  AboutSetFolderRow,
  PHOTO_FOLDER_MAX_PHOTOS,
  PHOTO_FOLDER_PEEK_PHOTOS,
} from '@/components/folder';
import { formatRecipe } from '@/recipe';
import {
  formatTag,
  limitTagsByCount,
  TAG_FAVS,
  TAG_PRIVATE,
} from '@/tag';
import { About } from '.';
import { getAbout } from './query';
import { getAboutCached } from './cache';

const getAboutAvatar = (about?: About) =>
  about?.photoIdAvatar
    ? getPhotoCached(about?.photoIdAvatar ?? '', true)
    : undefined;

const getAboutHero = (about?: About) =>
  about?.photoIdHero
    ? getPhotoCached(about?.photoIdHero ?? '', true)
    // Fall back to favorite photos if no hero photo is set
    : getPhotosCached({ tag: TAG_FAVS, limit: 1 })
      .then(photos => photos.length > 0
        ? photos[0]
        // Fall back to oldest photo if no favorite photos exist
        : getPhotosCached({ limit: 1, sortBy: 'takenAtAsc' })
          .then(photos => photos[0]));

export const getAboutData = ({
  includeHero = true,
}: {
  includeHero?: boolean
} = {}) =>
  getAbout()
    .then(async about => ({
      about,
      photoAvatar: await getAboutAvatar(about),
      photoHero: includeHero ? await getAboutHero(about) : undefined,
    }));

export const getAboutDataCached = ({
  includeHero = true,
}: {
  includeHero?: boolean
} = {}) =>
  getAboutCached()
    .then(async about => ({
      about,
      photoAvatar: await getAboutAvatar(about),
      photoHero: includeHero ? await getAboutHero(about) : undefined,
    }));

type FolderQuery = Omit<AboutSetFolder, 'photos'> & {
  options: PhotoQueryOptions
};

const titleForCategoryKey = (
  category: CategoryKey,
  appText: AppTextState,
) => {
  switch (category) {
    case 'recents': return appText.category.recentPlural;
    case 'years': return appText.category.yearPlural;
    case 'cameras': return appText.category.cameraPlural;
    case 'lenses': return appText.category.lensPlural;
    case 'albums': return appText.category.albumPlural;
    case 'tags': return appText.category.tagPlural;
    case 'recipes': return appText.category.recipePlural;
    case 'films': return appText.category.filmPlural;
    case 'focal-lengths': return appText.category.focalLengthPlural;
  }
};

const getFolderQueriesForCategory = (
  category: CategoryKey,
  categories: PhotoSetCategories,
  appText: AppTextState,
): FolderQuery[] => {
  switch (category) {
    case 'recents':
      return categories.recents.length > 0
        ? [{
          key: 'recents',
          options: { recent: true },
          caption: appText.category.recentPlural,
          path: PREFIX_RECENTS,
          count: categories.recents[0].count,
        }]
        : [];
    case 'years':
      return categories.years.map(({ year, count }) => ({
        key: year,
        options: { year },
        caption: year,
        path: pathForYear(year),
        count,
      }));
    case 'cameras':
      return categories.cameras.map(({ camera, cameraKey, count }) => ({
        key: cameraKey,
        options: { camera },
        caption: formatCameraText(camera),
        path: pathForCamera(camera),
        count,
      }));
    case 'lenses':
      return categories.lenses.map(({ lens, lensKey, count }) => ({
        key: lensKey,
        options: { lens },
        caption: formatLensText(lens),
        path: pathForLens(lens),
        count,
      }));
    case 'albums':
      return categories.albums
        .filter(({ count }) => count > 0)
        .map(({ album, count }) => ({
          key: album.slug,
          options: { album },
          caption: album.title,
          path: pathForAlbum(album),
          count,
        }));
    case 'tags': {
      const tags = HIDE_TAGS_WITH_ONE_PHOTO
        ? limitTagsByCount(categories.tags, 2)
        : categories.tags;
      return tags
        .filter(({ tag }) => tag !== TAG_PRIVATE)
        .map(({ tag, count }) => ({
          key: tag,
          options: { tag },
          caption: formatTag(tag),
          path: pathForTag(tag),
          count,
        }));
    }
    case 'recipes':
      return categories.recipes.map(({ recipe, count }) => ({
        key: recipe,
        options: { recipe },
        caption: formatRecipe(recipe),
        path: pathForRecipe(recipe),
        count,
      }));
    case 'films':
      return categories.films.map(({ film, count }) => ({
        key: film,
        options: { film },
        caption: labelForFilm(film).medium,
        path: pathForFilm(film),
        count,
      }));
    case 'focal-lengths':
      return categories.focalLengths.map(({ focal, count }) => ({
        key: `${focal}`,
        options: { focal },
        caption: formatFocalLength(focal),
        path: pathForFocalLength(focal),
        count,
      }));
  }
};

export const getAboutFolderRows = async (
  categories: PhotoSetCategories,
  appText: AppTextState,
): Promise<AboutSetFolderRow[]> => {
  const rows = CATEGORY_VISIBILITY.map(category => ({
    key: category,
    title: titleForCategoryKey(category, appText),
    queries: getFolderQueriesForCategory(category, categories, appText),
  })).filter(row => row.queries.length > 0);

  const folderPhotos = await Promise.all(
    rows.flatMap(row => row.queries).map(({ options }) =>
      getPhotosCached({
        ...options,
        sortBy: 'random',
        limit: PHOTO_FOLDER_MAX_PHOTOS + PHOTO_FOLDER_PEEK_PHOTOS,
      }).catch(() => [] as Photo[])),
  );

  let photoIndex = 0;

  return rows
    .map(row => ({
      key: row.key,
      title: row.title,
      folders: row.queries
        .map(query => ({
          key: query.key,
          caption: query.caption,
          path: query.path,
          count: query.count,
          // Omit blurData so /about ISR stays under Vercel's 19MB page limit
          photos: (folderPhotos[photoIndex++] ?? [])
            .map(({ blurData: _blurData, ...photo }) => photo),
        }))
        .filter(folder => folder.photos.length > 0),
    }))
    .filter(row => row.folders.length > 0);
};
