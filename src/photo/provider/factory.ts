// src/photo/data-source/factory.ts
import {
  USE_IMMICH_BACKEND,
  IMMICH_BASE_URL,
  IMMICH_API_KEY,
  IMMICH_ALBUM_ID,
} from '@/app/config';
import { getImmichClient } from '@/platforms/immich/client';
import { GetPhotosOptions } from '@/photo/db';
import { PhotoDataSource } from './interface';
import { ImmichDataSource } from '@/platforms/immich/query';

class PlatformDataSource implements PhotoDataSource {
  async getPhotos(options?: any) {
    const { getPhotos } = await import('@/photo/db/database');
    return getPhotos(options);
  }

  async getPhoto(id: string) {
    const { getPhoto } = await import('@/photo/db/database');
    return getPhoto(id);
  }

  async getPhotosMeta(options: GetPhotosOptions) {
    const { getPhotosMeta } = await import('@/photo/db/database');
    return getPhotosMeta(options);
  }

  async getUniqueCameras() {
    const { getUniqueCameras } = await import('@/photo/db/database');
    return getUniqueCameras();
  }

  async getUniqueLenses() {
    const { getUniqueLenses } = await import('@/photo/db/database');
    return getUniqueLenses();
  }

  async getUniqueTags() {
    const { getUniqueTags } = await import('@/photo/db/database');
    return getUniqueTags();
  }
  async getPublicPhotoIds(options?: { limit?: number }) {
    const { getPublicPhotoIds } = await import('@/photo/db/database');
    return getPublicPhotoIds(options || {});
  }

  async getPhotoIdsAndUpdatedAt() {
    const { getPhotoIdsAndUpdatedAt } = await import('@/photo/db/database');
    return getPhotoIdsAndUpdatedAt();
  }

  async getPhotosNearId(photoId: string, options: GetPhotosOptions) {
    const { getPhotosNearId } = await import('@/photo/db/database');
    return getPhotosNearId(photoId, options);
  }

  async getRecipeTitleForData(data: string | object, film: string) {
    const { getRecipeTitleForData } = await import('@/photo/db/database');
    return getRecipeTitleForData(data, film);
  }
  async getPhotosNeedingRecipeTitleCount(
    data: string, film: string, photoIdToExclude?: string) {
    const { getPhotosNeedingRecipeTitleCount } =
      await import('@/photo/db/database');
    return getPhotosNeedingRecipeTitleCount(data, film, photoIdToExclude);
  }
  async getUniqueRecipes() {
    const { getUniqueRecipes } = await import('@/photo/db/database');
    return getUniqueRecipes();
  }
  async getUniqueFilms() {
    const { getUniqueFilms } = await import('@/photo/db/database');
    return getUniqueFilms();
  }
  async getUniqueFocalLengths() {
    const { getUniqueFocalLengths } = await import('@/photo/db/database');
    return getUniqueFocalLengths();
  }
}


export function createPhotoDataSource(): PhotoDataSource {
  if (USE_IMMICH_BACKEND &&
    IMMICH_BASE_URL &&
    IMMICH_API_KEY &&
    IMMICH_ALBUM_ID) {
    const api = getImmichClient();
    return new ImmichDataSource(api, IMMICH_ALBUM_ID);
  } else {
    return new PlatformDataSource();
  }
}