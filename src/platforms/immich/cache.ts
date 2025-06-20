import { revalidateTag, unstable_cache } from 'next/cache';
import { getImmichClient, getSharedLinkInfo, ImmichAlbumInfo, ImmichSharedLinkInfo } from './client';
import { Photo, PhotoDateRange } from '@/photo';
import { Tags } from '@/tag';
import { Cameras, createCameraKey } from '@/camera';
import { Lenses, createLensKey } from '@/lens';
import { FocalLengths } from '@/focal';
import { GetPhotosOptions } from '@/photo/db';
import { getPhotosCacheKeys } from '@/photo/cache';

// --- 缓存键定义 (Cache Keys) ---
// 遵循项目风格，定义统一的键常量

// 主表键 (Table key)
export const KEY_IMMICH = 'immich';
// 类型键 (Type keys)
const KEY_SHARED_LINK = 'shared-link';
const KEY_ALBUM = 'album';

// --- 缓存重新验证 (Revalidation) ---

/**
 * 重新验证所有与 Immich 相关的缓存标签
 */
export const revalidateImmichKeys = () => {
  revalidateTag(KEY_IMMICH);
};

/**
 * 重新验证特定的 Immich 相册缓存
 * @param albumId 要重新验证的相册 ID
 */
export const revalidateImmichAlbum = (albumId: string) => {
  // 精确地重新验证与特定相册相关的缓存
  revalidateTag(`${KEY_ALBUM}-${albumId}`);
};

// --- Internal implementation functions ---

function getUniqueTagsInternal(photos: Photo[]): Tags {
  console.log(`[Cache] PROCESSING unique tags for ${photos.length} photos`);

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
}

function getUniqueCamerasInternal(photos: Photo[]): Cameras {
  console.log(`[Cache] PROCESSING unique cameras for ${photos.length} photos`);

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
}

function getUniqueLensesInternal(photos: Photo[]): Lenses {
  console.log(`[Cache] PROCESSING unique lenses for ${photos.length} photos`);

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
}

function getUniqueFocalLengthsInternal(photos: Photo[]): FocalLengths {
  console.log(`[Cache] PROCESSING unique focal lengths for ${photos.length} photos`);

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
}

//
// 公共缓存入口函数 (对外导出)
// 这些是异步包装函数，负责在缓存边界之外获取动态数据 (shareKey)，
// 然后调用内部的、纯粹的缓存函数。
// 这是您应用中其他地方应该调用的函数。
//

/**
 * 获取当前用户的分享链接信息（已缓存）
 */

export const getAlbumInfoCached = (albumId: string, withoutAssets: boolean) => unstable_cache(
  async (): Promise<ImmichAlbumInfo | null> => {
    console.log(`[Cache] FETCHING Immich album info for ID: ${albumId}`);
    return getImmichClient().getAlbumInfo(albumId, withoutAssets);
  },

  [KEY_IMMICH, KEY_ALBUM, albumId, withoutAssets.toString()]
);

export const getAlbumIdFromShareKeyCached = unstable_cache(
  async (shareKey: string) => {
    const linkInfo = await getSharedLinkInfo(shareKey);
    if (!linkInfo?.album.id) {
      throw new Error(`No album found for share key: ${shareKey}`);
    }
    return linkInfo.album.id;
  },
  ['immich-album-id-from-share-key']
);


export const getUniqueTagsCached = (options: GetPhotosOptions, albumId: string, sharedKey: string) => unstable_cache(
  async (): Promise<Tags> => {
    console.log(`[Cache] FETCHING unique tags for album: ${albumId}`);

    const photos = await getPhotosCached(options, albumId, sharedKey)();
    return getUniqueTagsInternal(photos);
  },
  ['immich-unique-tags', albumId, sharedKey, ...getPhotosCacheKeys(options)]
);

export const getUniqueCamerasCached = (options: GetPhotosOptions, albumId: string, sharedKey: string) => unstable_cache(
  async (): Promise<Cameras> => {
    console.log(`[Cache] FETCHING unique cameras for album: ${albumId}`);

    const photos = await getPhotosCached(options, albumId, sharedKey)();
    return getUniqueCamerasInternal(photos);
  },
  ['immich-unique-cameras', albumId, sharedKey, ...getPhotosCacheKeys(options)]
);

export const getUniqueLensesCached = (options: GetPhotosOptions, albumId: string, sharedKey: string) => unstable_cache(
  async (): Promise<Lenses> => {
    console.log(`[Cache] FETCHING unique lenses for album: ${albumId}`);

    const photos = await getPhotosCached(options, albumId, sharedKey)();
    return getUniqueLensesInternal(photos);
  },
  ['immich-unique-lenses', albumId, sharedKey, ...getPhotosCacheKeys(options)]
);

export const getUniqueFocalLengthsCached = (options: GetPhotosOptions, albumId: string, sharedKey: string) => unstable_cache(
  async (): Promise<FocalLengths> => {
    console.log(`[Cache] FETCHING unique focal lengths for album: ${albumId}`);

    const photos = await getPhotosCached(options, albumId, sharedKey)();
    return getUniqueFocalLengthsInternal(photos);
  },
  ['immich-unique-focal-lengths', albumId, sharedKey, ...getPhotosCacheKeys(options)]
);

export const getPhotosCached = (options: GetPhotosOptions, albumId: string, sharedKey: string) => unstable_cache(
  async (): Promise<Photo[]> => {
    console.log(`[Cache] FETCHING photos for album: ${albumId}, options:`, options);

    const { convertImmichAssetToPhoto } = require('./mapper');
    const { parameterize } = require('@/utility/string');
    const { applyLocalPagination } = require('./query');

    const immichAlbumInfo = await getImmichClient().getAlbumInfo(albumId, false);
    if (!immichAlbumInfo || !immichAlbumInfo.assets) {
      console.warn('No assets found in the album.');
      return [];
    }
    console.log(`[getPhotosCached]Found ${immichAlbumInfo.assets.length} assets in album: ${albumId}`);
    let assets = immichAlbumInfo.assets.filter((asset: any) => {
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
    console.log(`[getPhotosCached]After filtering, found ${assets.length} assets in album: ${albumId}`);
    return assets.map((asset: any) => convertImmichAssetToPhoto(asset, 'preview', sharedKey));
  },
  ['immich-photos', albumId, sharedKey, ...getPhotosCacheKeys(options)]
);

export const getPhotosNearIdCached = (photoId: string, options: GetPhotosOptions, albumId: string, sharedKey: string) => unstable_cache(
  async (): Promise<{ photos: Photo[]; indexNumber?: number }> => {
    console.log(`[Cache] FETCHING photos near ID: ${photoId} for album: ${albumId}`);

    const { limit = 20 } = options;
    const allPhotos = await getPhotosCached({
      ...options,
      limit: undefined,
      offset: undefined,
    }, albumId, sharedKey)();

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
  },
  ['immich-photos-near-id', photoId, albumId, sharedKey, ...getPhotosCacheKeys(options)]
);

export const getPhotosMetaCached = (options: GetPhotosOptions, albumId: string, sharedKey: string) => unstable_cache(
  async (): Promise<{ count: number; dateRange?: PhotoDateRange }> => {
    console.log(`[Cache] FETCHING photos meta for album: ${albumId}`);

    const photos = await getPhotosCached(options, albumId, sharedKey)();
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
  },
  ['immich-photos-meta', albumId, sharedKey, ...getPhotosCacheKeys(options)]
);
