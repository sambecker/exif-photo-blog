'use server';

import { runAuthenticatedAdminServerAction } from '@/auth';
import { testRedisConnection } from '@/platforms/redis';
import { testOpenAiConnection } from '@/platforms/openai';
import { testDatabaseConnection } from '@/platforms/postgres';
import { testStorageConnection } from '@/platforms/storage';
import { APP_CONFIGURATION } from '@/app/config';
import { getStorageUploadUrlsNoStore } from '@/platforms/storage/cache';
import { getPhotosMetaCached, getUniqueTagsCached } from '@/photo/cache';
import { getShouldShowInsightsIndicator } from '@/admin/insights/server';

export const getAdminDataAction = async () =>
  runAuthenticatedAdminServerAction(async () => {
    const [
      countPhotos,
      countHiddenPhotos,
      countTags,
      countUploads,
      shouldShowInsightsIndicator,
    ] = await Promise.all([
      getPhotosMetaCached()
        .then(({ count }) => count)
        .catch(() => 0),
      getPhotosMetaCached({ hidden: 'only' })
        .then(({ count }) => count)
        .catch(() => 0),
      getUniqueTagsCached()
        .then(tags => tags.length)
        .catch(() => 0),
      getStorageUploadUrlsNoStore()
        .then(urls => urls.length)
        .catch(e => {
          console.error(`Error getting blob upload urls: ${e}`);
          return 0;
        }),
      getShouldShowInsightsIndicator(),
    ]);

    return {
      countPhotos,
      countHiddenPhotos,
      countTags,
      countUploads,
      shouldShowInsightsIndicator,
    };
  });

const scanForError = (
  shouldCheck: boolean,
  promise: () => Promise<any>,
): Promise<string> =>
  shouldCheck
    ? promise()
      .then(() => '')
      .catch(error => error.message)
    : Promise.resolve('');

export const testConnectionsAction = async () =>
  runAuthenticatedAdminServerAction(async () => {
    const {
      hasDatabase,
      hasStorageProvider,
      hasRedisStorage,
      isAiTextGenerationEnabled,
    } = APP_CONFIGURATION;

    const [
      databaseError,
      storageError,
      redisError,
      aiError,
    ] = await Promise.all([
      scanForError(hasDatabase, testDatabaseConnection),
      scanForError(hasStorageProvider, testStorageConnection),
      scanForError(hasRedisStorage, testRedisConnection),
      scanForError(isAiTextGenerationEnabled, testOpenAiConnection),
    ]);

    return {
      databaseError,
      storageError,
      redisError,
      aiError,
    };
  });
