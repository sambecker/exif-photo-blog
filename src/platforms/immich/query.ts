import { Photo, PhotoDateRange } from '@/photo';
import { convertImmichAssetToPhoto } from './mapper';
import { Tags } from '@/tag';
import { Cameras } from '@/camera';
import { Lenses } from '@/lens';
import { FocalLengths } from '@/focal';
import { PhotoDataSource } from '@/photo/provider/interface';
import { GetPhotosOptions } from '@/photo/db';
import {
  getPhotosCached,
  getUniqueTagsCached,
  getUniqueCamerasCached,
  getUniqueLensesCached,
  getUniqueFocalLengthsCached,
  getPhotosNearIdCached,
  getPhotosMetaCached,
} from './cache';
import {
  getAlbumId,
  getSharedKey,
} from './resolver';
import {
  ImmichApiClient,
} from '@/platforms/immich/client';

export class ImmichDataSource implements PhotoDataSource {
  private api: ImmichApiClient;
  private albumId: string;

  constructor(api: ImmichApiClient, albumId: string) {
    this.api = api;
    this.albumId = albumId;
  }

  async getPhotos(options: GetPhotosOptions): Promise<Photo[]
  > {
    const albumId = await getAlbumId();
    const albumSharedKey = await getSharedKey();
    const photos = await getPhotosCached(
      options, albumId, albumSharedKey)();
    return photos;
  }


  async getUniqueTags(): Promise<Tags> {
    const albumId = await getAlbumId();
    const albumSharedKey = await getSharedKey();
    const tags = await getUniqueTagsCached(
      { hidden: 'exclude' }, albumId, albumSharedKey)();
    return tags;
  }
  async getUniqueCameras(): Promise<Cameras> {
    const albumId = await getAlbumId();
    const albumSharedKey = await getSharedKey();
    const cameras = await getUniqueCamerasCached(
      { hidden: 'exclude' }, albumId, albumSharedKey,
    )();
    return cameras;
  }

  async getUniqueLenses(): Promise<Lenses> {
    const albumId = await getAlbumId();
    const albumSharedKey = await getSharedKey();
    const lenses = await getUniqueLensesCached(
      { hidden: 'exclude' }, albumId, albumSharedKey)();
    return lenses;
  }

  async getUniqueFocalLengths(): Promise<FocalLengths> {
    const albumId = await getAlbumId();
    const albumSharedKey = await getSharedKey();
    const focalLengths = await getUniqueFocalLengthsCached(
      { hidden: 'exclude' }, albumId, albumSharedKey)();
    return focalLengths;
  }

  async getPhotosNearId(
    photoId: string,
    options: GetPhotosOptions,
  ): Promise<{ photos: Photo[]; indexNumber?: number }> {
    const albumId = await getAlbumId();
    const albumSharedKey = await getSharedKey();
    const result = await getPhotosNearIdCached(
      photoId, options, albumId, albumSharedKey)();
    return result;
  }

  async getPhotosMeta(options: GetPhotosOptions): Promise<{
    count: number;
    dateRange?: PhotoDateRange
  }> {
    const albumId = await getAlbumId();
    const albumSharedKey = await getSharedKey();
    const meta = await getPhotosMetaCached(
      options, albumId, albumSharedKey)();
    return meta;
  }

  async getPublicPhotoIds({ limit }:
    { limit?: number } = {}): Promise<string[]> {
    const albumId = await getAlbumId();
    const albumSharedKey = await getSharedKey();
    const photos = await getPhotosCached({}, albumId, albumSharedKey)();
    let photoIds = photos.map((photo: Photo) => photo.id);
    if (limit && limit > 0) {
      photoIds = photoIds.slice(0, limit);
    }
    return photoIds;
  }

  async getPhotoIdsAndUpdatedAt():
    Promise<Array<{ id: string; updatedAt: Date }>> {
    const albumId = await getAlbumId();
    const albumSharedKey = await getSharedKey();
    const photos = await getPhotosCached({}, albumId, albumSharedKey)();
    const result = photos.map((photo: Photo) => ({
      id: photo.id,
      updatedAt: photo.updatedAt,
    }));


    return result;
  }

  async getPhoto(id: string,
    includeHidden?: boolean): Promise<Photo | undefined> {
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
