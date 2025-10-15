import { migrationForError } from './migration';
import { createPhotosTable } from '@/photo/query';
import sleep from '@/utility/sleep';
import { ADMIN_SQL_DEBUG_ENABLED } from '@/app/config';
import { createAlbumPhotoTable, createAlbumsTable } from '@/album/query';

// Safe wrapper intended for most queries with JIT migration/table creation
// Catches up to 3 migrations in older installations
export const safelyQuery = async <T>(
  callback: () => Promise<T>,
  queryLabel: string,
  queryOptions?: object,
): Promise<T> => {
  let result: T;

  const start = new Date();

  try {
    result = await callback();
  } catch (e: any) {
    // Catch 1st migration
    let migration = migrationForError(e);
    if (migration) {
      console.log(`Running Migration ${migration.label} ...`);
      await migration.run();
      try {
        result = await callback();
      } catch (e: any) {
        // Catch 2nd migration
        migration = migrationForError(e);
        if (migration) {
          console.log(`Running Migration ${migration.label} ...`);
          await migration.run();
          result = await callback();
        } else {
          try {
            result = await callback();
          } catch (e: any) {
            // Catch 3rd migration
            migration = migrationForError(e);
            if (migration) {
              console.log(`Running Migration ${migration.label} ...`);
              await migration.run();
              result = await callback();
            } else {
              throw e;
            }
          }
        }
      }
    } else if (/relation "photos" does not exist/i.test(e.message)) {
      // Create all tables if 'photos' doesn't exist
      console.log('Creating all tables ...');
      await createPhotosTable();
      await createAlbumsTable();
      await createAlbumPhotoTable();
      result = await callback();
    } else if (/relation "albums" does not exist/i.test(e.message)) {
      // Create albums tables if they don't exist
      console.log('Creating albums tables ...');
      await createAlbumsTable();
      await createAlbumPhotoTable();
      result = await callback();
    } else if (/endpoint is in transition/i.test(e.message)) {
      console.log(
        'SQL query error: endpoint is in transition (setting timeout)',
      );
      // Wait 5 seconds and try again
      await sleep(5000);
      try {
        result = await callback();
      } catch (e: any) {
        console.log(
          `SQL query error on retry (after 5000ms): ${e.message}`,
        );
        throw e;
      }
    } else {
      // Avoid re-logging common errors on initial installation
      if (/connect ECONNREFUSED/i.test(e.message)) {
        console.log('Database connection error');
      } else if (e.message !== 'The server does not support SSL connections') {
        console.log(`SQL query error (${queryLabel}): ${e.message}`, {
          error: e,
        });
      }
      throw e;
    }
  }

  if (ADMIN_SQL_DEBUG_ENABLED && queryLabel) {
    const time =
      (((new Date()).getTime() - start.getTime()) / 1000).toFixed(2);
    const message = `Debug query: ${queryLabel} (${time} seconds)`;
    if (queryOptions) {
      console.log(message, { options: queryOptions });
    } else {
      console.log(message);
    }
  }

  return result;
};
