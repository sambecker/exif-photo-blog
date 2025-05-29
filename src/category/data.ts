import {
  getUniqueCameras,
  getUniqueFilms,
  getUniqueFocalLengths,
  getUniqueLenses,
  getUniqueRecipes,
  getUniqueTags,
} from '@/photo/db/query';
import {
  SHOW_FILMS,
  SHOW_FOCAL_LENGTHS,
  SHOW_LENSES,
  SHOW_RECIPES,
  SHOW_CAMERAS,
  SHOW_TAGS,
} from '@/app/config';
import { createLensKey } from '@/lens';
import { sortTagsByCount } from '@/tag';
import { sortCategoriesByCount } from '@/category';
import { sortFocalLengths } from '@/focal';

type CategoryData = Awaited<ReturnType<typeof getDataForCategories>>;

export const NULL_CATEGORY_DATA: CategoryData = {
  cameras: [],
  lenses: [],
  tags: [],
  recipes: [],
  films: [],
  focalLengths: [],
};

export const getDataForCategories = () => Promise.all([
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
]).then(([
  cameras = [],
  lenses = [],
  tags = [],
  recipes = [],
  films = [],
  focalLengths = [],
]) => ({
  cameras, lenses, tags, recipes, films, focalLengths,
}));

export const getCountsForCategories = async () => {
  const {
    cameras,
    lenses,
    tags,
    recipes,
    films,
    focalLengths,
  } = await getDataForCategories();

  return {
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
