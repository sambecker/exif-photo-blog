// src/photo/data-source/immich.ts
import { Photo, PhotoDateRange } from '@/photo';
import {
  ImmichApiClient,
} from '@/platforms/immich/client'; // Adjust the path as needed
import { convertImmichAssetToPhoto } from './mapper';
import { Tags } from '@/tag';
import { Cameras, createCameraKey } from '@/camera';
import { createLensKey, Lenses } from '@/lens';
import { FocalLengths } from '@/focal';
import { parameterize } from '@/utility/string';
import { PhotoDataSource } from '@/photo/provider/interface';
import { GetPhotosOptions, PHOTO_DEFAULT_LIMIT } from '@/photo/db';

export class ImmichDataSource implements PhotoDataSource {
  private api: ImmichApiClient;
  private albumId: string;

  constructor(api: ImmichApiClient, albumId: string) {
    this.api = api;
    this.albumId = albumId;
  }

  async getPhotos(options: GetPhotosOptions): Promise<Photo[]> {
    const immichAlbumInfo = await this.api.getAlbumInfo(this.albumId, false);

    let assets = immichAlbumInfo.assets.filter(asset => {
      if (!options) {
        return true;
      }
      // camera
      if (options.camera &&
        (parameterize(asset.exifInfo?.make || '') !==
          parameterize(options.camera?.make || '') ||
          parameterize(asset.exifInfo?.model || '') !==
          parameterize(options.camera?.model || ''))) {
        return false;
      }

      if (options.lens) {
        const lensModelMatches = parameterize(
          asset.exifInfo?.lensModel || '') ===
          parameterize(options.lens.model || '');

        if (!options.lens.make || options.lens.make.trim() === '') {
          return lensModelMatches;
        }

        const lensMakeMatches = parameterize(
          asset.exifInfo?.lensMake || '') ===
          parameterize(options.lens.make || '');
        return lensMakeMatches && lensModelMatches;
      }

      if (options.focal && asset.exifInfo?.focalLength !== options.focal) {
        return false;
      }

      return true;
    });

    if (options?.limit || options?.offset) {
      assets = applyLocalPagination(assets, options);
    }

    return assets.map(asset => convertImmichAssetToPhoto(asset, 'preview'));
  }


  async getUniqueTags(): Promise<Tags> {
    try {
      const photos = await this.getPhotos({ hidden: 'exclude' });

      const tagMap = new Map<string, {
        count: number;
        lastModified: Date;
      }>();

      photos.forEach(photo => {
        // 处理每张照片的所有标签
        photo.tags.forEach(tag => {
          // 只处理非空标签
          if (tag && tag.trim() !== '') {
            const trimmedTag = tag.trim();

            if (tagMap.has(trimmedTag)) {
              const existing = tagMap.get(trimmedTag)!;
              existing.count++;
              // 更新最后修改时间（取最新的）
              if (photo.updatedAt > existing.lastModified) {
                existing.lastModified = photo.updatedAt;
              }
            } else {
              tagMap.set(trimmedTag, {
                count: 1,
                lastModified: photo.updatedAt,
              });
            }
          }
        });
      });

      // 转换为目标格式并按标签名称排序
      const result = Array.from(tagMap.entries())
        .map(([tag, { count, lastModified }]) => ({
          tag,
          count,
          lastModified,
        }))
        .sort((a, b) => a.tag.localeCompare(b.tag));

      return result;
    } catch (error) {
      console.error('Error getting unique tags from Immich:', error);
      return [];
    }
  }

  async getUniqueCameras(): Promise<Cameras> {
    try {
      const photos = await this.getPhotos({ hidden: 'exclude' });


      const cameraMap = new Map<string, {
        make: string;
        model: string;
        count: number;
        lastModified: Date;
      }>();

      photos.forEach(photo => {

        if (photo.make && photo.model &&
          photo.make.trim() !== '' && photo.model.trim() !== '') {
          const cameraKey = createCameraKey({
            make: photo.make,
            model: photo.model,
          });

          if (cameraMap.has(cameraKey)) {
            const existing = cameraMap.get(cameraKey)!;
            existing.count++;

            if (photo.updatedAt > existing.lastModified) {
              existing.lastModified = photo.updatedAt;
            }
          } else {
            cameraMap.set(cameraKey, {
              make: photo.make,
              model: photo.model,
              count: 1,
              lastModified: photo.updatedAt,
            });
          }
        }
      });


      const result = Array.from(cameraMap.entries())
        .map(([key, { make, model, count, lastModified }]) => ({
          cameraKey: key,
          camera: { make, model },
          count,
          lastModified,
        }))
        .sort((a, b) => {

          const cameraA = `${a.camera.make} ${a.camera.model}`;
          const cameraB = `${b.camera.make} ${b.camera.model}`;
          return cameraA.localeCompare(cameraB);
        });

      return result;
    } catch (error) {
      console.error('Error getting unique cameras from Immich:', error);
      return [];
    }
  }

  async getUniqueLenses(): Promise<Lenses> {
    try {
      const photos = await this.getPhotos({ hidden: 'exclude' });

      const lensMap = new Map<string, {
        make: string;
        model: string;
        count: number;
        lastModified: Date;
      }>();

      photos.forEach(photo => {
        if (photo.lensMake ||
          photo.lensModel &&
          photo.lensModel.trim() !== '') {
          const lensKey = createLensKey({
            make: photo.lensMake,
            model: photo.lensModel,
          });

          if (lensMap.has(lensKey)) {
            const existing = lensMap.get(lensKey)!;
            existing.count++;

            if (photo.updatedAt > existing.lastModified) {
              existing.lastModified = photo.updatedAt;
            }
          } else {
            lensMap.set(lensKey, {
              make: photo.lensMake ?? '',
              model: photo.lensModel ?? '',
              count: 1,
              lastModified: photo.updatedAt,
            });
          }
        }
      });

      const result = Array.from(lensMap.entries())
        .map(([key, { make, model, count, lastModified }]) => ({
          lensKey: key,
          lens: { make, model },
          count,
          lastModified,
        }))
        .sort((a, b) => {
          const lensA = `${a.lens.make} ${a.lens.model}`;
          const lensB = `${b.lens.make} ${b.lens.model}`;
          return lensA.localeCompare(lensB);
        });

      return result;
    } catch (error) {
      console.error('Error getting unique lenses from Immich:', error);
      return [];
    }
  }

  async getUniqueFocalLengths(): Promise<FocalLengths> {
    try {
      const photos = await this.getPhotos({ hidden: 'exclude' });


      const focalLengthMap = new Map<number, {
        count: number;
        lastModified: Date;
      }>();

      photos.forEach(photo => {

        if (photo.focalLength !== null && photo.focalLength !== undefined) {
          const focalLength = photo.focalLength;

          if (focalLengthMap.has(focalLength)) {
            const existing = focalLengthMap.get(focalLength)!;
            existing.count++;

            if (photo.updatedAt > existing.lastModified) {
              existing.lastModified = photo.updatedAt;
            }
          } else {
            focalLengthMap.set(focalLength, {
              count: 1,
              lastModified: photo.updatedAt,
            });
          }
        }
      });


      const result = Array.from(focalLengthMap.entries())
        .map(([focal, { count, lastModified }]) => ({
          focal,
          count,
          lastModified,
        }))
        .sort((a, b) => a.focal - b.focal);

      return result;
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
      const { limit = 20 } = options;

      const allPhotos = await this.getPhotos({
        ...options, limit: undefined, offset: undefined,
      });

      const targetIndex = allPhotos.findIndex(photo => photo.id === photoId);

      if (targetIndex === -1) {
        return { photos: [], indexNumber: undefined };
      }


      const startIndex = Math.max(0, targetIndex - 1);
      const endIndex = Math.min(allPhotos.length, startIndex + limit);


      const nearbyPhotos = allPhotos.slice(startIndex, endIndex);


      const indexNumber = targetIndex + 1; // 1-based index
      return {
        photos: nearbyPhotos,
        indexNumber,
      };
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
      const photos = await this.getPhotos(options);
      const count = photos.length;

      if (count === 0) {
        return { count: 0 };
      }

      const dates = photos
        .map(photo => photo.takenAt.getTime())
        .filter(time => !isNaN(time));

      let dateRange: PhotoDateRange | undefined;

      if (dates.length > 0) {
        const minDate = Math.min(...dates);
        const maxDate = Math.max(...dates);

        dateRange = {
          start: new Date(minDate).toDateString(),
          end: new Date(maxDate).toDateString(),
        };
      }

      return {
        count,
        dateRange,
      };
    } catch (error) {
      console.error('Error getting photos meta from Immich:', error);
      return { count: 0 };
    }
  }

  async getPublicPhotoIds({ limit }:
    { limit?: number } = {}): Promise<string[]> {
    try {
      const albumInfo = await this.api.getAlbumInfo(this.albumId);
      let photoIds = albumInfo.assets.map((asset) => {
        // TODO: 
        //   1. filter if asset is hidden
        //  2. translate asset id to photo id if needed 
        return asset.id;
      });
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
      const albumInfo = await this.api.getAlbumInfo(this.albumId);
      // `SELECT id, updated_at FROM photos WHERE hidden IS NOT TRUE`
      return albumInfo.assets.map(asset => ({
        id: asset.id,
        updatedAt: new Date(asset.fileModifiedAt),
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

      const photo = convertImmichAssetToPhoto(asset, 'preview');

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