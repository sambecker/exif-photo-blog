import { safelyQuery } from '@/db/query';
import { query, sql } from '@/platforms/postgres';
import { generateManyToManyValues } from '@/db';
import { Album, Albums, parseAlbumFromDb } from '.';

export const createAlbumsTable = () =>
  sql`
    CREATE TABLE IF NOT EXISTS albums (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      subhead TEXT,
      description TEXT,
      location JSONB,
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

export const insertAlbum = (album: Omit<Album, 'id'>) =>
  safelyQuery(() => sql`
    INSERT INTO albums (
      title,
      slug,
      subhead,
      description,
      location
    ) VALUES (
      ${album.title},
      ${album.slug},
      ${album.subhead},
      ${album.description},
      ${album.location
        ? JSON.stringify(album.location)
        : null}
    )
    RETURNING id
  `.then(({ rows }) => rows[0]?.id as string)
  , 'insertAlbum');

export const updateAlbum = (album: Album) =>
  safelyQuery(() => sql`
    UPDATE albums SET
      title=${album.title},
      slug=${album.slug},
      subhead=${album.subhead},
      description=${album.description},
      location=${album.location
        ? JSON.stringify(album.location)
        : null},
      updated_at=${(new Date()).toISOString()}
    WHERE id=${album.id}
  `, 'updateAlbum');

export const getAlbumFromSlug = (slug: string) =>
  safelyQuery(() => sql<Album>`
    SELECT * FROM albums WHERE slug=${slug}
  `.then(({ rows }) => rows[0] ? parseAlbumFromDb(rows[0]) : undefined)
  , 'getAlbumFromSlug');

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
      album: parseAlbumFromDb(album),
      count: parseInt(count, 10),
      lastModified: album.updated_at as Date,
    })))
  , 'getAlbumsWithMeta');

export const clearPhotoAlbumIds = (photoId: string) =>
  safelyQuery(() => sql`
    DELETE FROM album_photo WHERE photo_id=${photoId}
  `, 'clearPhotoAlbumIds');

export const addPhotoAlbumIds = (photoIds: string[], albumIds: string[]) => {
  if (photoIds.length > 0 && albumIds.length > 0) {
    const {
      valueString,
      values,
    } = generateManyToManyValues(albumIds, photoIds);
    return safelyQuery(() => query(`
      INSERT INTO album_photo (album_id, photo_id)
      ${valueString}
      ON CONFLICT (album_id, photo_id) DO NOTHING
    `, values)
    , 'addPhotoAlbumIds');
  }
};

export const addPhotoAlbumId = (photoId: string, albumId: string) =>
  addPhotoAlbumIds([photoId], [albumId]);

export const getAlbumTitlesForPhoto = (photoId: string) =>
  safelyQuery(() => sql<{ title: string }>`
    SELECT a.title FROM albums a
    JOIN album_photo ap ON a.id = ap.album_id
    WHERE ap.photo_id=${photoId}
  `.then(({ rows }) => rows.map(({ title }) => title))
  , 'getAlbumTitlesForPhoto');

export const getTagsForAlbum = (albumId: string) =>
  safelyQuery(() => sql`
    SELECT DISTINCT unnest(p.tags) as tag
    FROM photos p
    LEFT JOIN album_photo ap ON p.id = ap.photo_id
    WHERE album_id=${albumId}
  `.then(({ rows }) => rows.map(({ tag }) => tag))
  , 'getTagsForAlbum');
