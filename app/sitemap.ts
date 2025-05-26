import type { MetadataRoute } from 'next';
import { getDataForCategoriesCached } from '@/category/cache';
import {
  absolutePathForCamera,
  absolutePathForFilm,
  absolutePathForFocalLength,
  absolutePathForLens,
  absolutePathForRecipe,
  absolutePathForTag,
} from '@/app/paths';
import { isTagFavs } from '@/tag';
import { BASE_URL, GRID_HOMEPAGE_ENABLED } from '@/app/config';

// Cache for 24 hours
export const revalidate = 86_400;
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const {
    cameras,
    lenses,
    tags,
    recipes,
    films,
    focalLengths,
  } = await getDataForCategoriesCached();

  // TODO: import all non-hidden photo urls + updated_ats

  return [
    // Homepage
    {
      url: BASE_URL!,
      changeFrequency: 'monthly',
      priority: 1,
    },
    // Grid or Feed
    {
      url: GRID_HOMEPAGE_ENABLED ? `${BASE_URL}/feed` : `${BASE_URL}/grid`,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Cameras
    ...cameras.map(({ camera, lastModified }) => ({
      url: absolutePathForCamera(camera),
      lastModified,
      priority: 0.8,
    })),
    // Lenses
    ...lenses.map(({ lens, lastModified }) => ({
      url: absolutePathForLens(lens),
      lastModified,
      priority: 0.8,
    })),
    // Tags
    ...tags.map(({ tag, lastModified }) => ({
      url: absolutePathForTag(tag),
      lastModified,
      priority: isTagFavs(tag) ? 0.9 : 0.8,
    })),
    // Recipes
    ...recipes.map(({ recipe, lastModified }) => ({
      url: absolutePathForRecipe(recipe),
      lastModified,
      priority: 0.8,
    })),
    // Films
    ...films.map(({ film, lastModified }) => ({
      url: absolutePathForFilm(film),
      lastModified,
      priority: 0.8,
    })),
    // Focal Lengths
    ...focalLengths.map(({ focal, lastModified }) => ({
      url: absolutePathForFocalLength(focal),
      lastModified,
      priority: 0.8,
    })),
  ];
}
