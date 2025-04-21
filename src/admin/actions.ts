'use server';

import { runAuthenticatedAdminServerAction } from '@/auth/server';
import { testRedisConnection } from '@/platforms/redis';
import { testOpenAiConnection } from '@/platforms/openai';
import { testDatabaseConnection } from '@/platforms/postgres';
import { testStorageConnection } from '@/platforms/storage';
import { APP_CONFIGURATION } from '@/app/config';
import { getStorageUploadUrlsNoStore } from '@/platforms/storage/cache';
import {
  getPhotosMeta,
  getUniqueTags,
  getUniqueRecipes,
  getPhotosInNeedOfSyncCount,
} from '@/photo/db/query';
import {
  getGitHubMetaForCurrentApp,
  indicatorStatusForSignificantInsights,
} from './insights';

export type AdminData = Awaited<ReturnType<typeof getAdminDataAction>>;

export const getAdminDataAction = async () =>
  runAuthenticatedAdminServerAction(async () => {
    const [
      photosCount,
      photosCountHidden,
      photosCountNeedSync,
      codeMeta,
      uploadsCount,
      tagsCount,
      recipesCount,
    ] = await Promise.all([
      getPhotosMeta()
        .then(({ count }) => count)
        .catch(() => 0),
      getPhotosMeta({ hidden: 'only' })
        .then(({ count }) => count)
        .catch(() => 0),
      getPhotosInNeedOfSyncCount(),
      getGitHubMetaForCurrentApp(),
      getStorageUploadUrlsNoStore()
        .then(urls => urls.length)
        .catch(e => {
          console.error(`Error getting blob upload urls: ${e}`);
          return 0;
        }),
      getUniqueTags()
        .then(tags => tags.length)
        .catch(() => 0),
      getUniqueRecipes()
        .then(recipes => recipes.length)
        .catch(() => 0),
    ]);

    const insightsIndicatorStatus = indicatorStatusForSignificantInsights({
      codeMeta,
      photosCountNeedSync,
    });

    const photosCountTotal = (
      photosCount !== undefined &&
      photosCountHidden !== undefined
    )
      ? photosCount + photosCountHidden
      : undefined;

    return {
      photosCount,
      photosCountHidden,
      photosCountNeedSync,
      photosCountTotal,
      uploadsCount,
      tagsCount,
      recipesCount,
      insightsIndicatorStatus,
    } as const;
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
