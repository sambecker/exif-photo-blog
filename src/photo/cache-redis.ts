import {
  getCachedPhoto,
  setCachedPhoto,
  getCachedPhotosList,
  setCachedPhotosList,
  getCachedCount,
  setCachedCount,
  getCachedUniqueValues,
  setCachedUniqueValues,
  generatePhotosListKey,
  invalidatePhotoCache,
  clearAllRedisCache,
  invalidateCacheByType,
} from './redis-cache';
import {
  getPhoto,
  getPhotos,
  getPhotosMeta,
  getUniqueTags,
  getUniqueCameras,
  getUniqueLenses,
  getUniqueFilms,
  getUniqueRecipes,
  getUniqueFocalLengths,
} from './db/query';
import { GetPhotosOptions } from './db';
import { Photo } from '@/photo';
import { Tags } from '@/tag';
import { Cameras } from '@/camera';
import { Lenses } from '@/lens';
import { Films } from '@/film';
import { Recipes } from '@/recipe';
import { FocalLengths } from '@/focal';
import { performanceMonitor } from '@/utility/performance';

// Enhanced photo fetching with Redis caching
export const getPhotoWithRedisCache = async (
  photoId: string,
  includeHidden?: boolean
): Promise<Photo | undefined> => {
  // Try Redis cache first
  const cached = await getCachedPhoto(photoId);
  if (cached) {
    // Validate cached photo matches hidden criteria
    if (!includeHidden && cached.hidden) {
      return undefined;
    }
    return cached;
  }

  // Fall back to database
  const photo = await getPhoto(photoId, includeHidden);
  
  // Cache the result if found
  if (photo) {
    await setCachedPhoto(photo);
  }
  
  return photo;
};

// Enhanced photos list fetching with Redis caching
export const getPhotosWithRedisCache = async (
  options: GetPhotosOptions = {}
): Promise<Photo[]> => {
  const cacheKey = generatePhotosListKey(options);
  
  // Try Redis cache first
  const cached = await getCachedPhotosList(cacheKey);
  if (cached) {
    return cached;
  }

  // Fall back to database
  const photos = await getPhotos(options);
  
  // Cache the results
  await setCachedPhotosList(cacheKey, photos);
  
  // Also cache individual photos
  await Promise.all(photos.map(photo => setCachedPhoto(photo)));
  
  return photos;
};

// Enhanced photos meta fetching with Redis caching
export const getPhotosMetaWithRedisCache = async (
  options: GetPhotosOptions = {}
) => {
  const cacheKey = `photos:meta:${generatePhotosListKey(options)}`;
  
  // Try Redis cache for count
  const cachedCount = await getCachedCount(cacheKey);
  if (cachedCount !== null) {
    return { count: cachedCount };
  }

  // Fall back to database
  const meta = await getPhotosMeta(options);
  
  // Cache the count
  await setCachedCount(cacheKey, meta.count);
  
  return meta;
};

// Enhanced unique tags fetching with Redis caching
export const getUniqueTagsWithRedisCache = async (): Promise<Tags> => {
  const cached = await getCachedUniqueValues<Tags>('tags');
  if (cached) {
    return cached;
  }

  const tags = await getUniqueTags();
  await setCachedUniqueValues('tags', tags);
  return tags;
};

// Enhanced unique cameras fetching with Redis caching
export const getUniqueCamerasWithRedisCache = async (): Promise<Cameras> => {
  const cached = await getCachedUniqueValues<Cameras>('cameras');
  if (cached) {
    return cached;
  }

  const cameras = await getUniqueCameras();
  await setCachedUniqueValues('cameras', cameras);
  return cameras;
};

// Enhanced unique lenses fetching with Redis caching
export const getUniqueLensesWithRedisCache = async (): Promise<Lenses> => {
  const cached = await getCachedUniqueValues<Lenses>('lenses');
  if (cached) {
    return cached;
  }

  const lenses = await getUniqueLenses();
  await setCachedUniqueValues('lenses', lenses);
  return lenses;
};

// Enhanced unique films fetching with Redis caching
export const getUniqueFilmsWithRedisCache = async (): Promise<Films> => {
  const cached = await getCachedUniqueValues<Films>('films');
  if (cached) {
    return cached;
  }

  const films = await getUniqueFilms();
  await setCachedUniqueValues('films', films);
  return films;
};

// Enhanced unique recipes fetching with Redis caching
export const getUniqueRecipesWithRedisCache = async (): Promise<Recipes> => {
  const cached = await getCachedUniqueValues<Recipes>('recipes');
  if (cached) {
    return cached;
  }

  const recipes = await getUniqueRecipes();
  await setCachedUniqueValues('recipes', recipes);
  return recipes;
};

// Enhanced unique focal lengths fetching with Redis caching
export const getUniqueFocalLengthsWithRedisCache = async (): Promise<FocalLengths> => {
  const cached = await getCachedUniqueValues<FocalLengths>('focal-lengths');
  if (cached) {
    return cached;
  }

  const focalLengths = await getUniqueFocalLengths();
  await setCachedUniqueValues('focal-lengths', focalLengths);
  return focalLengths;
};

// Cache invalidation helpers
export const invalidatePhotoAndRelatedCaches = async (photoId: string) => {
  console.log(`[Redis Cache] Invalidating photo ${photoId} and related caches`);
  
  // Invalidate the specific photo
  await invalidatePhotoCache(photoId);
  
  // Invalidate aggregated data that might have changed
  await Promise.all([
    invalidateCacheByType('tags'),
    invalidateCacheByType('cameras'),
    invalidateCacheByType('lenses'),
    invalidateCacheByType('films'),
    invalidateCacheByType('recipes'),
    invalidateCacheByType('focal-lengths'),
  ]);
};

// Utility to warm up cache
export const warmUpPhotoCache = async (limit = 50) => {
  console.log(`[Redis Cache] Warming up cache with ${limit} most recent photos`);
  
  try {
    // Get recent photos
    const photos = await getPhotos({ limit, sortBy: 'updatedAt' });
    
    // Cache them
    await Promise.all(photos.map(photo => setCachedPhoto(photo)));
    
    // Also warm up aggregated data
    await Promise.all([
      getUniqueTagsWithRedisCache(),
      getUniqueCamerasWithRedisCache(),
      getUniqueLensesWithRedisCache(),
      getUniqueFilmsWithRedisCache(),
      getUniqueRecipesWithRedisCache(),
      getUniqueFocalLengthsWithRedisCache(),
    ]);
    
    console.log(`[Redis Cache] Cache warmed up successfully`);
  } catch (error) {
    console.error('[Redis Cache] Error warming up cache:', error);
  }
};

// Re-export for convenience
export { clearAllRedisCache };

// Helper to get cache stats
export const getCacheStats = () => {
  const metrics = performanceMonitor.getMetrics();
  const hitRate = metrics.cacheHits + metrics.cacheMisses > 0
    ? (metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses)) * 100
    : 0;
    
  return {
    hits: metrics.cacheHits,
    misses: metrics.cacheMisses,
    hitRate: hitRate.toFixed(2) + '%',
  };
};