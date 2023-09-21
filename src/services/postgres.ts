import { sql } from '@vercel/postgres';
import {
  PhotoDb,
  PhotoDbInsert,
  translatePhotoId,
  parsePhotoFromDb,
  Photo,
} from '@/photo';

const PHOTO_DEFAULT_LIMIT = 100;

export const convertArrayToPostgresString = (array?: string[]) => array
  ? `{${array.join(',')}}`
  : null;

const sqlCreatePhotosTable = () =>
  sql`
    CREATE TABLE IF NOT EXISTS photos (
      id VARCHAR(8) PRIMARY KEY,
      url VARCHAR(255) NOT NULL,
      extension VARCHAR(255) NOT NULL,
      aspect_ratio REAL DEFAULT 1.5,
      blur_data TEXT,
      title VARCHAR(255),
      tags VARCHAR(255)[],
      make VARCHAR(255),
      model VARCHAR(255),
      focal_length SMALLINT,
      focal_length_in_35mm_format SMALLINT,
      f_number REAL,
      iso SMALLINT,
      exposure_time DOUBLE PRECISION,
      exposure_compensation REAL,
      location_name VARCHAR(255),
      latitude DOUBLE PRECISION,
      longitude DOUBLE PRECISION,
      film_simulation VARCHAR(255),
      priority_order REAL,
      taken_at TIMESTAMP WITH TIME ZONE NOT NULL,
      taken_at_naive VARCHAR(255) NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

// Must provide id as 8-character nanoid
export const sqlInsertPhotoIntoDb = (photo: PhotoDbInsert) => {
  return sql`
    INSERT INTO photos (
      id,
      url,
      extension,
      aspect_ratio,
      blur_data,
      title,
      tags,
      make,
      model,
      focal_length,
      focal_length_in_35mm_format,
      f_number,
      iso,
      exposure_time,
      exposure_compensation,
      location_name,
      latitude,
      longitude,
      film_simulation,
      priority_order,
      taken_at,
      taken_at_naive
    )
    VALUES (
      ${photo.id},
      ${photo.url},
      ${photo.extension},
      ${photo.aspectRatio},
      ${photo.blurData},
      ${photo.title},
      ${convertArrayToPostgresString(photo.tags)},
      ${photo.make},
      ${photo.model},
      ${photo.focalLength},
      ${photo.focalLengthIn35MmFormat},
      ${photo.fNumber},
      ${photo.iso},
      ${photo.exposureTime},
      ${photo.exposureCompensation},
      ${photo.locationName},
      ${photo.latitude},
      ${photo.longitude},
      ${photo.filmSimulation},
      ${photo.priorityOrder},
      ${photo.takenAt},
      ${photo.takenAtNaive}
    )
  `;
};

export const sqlUpdatePhotoInDb = (photo: PhotoDbInsert) =>
  sql`
    UPDATE photos SET
    url=${photo.url},
    extension=${photo.extension},
    aspect_ratio=${photo.aspectRatio},
    blur_data=${photo.blurData},
    title=${photo.title},
    tags=${convertArrayToPostgresString(photo.tags)},
    make=${photo.make},
    model=${photo.model},
    focal_length=${photo.focalLength},
    focal_length_in_35mm_format=${photo.focalLengthIn35MmFormat},
    f_number=${photo.fNumber},
    iso=${photo.iso},
    exposure_time=${photo.exposureTime},
    exposure_compensation=${photo.exposureCompensation},
    location_name=${photo.locationName},
    latitude=${photo.latitude},
    longitude=${photo.longitude},
    film_simulation=${photo.filmSimulation},
    priority_order=${photo.priorityOrder || null},
    taken_at=${photo.takenAt},
    taken_at_naive=${photo.takenAtNaive},
    updated_at=${(new Date()).toISOString()}
    WHERE id=${photo.id}
  `;

export const sqlDeletePhoto = (id: string) =>
  sql`DELETE FROM photos WHERE id=${id}`;

const sqlGetPhotosFromDb = (
  limit = PHOTO_DEFAULT_LIMIT,
  offset = 0,
) =>
  sql<PhotoDb>`
    SELECT * FROM photos
    ORDER BY taken_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

const sqlGetPhotosFromDbSortedByCreatedAt = (
  limit = PHOTO_DEFAULT_LIMIT,
  offset = 0,
) =>
  sql<PhotoDb>`
    SELECT * FROM photos
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

const sqlGetPhotosFromDbSortedByPriority = (
  limit = PHOTO_DEFAULT_LIMIT,
  offset = 0,
) =>
  sql<PhotoDb>`
    SELECT * FROM photos
    ORDER BY priority_order ASC, taken_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

const sqlGetPhotosFromDbByTag = (
  limit = PHOTO_DEFAULT_LIMIT,
  offset = 0,
  tag: string,
) =>
  sql<PhotoDb>`
    SELECT * FROM photos WHERE ${tag}=ANY(tags)
    ORDER BY taken_at ASC
    LIMIT ${limit} OFFSET ${offset}
  `;

const sqlGetPhotosTakenAfterDateInclusive = (
  takenAt: Date,
  limit?: number,
) =>
  sql<PhotoDb>`
    SELECT * FROM photos
    WHERE taken_at <= ${takenAt.toISOString()}
    ORDER BY taken_at DESC
    LIMIT ${limit}
  `;

const sqlGetPhotosTakenBeforeDate = (
  takenAt: Date,
  limit?: number,
) =>
  sql<PhotoDb>`
    SELECT * FROM photos
    WHERE taken_at > ${takenAt.toISOString()}
    ORDER BY taken_at ASC
    LIMIT ${limit}
  `;

const sqlGetPhotoFromDb = (id: string) =>
  sql<PhotoDb>`SELECT * FROM photos WHERE id=${id} LIMIT 1`;

export type GetPhotosOptions = {
  sortBy?: 'createdAt' | 'takenAt' | 'priority'
  limit?: number
  offset?: number
  tag?: string
  takenBefore?: Date
  takenAfterInclusive?: Date
}

export const getPhotos = async (options: GetPhotosOptions = {}) => {
  const {
    sortBy = 'takenAt',
    limit,
    offset,
    tag,
    takenBefore,
    takenAfterInclusive,
  } = options;

  let photos;

  const getPhotosRequest = takenBefore
    ? () => sqlGetPhotosTakenBeforeDate(takenBefore, limit)
    : takenAfterInclusive
      ? () => sqlGetPhotosTakenAfterDateInclusive(takenAfterInclusive, limit)
      : tag
        ? () => sqlGetPhotosFromDbByTag(limit, offset, tag)
        : sortBy === 'createdAt'
          ? () => sqlGetPhotosFromDbSortedByCreatedAt(limit, offset)
          : sortBy === 'priority' 
            ? () => sqlGetPhotosFromDbSortedByPriority(limit, offset)
            : () => sqlGetPhotosFromDb(limit, offset);

  const getPhotosRequestAndParse = () =>
    getPhotosRequest().then(({ rows }) => rows.map(parsePhotoFromDb));

  try {
    photos = await getPhotosRequestAndParse();
  } catch (e: any) {
    if (/relation "photos" does not exist/i.test(e.message)) {
      console.log(
        'Creating table "photos" because it did not exist',
      );
      await sqlCreatePhotosTable();
      photos = await getPhotosRequestAndParse();
    } else if (/endpoint is in transition/i.test(e.message)) {
      // Wait 5 seconds and try again
      await new Promise(resolve => setTimeout(resolve, 5000));
      try {
        photos = await getPhotosRequestAndParse();
      } catch (e: any) {
        console.log(`sql get error on retry (after 5000ms): ${e.message} `);
        throw e;
      }
    } else {
      console.log(`sql get error: ${e.message} `);
      throw e;
    }
  }

  return photos;
};

export const getPhotosCount = async () => sql`
  SELECT COUNT(*) FROM photos
`.then(({ rows }) => parseInt(rows[0].count, 10));

export const getUniqueTags = async () => sql`
  SELECT DISTINCT unnest(tags) FROM photos
`.then(({ rows }) => rows.map(row => row.unnest as string));

export const getPhoto = async (id: string): Promise<Photo | undefined> => {
  // Check for photo id forwarding
  // and convert short ids to uuids
  const photoId = translatePhotoId(id);
  return sqlGetPhotoFromDb(photoId)
    .then(({ rows }) => rows.map(parsePhotoFromDb))
    .then(photos => photos.length > 0 ? photos[0] : undefined);
};
