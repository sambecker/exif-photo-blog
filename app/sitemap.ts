import type { MetadataRoute } from 'next';
import { getDataForCategoriesCached } from '@/category/cache';
import {
  ABSOLUTE_PATH_FULL,
  ABSOLUTE_PATH_GRID,
  absolutePathForAlbum,
  absolutePathForCamera,
  absolutePathForFilm,
  absolutePathForFocalLength,
  absolutePathForLens,
  absolutePathForPhoto,
  absolutePathForRecents,
  absolutePathForRecipe,
  absolutePathForTag,
  absolutePathForYear,
} from '@/app/path';
import { isTagFavs } from '@/tag';
import { BASE_URL, GRID_HOMEPAGE_ENABLED } from '@/app/config';
import { getPhotoIdsAndUpdatedAt } from '@/photo/query';

// Cache for 24 hours
export const revalidate = 86_400;

const PRIORITY_HOME             = 1;
const PRIORITY_HOME_VIEW        = 0.9;
const PRIORITY_CATEGORY_SPECIAL = 0.8;
const PRIORITY_CATEGORY         = 0.7;
const PRIORITY_PHOTO            = 0.5;
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    {
      recents,
      years,
      cameras,
      lenses,
      albums,
      tags,
      recipes,
      films,
      focalLengths,
    },
    photos,
  ] = await Promise.all([
    getDataForCategoriesCached().catch(() => ({
      recents: [],
      years: [],
      cameras: [],
      lenses: [],
      albums: [],
      tags: [],
      recipes: [],
      films: [],
      focalLengths: [],
    })),
    getPhotoIdsAndUpdatedAt().catch(() => []),
  ]);

  const lastModifiedSite = [
    ...recents.map(({ lastModified }) => lastModified),
    ...years.map(({ lastModified }) => lastModified),
    ...cameras.map(({ lastModified }) => lastModified),
    ...lenses.map(({ lastModified }) => lastModified),
    ...albums.map(({ lastModified }) => lastModified),
    ...tags.map(({ lastModified }) => lastModified),
    ...recipes.map(({ lastModified }) => lastModified),
    ...films.map(({ lastModified }) => lastModified),
    ...focalLengths.map(({ lastModified }) => lastModified),
    ...photos.map(({ updatedAt }) => updatedAt),
  ]
    .filter(date => date instanceof Date)
    .sort((a, b) => b.getTime() - a.getTime())[0];

  return [
    // Homepage
    {
      url: BASE_URL!,
      priority: PRIORITY_HOME,
      lastModified: lastModifiedSite,
    },
    // Grid or full
    {
      url: GRID_HOMEPAGE_ENABLED ? ABSOLUTE_PATH_FULL : ABSOLUTE_PATH_GRID,
      priority: PRIORITY_HOME_VIEW,
      lastModified: lastModifiedSite,
    },
    // Recents
    ...recents.map(({ lastModified }) => ({
      url: absolutePathForRecents(),
      priority: PRIORITY_CATEGORY,
      lastModified,
    })),
    // Years
    ...years.map(({ year, lastModified }) => ({
      url: absolutePathForYear(year),
      priority: PRIORITY_CATEGORY,
      lastModified,
    })),
    // Cameras
    ...cameras.map(({ camera, lastModified }) => ({
      url: absolutePathForCamera(camera),
      priority: PRIORITY_CATEGORY,
      lastModified,
    })),
    // Lenses
    ...lenses.map(({ lens, lastModified }) => ({
      url: absolutePathForLens(lens),
      priority: PRIORITY_CATEGORY,
      lastModified,
    })),
    // Albums
    ...albums.map(({ album, lastModified }) => ({
      url: absolutePathForAlbum(album),
      priority: PRIORITY_CATEGORY,
      lastModified,
    })),
    // Tags
    ...tags.map(({ tag, lastModified }) => ({
      url: absolutePathForTag(tag),
      priority: isTagFavs(tag)
        ? PRIORITY_CATEGORY_SPECIAL
        : PRIORITY_CATEGORY,
      lastModified,
    })),
    // Recipes
    ...recipes.map(({ recipe, lastModified }) => ({
      url: absolutePathForRecipe(recipe),
      priority: PRIORITY_CATEGORY,
      lastModified,
    })),
    // Films
    ...films.map(({ film, lastModified }) => ({
      url: absolutePathForFilm(film),
      priority: PRIORITY_CATEGORY,
      lastModified,
    })),
    // Focal Lengths
    ...focalLengths.map(({ focal, lastModified }) => ({
      url: absolutePathForFocalLength(focal),
      priority: PRIORITY_CATEGORY,
      lastModified,
    })),
    // Photos
    ...photos.map(({ id, updatedAt }) => ({
      url: absolutePathForPhoto({ photo: id }),
      priority: PRIORITY_PHOTO,
      lastModified: updatedAt,
    })),
  ];
}
