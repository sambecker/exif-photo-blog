import {
  pathForAlbum,
  pathForCamera,
  pathForFilm,
  pathForFocalLength,
  pathForLens,
  pathForRecipe,
  pathForTag,
  pathForYear,
  PREFIX_RECENTS,
} from '@/app/path';
import { PhotoSetCategory } from '.';

export const keyForCategory = (category: PhotoSetCategory) => {
  let key = '';

  if (category.recent) {
    key = PREFIX_RECENTS;
  } else if (category.year) {
    key = pathForYear(category.year);
  } else if (category.camera) {
    key = pathForCamera(category.camera);
  } else if (category.lens) {
    key = pathForLens(category.lens);
  } else if (category.album) {
    key = pathForAlbum(category.album);
  } else if (category.tag) {
    key = pathForTag(category.tag);
  } else if (category.recipe) {
    key = pathForRecipe(category.recipe);
  } else if (category.film) {
    key = pathForFilm(category.film);
  } else if (category.focal) {
    key = pathForFocalLength(category.focal);
  }

  return key
    // Remove leading slash
    .replace(/^\//, '')
    // Replace slashes with dashes
    .replaceAll('/', '-');
};
