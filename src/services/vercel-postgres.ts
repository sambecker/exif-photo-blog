import { sql } from '@vercel/postgres';
import {
  PhotoDb,
  PhotoDbInsert,
  translatePhotoId,
  parsePhotoFromDb,
  Photo,
  PhotoDateRange,
} from '@/photo';
import { Camera, Cameras, createCameraKey } from '@/camera';
import { parameterize } from '@/utility/string';
import { Tags } from '@/tag';
import { FilmSimulation, FilmSimulations } from '@/simulation';

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
      hidden BOOLEAN,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

// Must provide id as 8-character nanoid
export const sqlInsertPhoto = (photo: PhotoDbInsert) => {
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
      ${photo.hidden},
      ${photo.takenAt},
      ${photo.takenAtNaive}
    )
  `;
};

export const sqlUpdatePhoto = (photo: PhotoDbInsert) =>
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
    hidden=${photo.hidden},
    taken_at=${photo.takenAt},
    taken_at_naive=${photo.takenAtNaive},
    updated_at=${(new Date()).toISOString()}
    WHERE id=${photo.id}
  `;

export const sqlDeletePhotoTagGlobally = (tag: string) =>
  sql`
    UPDATE photos
    SET tags=ARRAY_REMOVE(tags, ${tag})
    WHERE ${tag}=ANY(tags)
  `;

export const sqlRenamePhotoTagGlobally = (tag: string, updatedTag: string) =>
  sql`
    UPDATE photos
    SET tags=ARRAY_REPLACE(tags, ${tag}, ${updatedTag})
    WHERE ${tag}=ANY(tags)
  `;

export const sqlDeletePhoto = (id: string) =>
  sql`DELETE FROM photos WHERE id=${id}`;

const sqlGetPhotos = (
  limit = PHOTO_DEFAULT_LIMIT,
  offset = 0,
) =>
  sql<PhotoDb>`
    SELECT * FROM photos
    WHERE hidden IS NOT TRUE
    ORDER BY taken_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

const sqlGetPhotosIncludingHidden = (
  limit = PHOTO_DEFAULT_LIMIT,
  offset = 0,
) =>
  sql<PhotoDb>`
    SELECT * FROM photos
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

const sqlGetPhotosSortedByCreatedAt = (
  limit = PHOTO_DEFAULT_LIMIT,
  offset = 0,
) =>
  sql<PhotoDb>`
    SELECT * FROM photos
    WHERE hidden IS NOT TRUE
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

const sqlGetPhotosSortedByPriority = (
  limit = PHOTO_DEFAULT_LIMIT,
  offset = 0,
) =>
  sql<PhotoDb>`
    SELECT * FROM photos
    WHERE hidden IS NOT TRUE
    ORDER BY priority_order ASC, taken_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

const sqlGetPhotosByTag = (
  limit = PHOTO_DEFAULT_LIMIT,
  tag: string,
) =>
  sql<PhotoDb>`
    SELECT * FROM photos
    WHERE ${tag}=ANY(tags)
    AND hidden IS NOT TRUE
    ORDER BY taken_at DESC
    LIMIT ${limit}
  `;

const sqlGetPhotosByCamera = async (
  limit = PHOTO_DEFAULT_LIMIT,
  make: string,
  model: string,
) => sql<PhotoDb>`
  SELECT * FROM photos
  WHERE
  LOWER(make)=${parameterize(make)} AND
  LOWER(REPLACE(model, ' ', '-'))=${parameterize(model)}
  ORDER BY taken_at DESC
  LIMIT ${limit}
`;

const sqlGetPhotosBySimulation = async (
  limit = PHOTO_DEFAULT_LIMIT,
  simulation: FilmSimulation,
) => sql<PhotoDb>`
  SELECT * FROM photos
  WHERE film_simulation=${simulation}
  AND hidden IS NOT TRUE
  ORDER BY taken_at DESC
  LIMIT ${limit}
`;

const sqlGetPhotosTakenAfterDateInclusive = (
  takenAt: Date,
  limit?: number,
) =>
  sql<PhotoDb>`
    SELECT * FROM photos
    WHERE taken_at <= ${takenAt.toISOString()}
    AND hidden IS NOT TRUE
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
    AND hidden IS NOT TRUE
    ORDER BY taken_at ASC
    LIMIT ${limit}
  `;

const sqlGetPhoto = (id: string) =>
  sql<PhotoDb>`SELECT * FROM photos WHERE id=${id} LIMIT 1`;

const sqlGetPhotosCount = async () => sql`
  SELECT COUNT(*) FROM photos
  WHERE hidden IS NOT TRUE
`.then(({ rows }) => parseInt(rows[0].count, 10));

const sqlGetPhotosCountIncludingHidden = async () => sql`
  SELECT COUNT(*) FROM photos
`.then(({ rows }) => parseInt(rows[0].count, 10));

const sqlGetPhotosTagCount = async (tag: string) => sql`
  SELECT COUNT(*) FROM photos
  WHERE ${tag}=ANY(tags) AND
  hidden IS NOT TRUE
`.then(({ rows }) => parseInt(rows[0].count, 10));

const sqlGetPhotosCameraCount = async (camera: Camera) => sql`
  SELECT COUNT(*) FROM photos
  WHERE
  LOWER(make)=${parameterize(camera.make)} AND
  LOWER(REPLACE(model, ' ', '-'))=${parameterize(camera.model)} AND
  hidden IS NOT TRUE
`.then(({ rows }) => parseInt(rows[0].count, 10));

const sqlGetPhotosFilmSimulationCount = async (
  simulation: FilmSimulation,
) => sql`
  SELECT COUNT(*) FROM photos
  WHERE film_simulation=${simulation} AND
  hidden IS NOT TRUE
`.then(({ rows }) => parseInt(rows[0].count, 10));

const sqlGetPhotosDateRange = async () => sql`
  SELECT MIN(taken_at_naive) as start, MAX(taken_at_naive) as end
  FROM photos
  WHERE hidden IS NOT TRUE
`.then(({ rows }) => rows[0] as PhotoDateRange);

const sqlGetPhotosTagDateRange = async (tag: string) => sql`
  SELECT MIN(taken_at_naive) as start, MAX(taken_at_naive) as end
  FROM photos
  WHERE ${tag}=ANY(tags) AND
  hidden IS NOT TRUE
`.then(({ rows }) => rows[0] as PhotoDateRange);

const sqlGetPhotosCameraDateRange = async (camera: Camera) => sql`
  SELECT MIN(taken_at_naive) as start, MAX(taken_at_naive) as end
  FROM photos
  WHERE
  LOWER(make)=${parameterize(camera.make)} AND
  LOWER(REPLACE(model, ' ', '-'))=${parameterize(camera.model)} AND
  hidden IS NOT TRUE
`.then(({ rows }) => rows[0] as PhotoDateRange);

const sqlGetPhotosFilmSimulationDateRange = async (
  simulation: FilmSimulation,
) => sql`
  SELECT MIN(taken_at_naive) as start, MAX(taken_at_naive) as end
  FROM photos
  WHERE film_simulation=${simulation} AND
  hidden IS NOT TRUE
`.then(({ rows }) => rows[0] as PhotoDateRange);

const sqlGetUniqueTags = async () => sql`
  SELECT DISTINCT unnest(tags) as tag, COUNT(*)
  FROM photos
  WHERE hidden IS NOT TRUE
  GROUP BY tag
  ORDER BY tag ASC
`.then(({ rows }): Tags => rows.map(({ tag, count }) => ({
    tag: tag as string,
    count: parseInt(count, 10),
  })));

const sqlGetUniqueTagsHidden = async () => sql`
  SELECT DISTINCT unnest(tags) as tag, COUNT(*)
  FROM photos
  GROUP BY tag
  ORDER BY tag ASC
`.then(({ rows }): Tags => rows.map(({ tag, count }) => ({
    tag: tag as string,
    count: parseInt(count, 10),
  })));

const sqlGetUniqueCameras = async () => sql`
  SELECT DISTINCT make||' '||model as camera, make, model, COUNT(*)
  FROM photos
  WHERE hidden IS NOT TRUE
  GROUP BY make, model
  ORDER BY camera ASC
`.then(({ rows }): Cameras => rows.map(({ make, model, count }) => ({
    cameraKey: createCameraKey({ make, model }),
    camera: { make, model },
    count: parseInt(count, 10),
  })));

const sqlGetUniqueFilmSimulations = async () => sql`
  SELECT DISTINCT film_simulation, COUNT(*)
  FROM photos
  WHERE hidden IS NOT TRUE AND film_simulation IS NOT NULL
  GROUP BY film_simulation
  ORDER BY film_simulation ASC
`.then(({ rows }): FilmSimulations => rows
    .map(({ film_simulation, count }) => ({
      simulation: film_simulation as FilmSimulation,
      count: parseInt(count, 10),
    })));

export type GetPhotosOptions = {
  sortBy?: 'createdAt' | 'takenAt' | 'priority'
  limit?: number
  tag?: string
  camera?: Camera
  simulation?: FilmSimulation
  takenBefore?: Date
  takenAfterInclusive?: Date
  includeHidden?: boolean
}

const safelyQueryPhotos = async <T>(callback: () => Promise<T>): Promise<T> => {
  let result: T;

  try {
    result = await callback();
  } catch (e: any) {
    if (/relation "photos" does not exist/i.test(e.message)) {
      console.log('Creating table "photos" because it did not exist');
      await sqlCreatePhotosTable();
      result = await callback();
    } else if (/endpoint is in transition/i.test(e.message)) {
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

  return result;
};

// PHOTOS
export const getPhotos = async (options: GetPhotosOptions = {}) => {
  const {
    sortBy = 'takenAt',
    limit,
    tag,
    camera,
    simulation,
    takenBefore,
    takenAfterInclusive,
    includeHidden,
  } = options;

  let getPhotosSql = () => sqlGetPhotos(limit);

  if (includeHidden) {
    getPhotosSql = () => sqlGetPhotosIncludingHidden(limit);
  } else if (takenBefore) {
    getPhotosSql = () => sqlGetPhotosTakenBeforeDate(takenBefore, limit);
  } else if (takenAfterInclusive) {
    // eslint-disable-next-line max-len
    getPhotosSql = () => sqlGetPhotosTakenAfterDateInclusive(takenAfterInclusive, limit);
  } else if (tag) {
    getPhotosSql = () => sqlGetPhotosByTag(limit, tag);
  } else if (camera) {
    getPhotosSql = () => sqlGetPhotosByCamera(limit, camera.make, camera.model);
  } else if (simulation) {
    getPhotosSql = () => sqlGetPhotosBySimulation(limit, simulation);
  } else if (sortBy === 'createdAt') {
    getPhotosSql = () => sqlGetPhotosSortedByCreatedAt(limit);
  } else if (sortBy === 'priority') {
    getPhotosSql = () => sqlGetPhotosSortedByPriority(limit);
  }

  return safelyQueryPhotos(getPhotosSql)
    .then(({ rows }) => rows.map(parsePhotoFromDb));
};
export const getPhoto = async (id: string): Promise<Photo | undefined> => {
  // Check for photo id forwarding
  // and convert short ids to uuids
  const photoId = translatePhotoId(id);
  return safelyQueryPhotos(() => sqlGetPhoto(photoId))
    .then(({ rows }) => rows.map(parsePhotoFromDb))
    .then(photos => photos.length > 0 ? photos[0] : undefined);
};
export const getPhotosDateRange = () =>
  safelyQueryPhotos(sqlGetPhotosDateRange);
export const getPhotosCount = () =>
  safelyQueryPhotos(sqlGetPhotosCount);
export const getPhotosCountIncludingHidden = () =>
  safelyQueryPhotos(sqlGetPhotosCountIncludingHidden);

// TAGS
export const getUniqueTags = () =>
  safelyQueryPhotos(sqlGetUniqueTags);
export const getUniqueTagsHidden = () =>
  safelyQueryPhotos(sqlGetUniqueTagsHidden);
export const getPhotosTagDateRange = (tag: string) =>
  safelyQueryPhotos(() => sqlGetPhotosTagDateRange(tag));
export const getPhotosTagCount = (tag: string) =>
  safelyQueryPhotos(() => sqlGetPhotosTagCount(tag));

// CAMERAS
export const getUniqueCameras = () =>
  safelyQueryPhotos(sqlGetUniqueCameras);
export const getPhotosCameraDateRange = (camera: Camera) =>
  safelyQueryPhotos(() => sqlGetPhotosCameraDateRange(camera));
export const getPhotosCameraCount = (camera: Camera) =>
  safelyQueryPhotos(() => sqlGetPhotosCameraCount(camera));

// FILM SIMULATIONS
export const getUniqueFilmSimulations = () =>
  safelyQueryPhotos(sqlGetUniqueFilmSimulations);
export const getPhotosFilmSimulationDateRange =
  (simulation: FilmSimulation) => safelyQueryPhotos(() =>
    sqlGetPhotosFilmSimulationDateRange(simulation));
export const getPhotosFilmSimulationCount = (simulation: FilmSimulation) =>
  safelyQueryPhotos(() => sqlGetPhotosFilmSimulationCount(simulation));
