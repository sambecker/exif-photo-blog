import { GetPhotosOptions } from '.';
import { createPhotoDataSource } from '../provider/factory';

const dataSource = createPhotoDataSource();

export const getPhotos = (options: GetPhotosOptions) =>
  dataSource.getPhotos(options);
export const getPhoto = (id: string, includeHidden?: boolean) =>
  dataSource.getPhoto(id, includeHidden);
export const getPhotosMeta = (options?: GetPhotosOptions) =>
  dataSource.getPhotosMeta(options);
export const getUniqueCameras = () =>
  dataSource.getUniqueCameras();
export const getUniqueLenses = () =>
  dataSource.getUniqueLenses();
export const getUniqueTags = () =>
  dataSource.getUniqueTags();
export const getUniqueFocalLengths = () =>
  dataSource.getUniqueFocalLengths();
export const getPublicPhotoIds = (options?: { limit?: number }) =>
  dataSource.getPublicPhotoIds(options);
export const getPhotoIdsAndUpdatedAt = () =>
  dataSource.getPhotoIdsAndUpdatedAt();
export const getPhotosNearId = (photoId: string, options: GetPhotosOptions) =>
  dataSource.getPhotosNearId(photoId, options);
export const getUniqueFilms = () =>
  dataSource.getUniqueFilms();
export const getUniqueRecipes = () =>
  dataSource.getUniqueRecipes();

// write operations - internal API
export {
  insertPhoto,
  updatePhoto,
  deletePhoto,
  deletePhotoTagGlobally,
  renamePhotoTagGlobally,
  addTagsToPhotos,
  deletePhotoRecipeGlobally,
  renamePhotoRecipeGlobally,
} from './database';

// metadata operations - internal API
export {
  getPhotosMostRecentUpdate,
  getRecipeTitleForData,
  getPhotosNeedingRecipeTitleCount,
  updateAllMatchingRecipeTitles,
} from './database';

// sync operations - internal API
export {
  getPhotosInNeedOfSync,
  getPhotosInNeedOfSyncCount,
} from './database';