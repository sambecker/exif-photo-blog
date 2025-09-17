import {
  getPhotosMeta,
  getUniqueCameras,
  getUniqueFilms,
  getUniqueFocalLengths,
  getUniqueLenses,
  getUniqueRecipes,
  getUniqueTags,
  getUniqueYears,
} from '@/photo/query';
import {
  SHOW_FILMS,
  SHOW_FOCAL_LENGTHS,
  SHOW_LENSES,
  SHOW_RECIPES,
  SHOW_CAMERAS,
  SHOW_TAGS,
  SHOW_YEARS,
  SHOW_RECENTS,
  SHOW_ALBUMS,
} from '@/app/config';
import { createLensKey } from '@/lens';
import { sortTagsByCount } from '@/tag';
import { sortCategoriesByCount } from '@/category';
import { sortFocalLengths } from '@/focal';
import { getAlbumsWithMeta } from '@/album/query';

type CategoryData = Awaited<ReturnType<typeof getDataForCategories>>;

export const NULL_CATEGORY_DATA: CategoryData = {
  recents: [],
  years: [],
  cameras: [],
  lenses: [],
  tags: [],
  recipes: [],
  films: [],
  focalLengths: [],
  albums: [],
};

export const getDataForCategories = () => Promise.all([
  SHOW_RECENTS
    ? getPhotosMeta({ recent: true })
      .then(({ count, dateRange }) => count && dateRange
        ? [{
          count,
          lastModified: new Date(dateRange?.end ?? ''),
        }] : undefined)
      .catch(() => [])
    : undefined,
  SHOW_YEARS
    ? getUniqueYears()
      .catch(() => [])
    : undefined,
  SHOW_CAMERAS
    ? getUniqueCameras()
      .then(sortCategoriesByCount)
      .catch(() => [])
    : undefined,
  SHOW_LENSES
    ? getUniqueLenses()
      .then(sortCategoriesByCount)
      .catch(() => [])
    : undefined,
  SHOW_TAGS
    ? getUniqueTags()
      .then(sortTagsByCount)
      .catch(() => [])
    : undefined,
  SHOW_RECIPES
    ? getUniqueRecipes()
      .then(sortCategoriesByCount)
      .catch(() => [])
    : undefined,
  SHOW_FILMS
    ? getUniqueFilms()
      .then(sortCategoriesByCount)
      .catch(() => [])
    : undefined,
  SHOW_FOCAL_LENGTHS
    ? getUniqueFocalLengths()
      .then(sortFocalLengths)
      .catch(() => [])
    : undefined,
  SHOW_ALBUMS
    ? getAlbumsWithMeta()
      .catch(() => [])
    : undefined,
]).then(([
  recents = [],
  years = [],
  cameras = [],
  lenses = [],
  tags = [],
  recipes = [],
  films = [],
  focalLengths = [],
  albums = [],
]) => ({
  recents,
  years,
  cameras,
  lenses,
  tags,
  recipes,
  films,
  focalLengths,
  albums,
}));

export const getCountsForCategories = async () => {
  const {
    recents,
    years,
    cameras,
    lenses,
    albums,
    tags,
    recipes,
    films,
    focalLengths,
  } = await getDataForCategories();

  return {
    recents: recents[0]?.count
      ? { count: recents[0].count }
      : {} as Record<string, number>,
    years: years.reduce((acc, year) => {
      acc[year.year] = year.count;
      return acc;
    }, {} as Record<string, number>),
    albums: albums.reduce((acc, { album, count }) => {
      acc[album.slug] = count;
      return acc;
    }, {} as Record<string, number>),
    cameras: cameras.reduce((acc, camera) => {
      acc[camera.cameraKey] = camera.count;
      return acc;
    }, {} as Record<string, number>),
    lenses: lenses.reduce((acc, lens) => {
      acc[createLensKey(lens.lens)] = lens.count;
      return acc;
    }, {} as Record<string, number>),
    tags: tags.reduce((acc, tag) => {
      acc[tag.tag] = tag.count;
      return acc;
    }, {} as Record<string, number>),
    recipes: recipes.reduce((acc, recipe) => {
      acc[recipe.recipe] = recipe.count;
      return acc;
    }, {} as Record<string, number>),
    films: films.reduce((acc, film) => {
      acc[film.film] = film.count;
      return acc;
    }, {} as Record<string, number>),
    focalLengths: focalLengths.reduce((acc, focalLength) => {
      acc[focalLength.focal] = focalLength.count;
      return acc;
    }, {} as Record<string, number>),
  };
};
