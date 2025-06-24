import { unstable_cache } from 'next/cache';
import { Photo, PhotoDateRange } from '@/photo';
import { Tags } from '@/tag';
import { Cameras, createCameraKey } from '@/camera';
import { Lenses, createLensKey } from '@/lens';
import { FocalLengths } from '@/focal';
import { GetPhotosOptions, PHOTO_DEFAULT_LIMIT } from '@/photo/db';
// import { getPhotosCacheKeys } from '@/photo/cache';
import { parameterize } from '@/utility/string';
import { convertImmichAssetToPhoto } from './mapper';
import { getImmichClient, ImmichAsset } from './client';
import {
  IMMICH_DEFAULT_ALBUM_ID,
  IMMICH_DEFAULT_SHARE_KEY,
} from '@/app/config';

export const KEY_IMMICH = 'immich';

// --- Internal implementation functions ---

function getUniqueTagsInternal(photos: Photo[]): Tags {
  const tagMap = new Map<string, {
    count: number;
    lastModified: Date;
  }>();

  photos.forEach(photo => {
    photo.tags.forEach(tag => {
      if (tag && tag.trim() !== '') {
        const trimmedTag = tag.trim();

        if (tagMap.has(trimmedTag)) {
          const existing = tagMap.get(trimmedTag)!;
          existing.count++;
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


export const getUniqueTagsCached = (
  options: GetPhotosOptions,
  albumId: string,
  sharedKey: string) => unstable_cache(
  async (): Promise<Tags> => {
    const photos = await getPhotosCached(options, albumId, sharedKey)();
    return getUniqueTagsInternal(photos);
  },
  ['immich-unique-tags',
    albumId,
    sharedKey,
    ...getPhotosCacheKeys(options)],
);

export const getUniqueCamerasCached = (
  options: GetPhotosOptions,
  albumId: string,
  sharedKey: string) => unstable_cache(
  async (): Promise<Cameras> => {
    const photos = await getPhotosCached(options, albumId, sharedKey)();
    return getUniqueCamerasInternal(photos);
  },
  ['immich-unique-cameras',
    albumId,
    sharedKey,
    ...getPhotosCacheKeys(options)],
);

export const getUniqueLensesCached = (
  options: GetPhotosOptions,
  albumId: string,
  sharedKey: string) => unstable_cache(
  async (): Promise<Lenses> => {
    const photos = await getPhotosCached(options, albumId, sharedKey)();
    return getUniqueLensesInternal(photos);
  },
  ['immich-unique-lenses',
    albumId,
    sharedKey,
    ...getPhotosCacheKeys(options)],
);

export const getUniqueFocalLengthsCached = (
  options: GetPhotosOptions,
  albumId: string,
  sharedKey: string) => unstable_cache(
  async (): Promise<FocalLengths> => {
    const photos = await getPhotosCached(options, albumId, sharedKey)();
    return getUniqueFocalLengthsInternal(photos);
  },
  ['immich-unique-focal-lengths',
    albumId,
    sharedKey,
    ...getPhotosCacheKeys(options)],
);

export const getPhotosCached = (
  options: GetPhotosOptions,
  albumId: string,
  sharedKey: string) => unstable_cache(
  async (): Promise<Photo[]> => {
    let assets: ImmichAsset[] = [];
    let source = 'album';
    if (albumId != '') {
      const immichAlbumInfo = await getImmichClient().
        getAlbumInfo(albumId, false);
      if (!immichAlbumInfo) {
        return [];
      }
      if (!immichAlbumInfo.assets) {
        return [];
      }
      assets = immichAlbumInfo.assets;
      source = 'shared-album';
    } else {
      const sharelinkInfo = await getImmichClient().
        getSharedLinkInfo(sharedKey);
      assets = sharelinkInfo?.assets || [];
      source = 'shared-non-album';
      if (assets.length == 0) {
        assets = (await getImmichClient().
          getAlbumInfo(IMMICH_DEFAULT_ALBUM_ID || '', false))?.assets || [];
        source = 'default-album';
      }
    }

    assets = assets.filter((asset: ImmichAsset) => {
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

    const photos = assets.map((asset: ImmichAsset) =>
      convertImmichAssetToPhoto(
        asset, 'preview',
        source !== 'default-album' ?
          (sharedKey || '') : (IMMICH_DEFAULT_SHARE_KEY || '')));
    return photos;
  },
  ['immich-photos',
    albumId,
    sharedKey,
    ...getPhotosCacheKeys(options)],
);

export const getPhotosNearIdCached = (
  photoId: string,
  options: GetPhotosOptions,
  albumId: string,
  sharedKey: string) => unstable_cache(
  async (): Promise<{
      photos: Photo[]; indexNumber?: number
    }> => {

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
  ['immich-photos-near-id',
    photoId,
    albumId,
    sharedKey,
    ...getPhotosCacheKeys(options)],
);

export const getPhotosMetaCached = (
  options: GetPhotosOptions,
  albumId: string,
  sharedKey: string) => unstable_cache(
  async (): Promise<{ count: number; dateRange?: PhotoDateRange }> => {
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
  ['immich-photos-meta',
    albumId,
    sharedKey,
    ...getPhotosCacheKeys(options)],
);

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

// copy from src/photo/cache.ts
const getPhotosCacheKeyForOption = (
  options: GetPhotosOptions,
  option: keyof GetPhotosOptions,
): string | null => {
  switch (option) {
  // Complex keys
  case 'camera': {
    const value = options[option];
    return value ? `${option}-${createCameraKey(value)}` : null;
  }
  case 'lens': {
    const value = options[option];
    return value ? `${option}-${createLensKey(value)}` : null;
  }
  case 'takenBefore':
  case 'takenAfterInclusive':
  case 'updatedBefore': {
    const value = options[option];
    return value ? `${option}-${value.toISOString()}` : null;
  }
  // Primitive keys
  default:
    const value = options[option];
    return value !== undefined ? `${option}-${value}` : null;
  }
};

// copy from src/photo/cache.ts
export const getPhotosCacheKeys = (options: GetPhotosOptions = {}) => {
  const tags: string[] = [];

  Object.keys(options).forEach(key => {
    const tag = getPhotosCacheKeyForOption(
      options,
      key as keyof GetPhotosOptions,
    );
    if (tag) { tags.push(tag); }
  });

  return tags;
};
