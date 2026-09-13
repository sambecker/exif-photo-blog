import { sql } from '@/platforms/postgres';
import { Library, LibraryInsert } from '.';
import { safelyQuery } from '@/db/query';
import camelcaseKeys from 'camelcase-keys';

const LIBRARY_ID = 1;

export const createLibraryTable = () =>
  sql`
    CREATE TABLE IF NOT EXISTS library (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      subhead TEXT,
      description TEXT,
      photo_id_avatar VARCHAR(8) REFERENCES photos(id),
      photo_id_hero VARCHAR(8) REFERENCES photos(id),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

export const upsertLibrary = (library: LibraryInsert) =>
  safelyQuery(() => sql`
    INSERT INTO library (
      id,
      title,
      subhead,
      description,
      photo_id_avatar,
      photo_id_hero,
      updated_at,
      created_at
    ) VALUES (
      ${LIBRARY_ID},
      ${library.title},
      ${library.subhead},
      ${library.description},
      ${library.photoIdAvatar},
      ${library.photoIdHero},
      ${new Date().toISOString()},
      ${new Date().toISOString()}
    )
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      subhead = EXCLUDED.subhead,
      description = EXCLUDED.description,
      photo_id_avatar = EXCLUDED.photo_id_avatar,
      photo_id_hero = EXCLUDED.photo_id_hero,
      updated_at = CURRENT_TIMESTAMP
    RETURNING id
  `.then(({ rows }) => rows[0]?.id as number)
  , 'insertLibrary');

export const getLibrary = () =>
  safelyQuery(() => sql`
    SELECT * FROM library LIMIT 1
  `.then(({ rows }) => rows[0]
      ? camelcaseKeys(
        rows[0] as unknown as Record<string, unknown>,
      ) as unknown as Library
      : undefined,
    )
  , 'getLibrary');
