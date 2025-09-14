import { safelyQuery } from '@/db/query';
import { sql } from '@/platforms/postgres';
import { Album } from '.';
import { parameterize } from '@/utility/string';

export const createAlbumsTable = () =>
  sql`
    CREATE TABLE IF NOT EXISTS albums (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      subhead TEXT,
      description TEXT,
      location_name VARCHAR(255),
      latitude DOUBLE PRECISION,
      longitude DOUBLE PRECISION,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

export const createAlbumPhotoTable = () =>
  sql`
    CREATE TABLE IF NOT EXISTS album_photo (
      album_id uuid NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
      photo_id VARCHAR(8) NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
      sort_order SMALLINT NOT NULL DEFAULT 0,
      PRIMARY KEY (album_id, photo_id)
    )
  `;

export const insertAlbum = (album: Album) =>
  safelyQuery(() => sql`
    INSERT INTO albums (
      title,
      slug,
      subhead,
      description,
      location_name,
      latitude,
      longitude
    ) VALUES (
      ${album.title},
      ${parameterize(album.title)},
      ${album.subhead},
      ${album.description},
      ${album.locationName},
      ${album.latitude},
      ${album.longitude},
    )
  `, 'insertAlbum');

export const updateAlbum = (album: Album) =>
  safelyQuery(() => sql`
    UPDATE albums SET
      title=${album.title},
      slug=${parameterize(album.title)},
      subhead=${album.subhead},
      description=${album.description},
      location_name=${album.locationName},
      latitude=${album.latitude},
      longitude=${album.longitude}
      updated_at=${(new Date()).toISOString()}
    WHERE id=${album.id}
  `, 'updateAlbum');

export const deleteAlbum = (id: string) =>
  safelyQuery(() => sql`
    DELETE FROM albums WHERE id=${id}
  `, 'deleteAlbum');

export const getAlbums = () =>
  safelyQuery(() => sql<Album>`
    SELECT * FROM albums
  `.then(({ rows }) => rows)
  , 'getAlbums');
