/* eslint-disable quotes */
import {
  sql,
  query,
  convertArrayToPostgresString,
} from '@/platforms/postgres';
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
import { Films } from '@/film';
import {
  ADMIN_SQL_DEBUG_ENABLED,
  AI_TEXT_AUTO_GENERATED_FIELDS,
  AI_CONTENT_GENERATION_ENABLED,
  COLOR_SORT_ENABLED,
} from '@/app/config';
import {
  PhotoQueryOptions,
  getOrderByFromOptions,
  getLimitAndOffsetFromOptions,
  getWheresFromOptions,
} from '.';
import { FocalLengths } from '@/focal';
import { Lenses, createLensKey } from '@/lens';
import { migrationForError } from './migration';
import {
  UPDATE_QUERY_LIMIT,
  UPDATED_BEFORE_01,
  UPDATED_BEFORE_02,
} from '../update';
import { MAKE_FUJIFILM } from '@/platforms/fujifilm';
import { Recipes } from '@/recipe';
import { Years } from '@/years';
import { PhotoColorData } from '../color/client';

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
      film VARCHAR(255),
      recipe_title VARCHAR(255),
      recipe_data JSONB,
      color_data JSONB,
      color_sort SMALLINT,
      priority_order REAL,
      taken_at TIMESTAMP WITH TIME ZONE NOT NULL,
      taken_at_naive VARCHAR(255) NOT NULL,
      exclude_from_feeds BOOLEAN DEFAULT FALSE,
      hidden BOOLEAN DEFAULT FALSE,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

// Safe wrapper intended for most queries with JIT migration/table creation
// Catches up to 3 migrations in older installations
const safelyQueryPhotos = async <T>(
  callback: () => Promise<T>,
  queryLabel: string,
  queryOptions?: PhotoQueryOptions,
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
      // If table doesn't exist, create it
      console.log('Creating photos table ...');
      await createPhotosTable();
      result = await callback();
    } else if (/endpoint is in transition/i.test(e.message)) {
      console.log(
        'SQL query error: endpoint is in transition (setting timeout)',
      );
      // Wait 5 seconds and try again
      await new Promise(resolve => setTimeout(resolve, 5000));
      try {
        result = await callback();
      } catch (e: any) {
        console.log(
          `SQL query error on retry (after 5000ms): ${e.message}`,
        );
        throw e;
      }
    } else {
      // Avoid re-logging errors on initial installation
      if (e.message !== 'The server does not support SSL connections') {
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
      film,
      recipe_title,
      recipe_data,
      color_data,
      color_sort,
      priority_order,
      exclude_from_feeds,
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
      ${photo.film},
      ${photo.recipeTitle},
      ${photo.recipeData},
      ${photo.colorData},
      ${photo.colorSort},
      ${photo.priorityOrder},
      ${photo.excludeFromFeeds},
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
    film=${photo.film},
    recipe_title=${photo.recipeTitle},
    recipe_data=${photo.recipeData},
    color_data=${photo.colorData},
    color_sort=${photo.colorSort},
    priority_order=${photo.priorityOrder || null},
    exclude_from_feeds=${photo.excludeFromFeeds},
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

export const addTagsToPhotos = (tags: string[], photoIds: string[]) =>
  safelyQueryPhotos(() => query(`
    UPDATE photos 
    SET tags = (
      SELECT array_agg(DISTINCT elem)
      FROM unnest(
        array_cat(tags, $1)
      ) AS elem
    )
    WHERE id = ANY($2)
  `, [
    convertArrayToPostgresString(tags),
    convertArrayToPostgresString(photoIds),
  ]), 'addTagsToPhotos');

export const deletePhotoRecipeGlobally = (recipe: string) =>
  safelyQueryPhotos(() => sql`
    UPDATE photos
    SET recipe_title=NULL
    WHERE recipe_title=${recipe}
  `, 'deletePhotoRecipeGlobally');

export const renamePhotoRecipeGlobally = (
  recipe: string,
  updatedRecipe: string,
) =>
  safelyQueryPhotos(() => sql`
    UPDATE photos
    SET recipe_title=${updatedRecipe}
    WHERE recipe_title=${recipe}
  `, 'renamePhotoRecipeGlobally');

export const deletePhoto = (id: string) =>
  safelyQueryPhotos(() => sql`
    DELETE FROM photos WHERE id=${id}
  `, 'deletePhoto');

export const getPhotosMostRecentUpdate = async () =>
  safelyQueryPhotos(() => sql`
    SELECT updated_at FROM photos ORDER BY updated_at DESC LIMIT 1
  `.then(({ rows }) => rows[0] ? rows[0].updated_at as Date : undefined)
  , 'getPhotosMostRecentUpdate');

export const getUniqueCameras = async () =>
  safelyQueryPhotos(() => sql`
    SELECT DISTINCT make||' '||model as camera, make, model,
      COUNT(*),
      MAX(updated_at) as last_modified
    FROM photos
    WHERE hidden IS NOT TRUE
    AND trim(make) <> ''
    AND trim(model) <> ''
    GROUP BY make, model
    ORDER BY camera ASC
  `.then(({ rows }): Cameras => rows.map(({
      make, model, count, last_modified,
    }) => ({
      cameraKey: createCameraKey({ make, model }),
      camera: { make, model },
      count: parseInt(count, 10), 
      lastModified: last_modified as Date,
    })))
  , 'getUniqueCameras');

export const getUniqueLenses = async () =>
  safelyQueryPhotos(() => sql`
    SELECT DISTINCT lens_make||' '||lens_model as lens,
      lens_make, lens_model,
      COUNT(*),
      MAX(updated_at) as last_modified
    FROM photos
    WHERE hidden IS NOT TRUE
    AND trim(lens_model) <> ''
    GROUP BY lens_make, lens_model
    ORDER BY lens ASC
  `.then(({ rows }): Lenses => rows
      .map(({ lens_make: make, lens_model: model, count, last_modified }) => ({
        lensKey: createLensKey({ make, model }),
        lens: { make, model },
        count: parseInt(count, 10), 
        lastModified: last_modified as Date,
      })))
  , 'getUniqueLenses');

export const getUniqueTags = async () =>
  safelyQueryPhotos(() => sql`
    SELECT DISTINCT unnest(tags) as tag,
      COUNT(*),
      MAX(updated_at) as last_modified
    FROM photos
    WHERE hidden IS NOT TRUE
    GROUP BY tag
    ORDER BY tag ASC
  `.then(({ rows }): Tags => rows.map(({ tag, count, last_modified }) => ({
      tag,
      count: parseInt(count, 10),
      lastModified: last_modified as Date,
    })))
  , 'getUniqueTags');

export const getUniqueRecipes = async () =>
  safelyQueryPhotos(() => sql`
    SELECT DISTINCT recipe_title,
      COUNT(*),
      MAX(updated_at) as last_modified
    FROM photos
    WHERE hidden IS NOT TRUE AND recipe_title IS NOT NULL
    GROUP BY recipe_title
    ORDER BY recipe_title ASC
  `.then(({ rows }): Recipes => rows
      .map(({ recipe_title, count, last_modified }) => ({
        recipe: recipe_title,
        count: parseInt(count, 10),
        lastModified: last_modified as Date,
      })))
  , 'getUniqueRecipes');

export const getUniqueYears = async () =>
  safelyQueryPhotos(() => sql`
    SELECT
      DISTINCT EXTRACT(YEAR FROM taken_at) AS year,
      COUNT(*),
      MAX(updated_at) as last_modified
    FROM photos
    WHERE hidden IS NOT TRUE
    GROUP BY year
    ORDER BY year DESC
  `.then(({ rows }): Years => rows.map(({ year, count, last_modified }) => ({
      year,
      count: parseInt(count, 10),
      lastModified: last_modified as Date,
    }))), 'getUniqueYears');

export const getRecipeTitleForData = async (
  data: string | object,
  film: string,
) =>
  // Includes legacy check on pre-stringified JSON
  safelyQueryPhotos(() => sql`
    SELECT recipe_title FROM photos
    WHERE hidden IS NOT TRUE
    AND recipe_data=${typeof data === 'string' ? data : JSON.stringify(data)}
    AND film=${film}
    LIMIT 1
  `
    .then(({ rows }) => rows[0]?.recipe_title as string | undefined)
  , 'getRecipeTitleForData');

export const getPhotosNeedingRecipeTitleCount = async (
  data: string,
  film: string,
  photoIdToExclude?: string,
) =>
  safelyQueryPhotos(() => sql`
    SELECT COUNT(*)
    FROM photos
    WHERE recipe_title IS NULL
    AND recipe_data=${data}
    AND film=${film}
    AND id <> ${photoIdToExclude}
  `.then(({ rows }) => parseInt(rows[0].count, 10))
  , 'getPhotosNeedingRecipeTitleCount');

export const updateAllMatchingRecipeTitles = (
  title: string,
  data: string,
  film: string,
) =>
  safelyQueryPhotos(() => sql`
    UPDATE photos
    SET recipe_title=${title}
    WHERE recipe_title IS NULL
    AND recipe_data=${data}
    AND film=${film}
  `, 'updateAllMatchingRecipeTitles');

export const getUniqueFilms = async () =>
  safelyQueryPhotos(() => sql`
    SELECT DISTINCT film,
      COUNT(*),
      MAX(updated_at) as last_modified
    FROM photos
    WHERE hidden IS NOT TRUE AND film IS NOT NULL
    GROUP BY film
    ORDER BY film ASC
  `.then(({ rows }): Films => rows
      .map(({ film, count, last_modified }) => ({
        film,
        count: parseInt(count, 10),
        lastModified: last_modified as Date,
      })))
  , 'getUniqueFilms');

export const getUniqueFocalLengths = async () =>
  safelyQueryPhotos(() => sql`
    SELECT DISTINCT focal_length,
      COUNT(*),
      MAX(updated_at) as last_modified
    FROM photos
    WHERE hidden IS NOT TRUE AND focal_length IS NOT NULL
    GROUP BY focal_length
    ORDER BY focal_length ASC
  `.then(({ rows }): FocalLengths => rows
      .map(({ focal_length, count, last_modified }) => ({
        focal: parseInt(focal_length, 10),
        count: parseInt(count, 10),
        lastModified: last_modified as Date,
      })))
  , 'getUniqueFocalLengths');

export const getPhotos = async (options: PhotoQueryOptions = {}) =>
  safelyQueryPhotos(async () => {
    const sql = ['SELECT * FROM photos'];
    const values = [] as (string | number)[];

    const {
      wheres,
      wheresValues,
      lastValuesIndex,
    } = getWheresFromOptions(options);
    
    if (wheres) {
      sql.push(wheres);
      values.push(...wheresValues);
    }

    sql.push(getOrderByFromOptions(options));

    const {
      limitAndOffset,
      limitAndOffsetValues,
    } = getLimitAndOffsetFromOptions(options, lastValuesIndex);

    // LIMIT + OFFSET
    sql.push(limitAndOffset);
    values.push(...limitAndOffsetValues);

    return query(sql.join(' '), values)
      .then(({ rows }) => rows.map(parsePhotoFromDb));
  },
  'getPhotos',
  // Seemingly necessary to pass `options` for expected cache behavior
  options,
  );

export const getPhotosNearId = async (
  photoId: string,
  options: PhotoQueryOptions,
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
      [...wheresValues, photoId, limit],
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

export const getPhotosMeta = (options: PhotoQueryOptions = {}) =>
  safelyQueryPhotos(async () => {
    // eslint-disable-next-line max-len
    let sql = 'SELECT COUNT(*), MIN(taken_at_naive) as start, MAX(taken_at_naive) as end FROM photos';
    const { wheres, wheresValues } = getWheresFromOptions(options);
    if (wheres) { sql += ` ${wheres}`; }
    return query(sql, wheresValues)
      .then(({ rows }) => ({
        count: parseInt(rows[0].count, 10),
        ...rows[0]?.start && rows[0]?.end
          ? { dateRange: {
            start: rows[0].start as string,
            end: rows[0].end as string,
          } as PhotoDateRange }
          : undefined,
      }));
  }, 'getPhotosMeta');

export const getPublicPhotoIds = async ({ limit }: { limit?: number }) =>
  safelyQueryPhotos(() => (limit
    ? sql`SELECT id FROM photos WHERE hidden IS NOT TRUE LIMIT ${limit}`
    : sql`SELECT id FROM photos WHERE hidden IS NOT TRUE`)
    .then(({ rows }) => rows.map(({ id }) => id as string))
  , 'getPublicPhotoIds');

export const getPhotoIdsAndUpdatedAt = async () =>
  safelyQueryPhotos(() =>
    sql`SELECT id, updated_at FROM photos WHERE hidden IS NOT TRUE`
      .then(({ rows }) => rows.map(({ id, updated_at }) =>
        ({ id: id as string, updatedAt: updated_at as Date })))
  , 'getPhotoIdsAndUpdatedAt');

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

// Update queries

const outdatedWhereClauses = [
  `updated_at < $1`,
  `(updated_at < $2 AND make = $3)`,
];

const outdatedWhereValues = [
  UPDATED_BEFORE_01.toISOString(),
  UPDATED_BEFORE_02.toISOString(),
  MAKE_FUJIFILM,
];

const needsAiTextWhereClauses =
  AI_CONTENT_GENERATION_ENABLED
    ? AI_TEXT_AUTO_GENERATED_FIELDS
      .map(field => {
        switch (field) {
          case 'title': return `(title <> '') IS NOT TRUE`;
          case 'caption': return `(caption <> '') IS NOT TRUE`;
          case 'tags': return `(tags IS NULL OR array_length(tags, 1) = 0)`;
          case 'semantic': return `(semantic_description <> '') IS NOT TRUE`;
        }
      })
    : [];

const needsColorDataWhereClauses = COLOR_SORT_ENABLED
  ? [`(
    color_data IS NULL OR
    color_sort IS NULL
  )`]
  : [];

const needsSyncWhereStatement =
  `WHERE ${[
    ...outdatedWhereClauses,
    ...needsAiTextWhereClauses,
    ...needsColorDataWhereClauses,
  ].join(' OR ')}`;

export const getPhotosInNeedOfUpdate = () =>
  safelyQueryPhotos(
    () => query(`
      SELECT * FROM photos
      ${needsSyncWhereStatement}
      ORDER BY created_at DESC
      LIMIT ${UPDATE_QUERY_LIMIT}
    `,
    outdatedWhereValues,
    )
      .then(({ rows }) => rows.map(parsePhotoFromDb)),
    'getPhotosInNeedOfUpdate',
  );

export const getPhotosInNeedOfUpdateCount = () =>
  safelyQueryPhotos(
    () => query(`
      SELECT COUNT(*) FROM photos
      ${needsSyncWhereStatement}
    `,
    outdatedWhereValues,
    )
      .then(({ rows }) => parseInt(rows[0].count, 10)),
    'getPhotosInNeedOfUpdateCount',
  );

// Backfills and experimentation

export const getColorDataForPhotos = () =>
  safelyQueryPhotos(() => sql<{
    id: string,
    url: string,
    color_data?: PhotoColorData,
  }>`
    SELECT id, url, color_data FROM photos
    LIMIT ${UPDATE_QUERY_LIMIT}
  `.then(({ rows }) => rows.map(({ id, url, color_data }) =>
        ({ id, url, colorData: color_data })))
  , 'getColorDataForPhotos');

export const updateColorDataForPhoto = (
  photoId: string,
  colorData: string,
  colorSort: number,
) =>
  safelyQueryPhotos(
    () => sql`
      UPDATE photos SET
      color_data=${colorData},
      color_sort=${colorSort}
      WHERE id=${photoId}
    `,
    'updateColorDataForPhoto',
  );
