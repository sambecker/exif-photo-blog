import { safelyQuery } from '@/db/query';
import { sql } from '@/platforms/postgres';
import { Album, Albums } from '.';

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
      ${album.slug},
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
      slug=${album.slug},
      subhead=${album.subhead},
      description=${album.description},
      location_name=${album.locationName},
      latitude=${album.latitude},
      longitude=${album.longitude}
      updated_at=${(new Date()).toISOString()}
    WHERE id=${album.id}
  `, 'updateAlbum');

export const getAlbumFromSlug = (slug: string) =>
  safelyQuery(() => sql<Album>`
    SELECT * FROM albums WHERE slug=${slug}
  `.then(({ rows }) => rows[0])
  , 'getAlbum');

export const deleteAlbum = (id: string) =>
  safelyQuery(() => sql`
    DELETE FROM albums WHERE id=${id}
  `, 'deleteAlbum');

export const getAlbumsWithMeta = () =>
  safelyQuery(() => sql`
    SELECT 
      a.*,
      COALESCE(COUNT(ap.photo_id), 0) as count
    FROM albums a
    LEFT JOIN album_photo ap ON a.id = ap.album_id
    GROUP BY a.id
    ORDER BY a.created_at DESC
  `.then(({ rows }): Albums => rows.map(({
      count,
      ...album
    }) => ({
      album: album as Album,
      count: parseInt(count, 10),
      lastModified: album.updated_at as Date,
    })))
  , 'getAlbumsWithPhotoCounts');
