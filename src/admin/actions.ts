'use server';

import { runAuthenticatedAdminServerAction } from '@/auth';
import { testOpenAiConnection } from '@/services/openai';
import { testDatabaseConnection } from '@/services/postgres';
import { testStorageConnection } from '@/services/storage';
import { CONFIG_CHECKLIST_STATUS } from '@/site/config';

const scanForError = (
  shouldCheck: boolean,
  promise: () => Promise<any>
): Promise<string> =>
  shouldCheck
    ? promise().then(() => '').catch(error => error.message)
    : Promise.resolve('');

export const testConnectionsAction = async () =>
  runAuthenticatedAdminServerAction(async () => {
    const {
      hasDatabase,
      hasStorageProvider,
      isAiTextGenerationEnabled,
    } = CONFIG_CHECKLIST_STATUS;

    const [
      databaseError,
      storageError,
      aiError,
    ] = await Promise.all([
      scanForError(hasDatabase, testDatabaseConnection),
      scanForError(hasStorageProvider, testStorageConnection),
      scanForError(isAiTextGenerationEnabled, testOpenAiConnection),
    ]);

    return {
      databaseError,
      storageError,
      aiError,
    };
  });
