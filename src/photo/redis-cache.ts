import { redis } from '@/platforms/redis';
import { HAS_REDIS_STORAGE } from '@/app/config';
import { Photo } from '@/photo';
import { performanceMonitor } from '@/utility/performance';

// Cache configuration
const CACHE_TTL = 3600; // 1 hour in seconds
const CACHE_VERSION = 'v1'; // Increment to invalidate all caches

// Cache key prefixes
const PHOTO_PREFIX = `photo:${CACHE_VERSION}:`;
const PHOTOS_LIST_PREFIX = `photos:list:${CACHE_VERSION}:`;
const PHOTOS_COUNT_PREFIX = `photos:count:${CACHE_VERSION}:`;
const UNIQUE_VALUES_PREFIX = `unique:${CACHE_VERSION}:`;

// Generate cache key for photo lists based on options
const generatePhotosListKey = (options: Record<string, any>): string => {
  // Sort options to ensure consistent keys
  const sortedOptions = Object.keys(options)
    .sort()
    .reduce((acc, key) => {
      if (options[key] !== undefined && options[key] !== null) {
        acc[key] = options[key];
      }
      return acc;
    }, {} as Record<string, any>);
  
  return `${PHOTOS_LIST_PREFIX}${JSON.stringify(sortedOptions)}`;
};

// Cache operations with performance tracking
export const getCachedPhoto = async (photoId: string): Promise<Photo | null> => {
  if (!redis || !HAS_REDIS_STORAGE) return null;
  
  try {
    const start = performance.now();
    const cached = await redis.get(`${PHOTO_PREFIX}${photoId}`);
    const duration = performance.now() - start;
    
    if (cached) {
      performanceMonitor.recordCacheHit();
      console.log(`[Redis Cache] Photo ${photoId} - HIT (${duration.toFixed(2)}ms)`);
      return JSON.parse(cached as string);
    } else {
      performanceMonitor.recordCacheMiss();
      console.log(`[Redis Cache] Photo ${photoId} - MISS`);
      return null;
    }
  } catch (error) {
    console.error('[Redis Cache] Error getting photo:', error);
    performanceMonitor.recordCacheMiss();
    return null;
  }
};

export const setCachedPhoto = async (photo: Photo): Promise<void> => {
  if (!redis || !HAS_REDIS_STORAGE) return;
  
  try {
    const start = performance.now();
    await redis.setex(
      `${PHOTO_PREFIX}${photo.id}`,
      CACHE_TTL,
      JSON.stringify(photo)
    );
    const duration = performance.now() - start;
    console.log(`[Redis Cache] Photo ${photo.id} cached (${duration.toFixed(2)}ms)`);
  } catch (error) {
    console.error('[Redis Cache] Error setting photo:', error);
  }
};

export const getCachedPhotosList = async (
  cacheKey: string
): Promise<Photo[] | null> => {
  if (!redis || !HAS_REDIS_STORAGE) return null;
  
  try {
    const start = performance.now();
    const cached = await redis.get(cacheKey);
    const duration = performance.now() - start;
    
    if (cached) {
      performanceMonitor.recordCacheHit();
      console.log(`[Redis Cache] Photos list - HIT (${duration.toFixed(2)}ms)`);
      return JSON.parse(cached as string);
    } else {
      performanceMonitor.recordCacheMiss();
      console.log(`[Redis Cache] Photos list - MISS`);
      return null;
    }
  } catch (error) {
    console.error('[Redis Cache] Error getting photos list:', error);
    performanceMonitor.recordCacheMiss();
    return null;
  }
};

export const setCachedPhotosList = async (
  cacheKey: string,
  photos: Photo[]
): Promise<void> => {
  if (!redis || !HAS_REDIS_STORAGE) return;
  
  try {
    const start = performance.now();
    await redis.setex(
      cacheKey,
      CACHE_TTL,
      JSON.stringify(photos)
    );
    const duration = performance.now() - start;
    console.log(`[Redis Cache] Photos list cached (${duration.toFixed(2)}ms)`);
  } catch (error) {
    console.error('[Redis Cache] Error setting photos list:', error);
  }
};

// Cache for count queries
export const getCachedCount = async (
  cacheKey: string
): Promise<number | null> => {
  if (!redis || !HAS_REDIS_STORAGE) return null;
  
  try {
    const cached = await redis.get(cacheKey);
    if (cached !== null) {
      performanceMonitor.recordCacheHit();
      return parseInt(cached as string, 10);
    }
    performanceMonitor.recordCacheMiss();
    return null;
  } catch (error) {
    console.error('[Redis Cache] Error getting count:', error);
    performanceMonitor.recordCacheMiss();
    return null;
  }
};

export const setCachedCount = async (
  cacheKey: string,
  count: number
): Promise<void> => {
  if (!redis || !HAS_REDIS_STORAGE) return;
  
  try {
    await redis.setex(cacheKey, CACHE_TTL, count.toString());
  } catch (error) {
    console.error('[Redis Cache] Error setting count:', error);
  }
};

// Cache for unique values (tags, cameras, etc.)
export const getCachedUniqueValues = async <T>(
  type: string
): Promise<T | null> => {
  if (!redis || !HAS_REDIS_STORAGE) return null;
  
  try {
    const cached = await redis.get(`${UNIQUE_VALUES_PREFIX}${type}`);
    if (cached) {
      performanceMonitor.recordCacheHit();
      return JSON.parse(cached as string);
    }
    performanceMonitor.recordCacheMiss();
    return null;
  } catch (error) {
    console.error(`[Redis Cache] Error getting unique ${type}:`, error);
    performanceMonitor.recordCacheMiss();
    return null;
  }
};

export const setCachedUniqueValues = async <T>(
  type: string,
  values: T
): Promise<void> => {
  if (!redis || !HAS_REDIS_STORAGE) return;
  
  try {
    await redis.setex(
      `${UNIQUE_VALUES_PREFIX}${type}`,
      CACHE_TTL,
      JSON.stringify(values)
    );
  } catch (error) {
    console.error(`[Redis Cache] Error setting unique ${type}:`, error);
  }
};

// Selective cache invalidation
export const invalidatePhotoCache = async (photoId: string): Promise<void> => {
  if (!redis || !HAS_REDIS_STORAGE) return;
  
  try {
    console.log(`[Redis Cache] Invalidating cache for photo ${photoId}`);
    
    // Delete the specific photo cache
    await redis.del(`${PHOTO_PREFIX}${photoId}`);
    
    // Delete all list caches (they might contain this photo)
    // In a production system, you might want to be more selective
    const pattern = `${PHOTOS_LIST_PREFIX}*`;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`[Redis Cache] Invalidated ${keys.length} list caches`);
    }
    
    // Also invalidate count caches
    const countPattern = `${PHOTOS_COUNT_PREFIX}*`;
    const countKeys = await redis.keys(countPattern);
    if (countKeys.length > 0) {
      await redis.del(...countKeys);
    }
  } catch (error) {
    console.error('[Redis Cache] Error invalidating photo cache:', error);
  }
};

// Invalidate all caches for a specific type
export const invalidateCacheByType = async (type: string): Promise<void> => {
  if (!redis || !HAS_REDIS_STORAGE) return;
  
  try {
    console.log(`[Redis Cache] Invalidating all ${type} caches`);
    const pattern = `*:${CACHE_VERSION}:${type}:*`;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`[Redis Cache] Invalidated ${keys.length} ${type} caches`);
    }
  } catch (error) {
    console.error(`[Redis Cache] Error invalidating ${type} caches:`, error);
  }
};

// Clear all caches (for testing or major updates)
export const clearAllRedisCache = async (): Promise<void> => {
  if (!redis || !HAS_REDIS_STORAGE) return;
  
  try {
    console.log('[Redis Cache] Clearing all caches');
    const pattern = `*:${CACHE_VERSION}:*`;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      console.log(`[Redis Cache] Cleared ${keys.length} cache entries`);
    }
  } catch (error) {
    console.error('[Redis Cache] Error clearing all caches:', error);
  }
};

// Export the key generation function for use in cache.ts
export { generatePhotosListKey };