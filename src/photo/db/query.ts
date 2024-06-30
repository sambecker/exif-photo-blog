import {
  sql,
  query,
  convertArrayToPostgresString,
} from '@/services/postgres';
import {
  PhotoDb,
  PhotoDbInsert,
  translatePhotoId,
  parsePhotoFromDb,
  Photo,
  PhotoDateRange,
} from '@/photo';
import { Cameras, createCameraKey } from '@/camera';
import { Tags } from '@/tag';
import { FilmSimulation, FilmSimulations } from '@/simulation';
import { SHOULD_DEBUG_SQL } from '@/site/config';
import {
  GetPhotosOptions,
  getLimitAndOffsetFromOptions,
  getOrderByFromOptions,
} from '.';
import { getWheresFromOptions } from '.';
import { FocalLengths } from '@/focal';
import { Lenses, createLensKey } from '@/lens';

const createPhotosTable = () =>
  sql`
    CREATE TABLE IF NOT EXISTS photos (
      id VARCHAR(8) PRIMARY KEY,
      url VARCHAR(255) NOT NULL,
      extension VARCHAR(255) NOT NULL,
      aspect_ratio REAL DEFAULT 1.5,
      blur_data TEXT,
      title VARCHAR(255),
      caption TEXT,
      semantic_description TEXT,
      tags VARCHAR(255)[],
      make VARCHAR(255),
      model VARCHAR(255),
      focal_length SMALLINT,
      focal_length_in_35mm_format SMALLINT,
      lens_make VARCHAR(255),
      lens_model VARCHAR(255),
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
      hidden BOOLEAN,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

// Migration 01
const MIGRATION_FIELDS_01 = ['caption', 'semantic_description'];
const runMigration01 = () =>
  sql`
    ALTER TABLE photos
    ADD COLUMN IF NOT EXISTS caption TEXT,
    ADD COLUMN IF NOT EXISTS semantic_description TEXT
  `;

// Migration 02
const MIGRATION_FIELDS_02 = ['lens_make', 'lens_model'];
const runMigration02 = () =>
  sql`
    ALTER TABLE photos
    ADD COLUMN IF NOT EXISTS lens_make VARCHAR(255),
    ADD COLUMN IF NOT EXISTS lens_model VARCHAR(255)
  `;

// Wrapper for most queries for JIT table creation/migration running
const safelyQueryPhotos = async <T>(
  callback: () => Promise<T>,
  debugMessage: string
): Promise<T> => {
  let result: T;

  const start = new Date();

  try {
    result = await callback();
  } catch (e: any) {
    if (MIGRATION_FIELDS_01.some(field => new RegExp(
      `column "${field}" of relation "photos" does not exist`,
      'i',
    ).test(e.message))) {
      console.log('Running migration 01 ...');
      await runMigration01();
      result = await callback();
    } else if (MIGRATION_FIELDS_02.some(field => new RegExp(
      `column "${field}" of relation "photos" does not exist`,
      'i',
    ).test(e.message))) {
      console.log('Running migration 02 ...');
      await runMigration02();
      result = await callback();
    } else if (/relation "photos" does not exist/i.test(e.message)) {
      // If the table does not exist, create it
      console.log('Creating photos table ...');
      await createPhotosTable();
      result = await callback();
    } else if (/endpoint is in transition/i.test(e.message)) {
      console.log('sql get error: endpoint is in transition (setting timeout)');
      // Wait 5 seconds and try again
      await new Promise(resolve => setTimeout(resolve, 5000));
      try {
        result = await callback();
      } catch (e: any) {
        console.log(`sql get error on retry (after 5000ms): ${e.message} `);
        throw e;
      }
    } else {
      console.log(`sql get error: ${e.message} `);
      throw e;
    }
  }

  if (SHOULD_DEBUG_SQL && debugMessage) {
    const time =
      (((new Date()).getTime() - start.getTime()) / 1000).toFixed(2);
    console.log(`Executing sql query: ${debugMessage} (${time} seconds)`);
  }

  return result;
};

// Must provide id as 8-character nanoid
export const insertPhoto = (photo: PhotoDbInsert) =>
  safelyQueryPhotos(() => sql`
    INSERT INTO photos (
      id,
      url,
      extension,
      aspect_ratio,
      blur_data,
      title,
      caption,
      semantic_description,
      tags,
      make,
      model,
      focal_length,
      focal_length_in_35mm_format,
      lens_make,
      lens_model,
      f_number,
      iso,
      exposure_time,
      exposure_compensation,
      location_name,
      latitude,
      longitude,
      film_simulation,
      priority_order,
      hidden,
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
      ${photo.caption},
      ${photo.semanticDescription},
      ${convertArrayToPostgresString(photo.tags)},
      ${photo.make},
      ${photo.model},
      ${photo.focalLength},
      ${photo.focalLengthIn35MmFormat},
      ${photo.lensMake},
      ${photo.lensModel},
      ${photo.fNumber},
      ${photo.iso},
      ${photo.exposureTime},
      ${photo.exposureCompensation},
      ${photo.locationName},
      ${photo.latitude},
      ${photo.longitude},
      ${photo.filmSimulation},
      ${photo.priorityOrder},
      ${photo.hidden},
      ${photo.takenAt},
      ${photo.takenAtNaive}
    )
  `, 'insertPhoto');

export const updatePhoto = (photo: PhotoDbInsert) =>
  safelyQueryPhotos(() => sql`
    UPDATE photos SET
    url=${photo.url},
    extension=${photo.extension},
    aspect_ratio=${photo.aspectRatio},
    blur_data=${photo.blurData},
    title=${photo.title},
    caption=${photo.caption},
    semantic_description=${photo.semanticDescription},
    tags=${convertArrayToPostgresString(photo.tags)},
    make=${photo.make},
    model=${photo.model},
    focal_length=${photo.focalLength},
    focal_length_in_35mm_format=${photo.focalLengthIn35MmFormat},
    lens_make=${photo.lensMake},
    lens_model=${photo.lensModel},
    f_number=${photo.fNumber},
    iso=${photo.iso},
    exposure_time=${photo.exposureTime},
    exposure_compensation=${photo.exposureCompensation},
    location_name=${photo.locationName},
    latitude=${photo.latitude},
    longitude=${photo.longitude},
    film_simulation=${photo.filmSimulation},
    priority_order=${photo.priorityOrder || null},
    hidden=${photo.hidden},
    taken_at=${photo.takenAt},
    taken_at_naive=${photo.takenAtNaive},
    updated_at=${(new Date()).toISOString()}
    WHERE id=${photo.id}
  `, 'updatePhoto');

export const deletePhotoTagGlobally = (tag: string) =>
  safelyQueryPhotos(() => sql`
    UPDATE photos
    SET tags=ARRAY_REMOVE(tags, ${tag})
    WHERE ${tag}=ANY(tags)
  `, 'deletePhotoTagGlobally');

export const renamePhotoTagGlobally = (tag: string, updatedTag: string) =>
  safelyQueryPhotos(() => sql`
    UPDATE photos
    SET tags=ARRAY_REPLACE(tags, ${tag}, ${updatedTag})
    WHERE ${tag}=ANY(tags)
  `, 'renamePhotoTagGlobally');

export const deletePhoto = (id: string) =>
  safelyQueryPhotos(() => sql`
    DELETE FROM photos WHERE id=${id}
  `, 'deletePhoto');

export const getPhotosMostRecentUpdate = async () =>
  safelyQueryPhotos(() => sql`
    SELECT updated_at FROM photos ORDER BY updated_at DESC LIMIT 1
  `.then(({ rows }) => rows[0] ? rows[0].updated_at as Date : undefined)
  , 'getPhotosMostRecentUpdate');

export const getUniqueTags = async () =>
  safelyQueryPhotos(() => sql`
    SELECT DISTINCT unnest(tags) as tag, COUNT(*)
    FROM photos
    WHERE hidden IS NOT TRUE
    GROUP BY tag
    ORDER BY tag ASC
  `.then(({ rows }): Tags => rows.map(({ tag, count }) => ({
      tag: tag as string,
      count: parseInt(count, 10),
    })))
  , 'getUniqueTags');

export const getUniqueTagsHidden = async () =>
  safelyQueryPhotos(() => sql`
    SELECT DISTINCT unnest(tags) as tag, COUNT(*)
    FROM photos
    GROUP BY tag
    ORDER BY tag ASC
  `.then(({ rows }): Tags => rows.map(({ tag, count }) => ({
      tag: tag as string,
      count: parseInt(count, 10),
    })))
  , 'getUniqueTagsHidden');

export const getUniqueCameras = async () =>
  safelyQueryPhotos(() => sql`
    SELECT DISTINCT make||' '||model as camera, make, model, COUNT(*)
    FROM photos
    WHERE hidden IS NOT TRUE
    AND trim(make) <> ''
    AND trim(model) <> ''
    GROUP BY make, model
    ORDER BY camera ASC
  `.then(({ rows }): Cameras => rows.map(({ make, model, count }) => ({
      cameraKey: createCameraKey({ make, model }),
      camera: { make, model },
      count: parseInt(count, 10),
    })))
  , 'getUniqueCameras');

export const getUniqueLenses = async () =>
  safelyQueryPhotos(() => sql`
    SELECT DISTINCT lens_make||' '||lens_model as lens,
    lens_make, lens_model, COUNT(*)
    FROM photos
    WHERE hidden IS NOT TRUE
    AND trim(lens_make) <> ''
    AND trim(lens_model) <> ''
    GROUP BY lens_make, lens_model
    ORDER BY lens ASC
  `.then(({ rows }): Lenses => rows
      .map(({ lens_make: make, lens_model: model, count }) => ({
        lensKey: createLensKey({ make, model }),
        lens: { make, model },
        count: parseInt(count, 10),
      })))
  , 'getUniqueCameras');

export const getUniqueFilmSimulations = async () =>
  safelyQueryPhotos(() => sql`
    SELECT DISTINCT film_simulation, COUNT(*)
    FROM photos
    WHERE hidden IS NOT TRUE AND film_simulation IS NOT NULL
    GROUP BY film_simulation
    ORDER BY film_simulation ASC
  `.then(({ rows }): FilmSimulations => rows
      .map(({ film_simulation, count }) => ({
        simulation: film_simulation as FilmSimulation,
        count: parseInt(count, 10),
      })))
  , 'getUniqueFilmSimulations');

export const getUniqueFocalLengths = async () =>
  safelyQueryPhotos(() => sql`
    SELECT DISTINCT focal_length, COUNT(*)
    FROM photos
    WHERE hidden IS NOT TRUE AND focal_length IS NOT NULL
    GROUP BY focal_length
    ORDER BY focal_length ASC
  `.then(({ rows }): FocalLengths => rows
      .map(({ focal_length, count }) => ({
        focal: parseInt(focal_length, 10),
        count: parseInt(count, 10),
      })))
  , 'getUniqueFocalLengths');

export const getPhotos = async (options: GetPhotosOptions = {}) =>
  safelyQueryPhotos(async () => {
    const sql = ['SELECT * FROM photos'];
    const values = [] as (string | number)[];

    const {
      wheres,
      wheresValues,
      lastValuesIndex,
    } = getWheresFromOptions(options);

    let valuesIndex = lastValuesIndex;
    
    if (wheres) {
      sql.push(wheres);
      values.push(...wheresValues);
    }

    sql.push(getOrderByFromOptions(options));

    const {
      limitAndOffset,
      limitAndOffsetValues,
    } = getLimitAndOffsetFromOptions(options, valuesIndex);

    // LIMIT + OFFSET
    sql.push(limitAndOffset);
    values.push(...limitAndOffsetValues);

    return query(sql.join(' '), values)
      .then(({ rows }) => rows.map(parsePhotoFromDb));
  }, 'getPhotos');

export const getPhotosNearId = async (
  photoId: string,
  options: GetPhotosOptions,
) =>
  safelyQueryPhotos(async () => {
    const { limit } = options;

    const {
      wheres,
      wheresValues,
      lastValuesIndex,
    } = getWheresFromOptions(options);

    let valuesIndex = lastValuesIndex;

    return query(
      `
        WITH twi AS (
          SELECT *, row_number()
          OVER (${getOrderByFromOptions(options)}) as row_number
          FROM photos
          ${wheres}
        ),
        current AS (SELECT row_number FROM twi WHERE id = $${valuesIndex++})
        SELECT twi.*
        FROM twi, current
        WHERE twi.row_number >= current.row_number - 1
        LIMIT $${valuesIndex++}
      `,
      [...wheresValues, photoId, limit]
    )
      .then(({ rows }) => {
        const photo = rows.find(({ id }) => id === photoId);
        const indexNumber = photo ? parseInt(photo.row_number) : undefined;
        return {
          photos: rows.map(parsePhotoFromDb),
          indexNumber,
        };
      });
  }, `getPhotosNearId: ${photoId}`);    

export const getPhotosMeta = (options: GetPhotosOptions = {}) =>
  safelyQueryPhotos(async () => {
    // eslint-disable-next-line max-len
    let sql = 'SELECT COUNT(*), MIN(taken_at_naive) as start, MAX(taken_at_naive) as end FROM photos';
    const { wheres, wheresValues } = getWheresFromOptions(options);
    if (wheres) { sql += ` ${wheres}`; }
    return query(sql, wheresValues)
      .then(({ rows }) => ({
        count: parseInt(rows[0].count, 10),
        ...rows[0]?.start && rows[0]?.end
          ? { dateRange: rows[0] as PhotoDateRange }
          : undefined,
      }));
  }, 'getPhotosMeta');

export const getPhotoIds = async ({ limit }: { limit?: number }) =>
  safelyQueryPhotos(() => (limit
    ? sql`SELECT id FROM photos LIMIT ${limit}`
    : sql`SELECT id FROM photos`)
    .then(({ rows }) => rows.map(({ id }) => id as string))
  , 'getPhotoIds');

export const getPhoto = async (
  id: string,
  includeHidden?: boolean,
): Promise<Photo | undefined> =>
  safelyQueryPhotos(async () => {
    // Check for photo id forwarding and convert short ids to uuids
    const photoId = translatePhotoId(id);
    return (includeHidden
      ? sql<PhotoDb>`SELECT * FROM photos WHERE id=${photoId} LIMIT 1`
      // eslint-disable-next-line max-len
      : sql<PhotoDb>`SELECT * FROM photos WHERE id=${photoId} AND hidden IS NOT TRUE LIMIT 1`)
      .then(({ rows }) => rows.map(parsePhotoFromDb))
      .then(photos => photos.length > 0 ? photos[0] : undefined);
  }, 'getPhoto');
