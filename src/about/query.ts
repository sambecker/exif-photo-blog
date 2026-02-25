import { sql } from '@/platforms/postgres';
import { About, AboutInsert } from '.';
import { safelyQuery } from '@/db/query';
import camelcaseKeys from 'camelcase-keys';

const ABOUT_ID = 1;

export const createAboutTable = () =>
  sql`
    CREATE TABLE IF NOT EXISTS about (
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

export const upsertAbout = (about: AboutInsert) =>
  safelyQuery(() => sql`
    INSERT INTO about (
      id,
      title,
      subhead,
      description,
      photo_id_avatar,
      photo_id_hero,
      updated_at,
      created_at
    ) VALUES (
      ${ABOUT_ID},
      ${about.title},
      ${about.subhead},
      ${about.description},
      ${about.photoIdAvatar},
      ${about.photoIdHero},
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
  , 'insertAbout');

export const getAbout = () =>
  safelyQuery(() => sql`
    SELECT * FROM about LIMIT 1
  `.then(({ rows }) => rows[0]
      ? camelcaseKeys(
        rows[0] as unknown as Record<string, unknown>,
      ) as unknown as About
      : undefined,
    )
  , 'getAbout');
