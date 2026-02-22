import { sql } from '@/platforms/postgres';
import { About } from '.';

export const createAboutTable = () =>
  sql`
    CREATE TABLE IF NOT EXISTS about (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;

export const insertAbout = (about: About) =>
  sql`
    INSERT INTO about (
      title,
      description
    ) VALUES (
      ${about.title},
      ${about.description}
    )
  `;

export const updateAbout = (about: About) =>
  sql`
    UPDATE about SET
      title = ${about.title},
      description = ${about.description}
    WHERE id = ${about.id}
  `;

export const getAbout = () =>
  sql`
    SELECT * FROM about
  `.then(({ rows }) => rows[0] as About | undefined);
