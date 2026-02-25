import { sql } from '@/platforms/postgres';
import { About, AboutInsert } from '.';
import { safelyQuery } from '@/db/query';
import camelcaseKeys from 'camelcase-keys';

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

export const insertAbout = (about: AboutInsert) =>
  safelyQuery(() => sql`
    INSERT INTO about (
      title,
      subhead,
      description,
      photo_id_avatar,
      photo_id_hero
    ) VALUES (
      ${about.title},
      ${about.subhead},
      ${about.description},
      ${about.photoIdAvatar},
      ${about.photoIdHero}
    )
  `.then(({ rows }) => rows[0]?.id as number)
  , 'insertAbout');

export const updateAbout = (about: AboutInsert) =>
  safelyQuery(() => sql`
    UPDATE about SET
      title = ${about.title},
      subhead = ${about.subhead},
      description = ${about.description},
      photo_id_avatar = ${about.photoIdAvatar},
      photo_id_hero = ${about.photoIdHero}
      updated_at = ${new Date().toISOString()}
    WHERE id = ${about.id}
  `, 'updateAbout');

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