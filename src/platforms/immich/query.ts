// src/photo/data-source/immich.ts
import { Photo, PhotoDateRange } from '@/photo';
import {
  ImmichApiClient,
} from '@/platforms/immich/client'; // Adjust the path as needed
import { convertImmichAssetToPhoto } from './mapper';
import { Tags } from '@/tag';
import { Cameras } from '@/camera';
import { Lenses } from '@/lens';
import { FocalLengths } from '@/focal';
import { PhotoDataSource } from '@/photo/provider/interface';
import { GetPhotosOptions, PHOTO_DEFAULT_LIMIT } from '@/photo/db';
import {

  getPhotosCached,
  getUniqueTagsCached,
  getUniqueCamerasCached,
  getUniqueLensesCached,
  getUniqueFocalLengthsCached,
  getPhotosNearIdCached,
  getPhotosMetaCached,
  getAlbumIdFromShareKeyCached
} from './cache';

import { getAlbumId, getSharedKey } from './resolver'; // Adjust the path as needed


export class ImmichDataSource implements PhotoDataSource {
  private api: ImmichApiClient;
  private albumId: string;

  constructor(api: ImmichApiClient, albumId: string) {
    this.api = api;
    this.albumId = albumId;
  }

  async getPhotos(options: GetPhotosOptions): Promise<Photo[]
  > {
    console.log('---getPhotos options---', options);
    const albumId = await getAlbumId();
    const albumSharedKey = await getSharedKey();
    console.log('---albumId---', albumId);
    const photos = await getPhotosCached(options, albumId || this.albumId, albumSharedKey)();
    console.log('---getPhotos---', photos.length);
    return photos
  }


  async getUniqueTags(): Promise<Tags> {
    try {
      const albumId = await getAlbumId();
      const albumSharedKey = await getSharedKey();
      return await getUniqueTagsCached({ hidden: 'exclude' }, albumId || this.albumId, albumSharedKey)();
    } catch (error) {
      console.error('Error getting unique tags from Immich:', error);
      return [];
    }
  }

  async getUniqueCameras(): Promise<Cameras> {
    try {
      const albumId = await getAlbumId();
      const albumSharedKey = await getSharedKey();
      return await getUniqueCamerasCached({ hidden: 'exclude' }, albumId || this.albumId, albumSharedKey)();
    } catch (error) {
      console.error('Error getting unique cameras from Immich:', error);
      return [];
    }
  }

  async getUniqueLenses(): Promise<Lenses> {
    try {
      const albumId = await getAlbumId();
      const albumSharedKey = await getSharedKey();
      return await getUniqueLensesCached({ hidden: 'exclude' }, albumId || this.albumId, albumSharedKey)();
    } catch (error) {
      console.error('Error getting unique lenses from Immich:', error);
      return [];
    }
  }

  async getUniqueFocalLengths(): Promise<FocalLengths> {
    try {
      const albumId = await getAlbumId();
      const albumSharedKey = await getSharedKey();
      return await getUniqueFocalLengthsCached({ hidden: 'exclude' }, albumId || this.albumId, albumSharedKey)();
    } catch (error) {
      console.error('Error getting unique focal lengths from Immich:', error);
      return [];
    }
  }

  async getPhotosNearId(
    photoId: string,
    options: GetPhotosOptions,
  ): Promise<{ photos: Photo[]; indexNumber?: number }> {
    try {
      const albumId = await getAlbumId();
      const albumSharedKey = await getSharedKey();
      return await getPhotosNearIdCached(photoId, options, albumId || this.albumId, albumSharedKey)();
    } catch (error) {
      console.error('Error getting photos near ID from Immich:', error);
      return { photos: [], indexNumber: undefined };
    }
  }

  async getPhotosMeta(options: GetPhotosOptions): Promise<{
    count: number;
    dateRange?: PhotoDateRange
  }> {
    try {
      const albumId = await getAlbumId();
      const albumSharedKey = await getSharedKey();
      return await getPhotosMetaCached(options, albumId || this.albumId, albumSharedKey)();
    } catch (error) {
      console.error('Error getting photos meta from Immich:', error);
      return { count: 0 };
    }
  }

  async getPublicPhotoIds({ limit }:
    { limit?: number } = {}): Promise<string[]> {
    try {
      const albumId = await getAlbumId();
      const albumSharedKey = await getSharedKey();
      const photos = await getPhotosCached({}, albumId || this.albumId, albumSharedKey)();

      let photoIds = photos.map((photo: Photo) => photo.id);

      if (limit && limit > 0) {
        photoIds = photoIds.slice(0, limit);
      }

      return photoIds;
    } catch (error) {
      console.error('Error getting public photo IDs from Immich:', error);
      return [];
    }
  }

  async getPhotoIdsAndUpdatedAt():
    Promise<Array<{ id: string; updatedAt: Date }>> {
    try {
      const albumId = await getAlbumId();
      const albumSharedKey = await getSharedKey();
      const photos = await getPhotosCached({}, albumId || this.albumId, albumSharedKey)();

      return photos.map((photo: Photo) => ({
        id: photo.id,
        updatedAt: photo.updatedAt,
      }));
    } catch (error) {
      console.error(
        'Error getting photo IDs and updated at from Immich:', error);
      return [];
    }
  }

  async getPhoto(id: string,
    includeHidden?: boolean): Promise<Photo | undefined> {
    try {
      const assetId = id;
      const asset = await this.api.getAssetInfo(assetId);
      if (!asset) {
        return undefined;
      }

      const sharedKey = await getSharedKey();
      const photo = convertImmichAssetToPhoto(asset, 'preview', sharedKey);

      if (!includeHidden && photo.hidden) {
        return undefined;
      }

      return photo;
    } catch (error) {
      console.error(`Error getting photo ${id} from Immich:`, error);
      return undefined;
    }
  }

  async getRecipeTitleForData(
    _data: string | object, _film: string): Promise<string | undefined> {
    return undefined;
  }

  async getPhotosNeedingRecipeTitleCount(
    _data: string,
    _film: string,
    _photoIdToExclude?: string,
  ): Promise<number> {
    return 0;
  }

  async getUniqueRecipes(): Promise<never[]> {
    return [];
  }

  async getUniqueFilms(): Promise<never[]> {
    return [];
  }
}

/**
 * Applies limit and offset to an in-memory array to simulate pagination.
 * @param photos - The full array of photos to paginate.
 * @param options - An object containing optional limit and offset.
 * @returns A new array containing the paginated subset of photos.
 */
export const applyLocalPagination = <T>(
  photos: T[],
  options: GetPhotosOptions,
): T[] => {
  const {
    limit = PHOTO_DEFAULT_LIMIT,
    offset = 0,
  } = options || {};

  // Use Array.slice() to get the desired page.
  // slice(start, end)
  return photos.slice(offset, offset + limit);
};

// export const getAlbumId = async (): Promise<string> => {
//   const shareKey = await getActiveShareKey();
//   if (!shareKey) {
//     console.warn('No share key found, returning empty photo list.');
//     return '';
//   }
//   return await getAlbumIdFromShareKeyCached(shareKey);
// };
