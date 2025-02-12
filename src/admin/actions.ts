'use server';

import { runAuthenticatedAdminServerAction } from '@/auth';
import { testKvConnection } from '@/services/kv';
import { testOpenAiConnection } from '@/services/openai';
import { testDatabaseConnection } from '@/services/postgres';
import { testStorageConnection } from '@/services/storage';
import { APP_CONFIGURATION } from '@/app-core/config';

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
      hasVercelKv,
      isAiTextGenerationEnabled,
    } = APP_CONFIGURATION;

    const [
      databaseError,
      storageError,
      kvError,
      aiError,
    ] = await Promise.all([
      scanForError(hasDatabase, testDatabaseConnection),
      scanForError(hasStorageProvider, testStorageConnection),
      scanForError(hasVercelKv, testKvConnection),
      scanForError(isAiTextGenerationEnabled, testOpenAiConnection),
    ]);

    return {
      databaseError,
      storageError,
      kvError,
      aiError,
    };
  });
