/* eslint-disable max-len */
import {
  getEscapePath,
  getPathComponents,
  isPathCamera,
  isPathCameraPhoto,
  isPathFilm,
  isPathFilmPhoto,
  isPathFocalLength,
  isPathFocalLengthPhoto,
  isPathPhoto,
  isPathProtected,
  isPathTag,
  isPathTagPhoto,
  PATH_ADMIN,
  PATH_ADMIN_PHOTOS,
  PATH_FULL,
  PATH_GRID,
  PATH_OG,
  PATH_OG_ALL,
  PATH_OG_SAMPLE,
  PATH_ROOT,
  PREFIX_ALBUM,
  PREFIX_CAMERA,
  PREFIX_FILM,
  PREFIX_FOCAL_LENGTH,
  PREFIX_LENS,
  PREFIX_RECENTS,
  PREFIX_RECIPE,
  PREFIX_TAG,
  PREFIX_YEAR,
} from '@/app/path';
import { TAG_PRIVATE } from '@/tag';

const PHOTO_ID                      = 'UsKSGcbt';
const YEAR                          = '2025';
const CAMERA_MAKE                   = 'fujifilm';
const CAMERA_MODEL                  = 'x-t1';
const CAMERA_OBJECT                 = { make: CAMERA_MAKE, model: CAMERA_MODEL };
const LENS_MAKE                     = 'fujifilm';
const LENS_MODEL                    = 'xf90mmf2-r-lm-wr';
const LENS_OBJECT                   = { make: LENS_MAKE, model: LENS_MODEL };
const ALBUM                         = 'album-name';
const TAG                           = 'tag-name';
const RECIPE                        = 'nature-nurture';
const FILM                          = 'acros';
const FOCAL_LENGTH                  = 90;
const FOCAL_LENGTH_STRING           = `${FOCAL_LENGTH}mm`;

const PATH_PHOTO                    = `/p/${PHOTO_ID}`;

const PATH_RECENTS                  = PREFIX_RECENTS;
const PATH_RECENTS_PHOTO            = `${PATH_RECENTS}/${PHOTO_ID}`;

const PATH_YEAR                     = `${PREFIX_YEAR}/${YEAR}`;
const PATH_YEAR_PHOTO               = `${PATH_YEAR}/${PHOTO_ID}`;

const PATH_CAMERA                   = `${PREFIX_CAMERA}/${CAMERA_MAKE}/${CAMERA_MODEL}`;
const PATH_CAMERA_PHOTO             = `${PATH_CAMERA}/${PHOTO_ID}`;

const PATH_LENS                     = `${PREFIX_LENS}/${LENS_MAKE}/${LENS_MODEL}`;
const PATH_LENS_PHOTO               = `${PATH_LENS}/${PHOTO_ID}`;

const PATH_ALBUM                    = `${PREFIX_ALBUM}/${ALBUM}`;
const PATH_ALBUM_PHOTO              = `${PATH_ALBUM}/${PHOTO_ID}`;

const PATH_TAG                      = `${PREFIX_TAG}/${TAG}`;
const PATH_TAG_PHOTO                = `${PATH_TAG}/${PHOTO_ID}`;

const PATH_TAG_PRIVATE              = `${PREFIX_TAG}/${TAG_PRIVATE}`;
const PATH_TAG_PRIVATE_PHOTO        = `${PATH_TAG_PRIVATE}/${PHOTO_ID}`;

const PATH_RECIPE                   = `${PREFIX_RECIPE}/${RECIPE}`;
const PATH_RECIPE_PHOTO             = `${PATH_RECIPE}/${PHOTO_ID}`;

const PATH_FILM                     = `${PREFIX_FILM}/${FILM}`;
const PATH_FILM_PHOTO               = `${PATH_FILM}/${PHOTO_ID}`;

const PATH_FOCAL_LENGTH             = `${PREFIX_FOCAL_LENGTH}/${FOCAL_LENGTH_STRING}`;
const PATH_FOCAL_LENGTH_PHOTO       = `${PATH_FOCAL_LENGTH}/${PHOTO_ID}`;
 
describe('Paths', () => {
  it('can be protected', () => {
    // Public
    expect(isPathProtected(PATH_ROOT)).toBe(false);
    expect(isPathProtected(PATH_PHOTO)).toBe(false);
    expect(isPathProtected(PATH_TAG)).toBe(false);
    expect(isPathProtected(PATH_TAG_PHOTO)).toBe(false);
    expect(isPathProtected(PATH_CAMERA)).toBe(false);
    expect(isPathProtected(PATH_FILM)).toBe(false);
    // Private
    expect(isPathProtected(PATH_ADMIN)).toBe(true);
    expect(isPathProtected(PATH_ADMIN_PHOTOS)).toBe(true);
    expect(isPathProtected(PATH_OG)).toBe(true);
    expect(isPathProtected(PATH_OG_ALL)).toBe(true);
    expect(isPathProtected(PATH_OG_SAMPLE)).toBe(true);
    expect(isPathProtected(PATH_TAG_PRIVATE)).toBe(true);
    expect(isPathProtected(PATH_TAG_PRIVATE_PHOTO)).toBe(true);
  });
  it('can be classified', () => {
    // Positive
    expect(isPathPhoto(PATH_PHOTO)).toBe(true);
    expect(isPathCamera(PATH_CAMERA)).toBe(true);
    expect(isPathCameraPhoto(PATH_CAMERA_PHOTO)).toBe(true);
    expect(isPathTag(PATH_TAG)).toBe(true);
    expect(isPathTagPhoto(PATH_TAG_PHOTO)).toBe(true);
    expect(isPathFilm(PATH_FILM)).toBe(true);
    expect(isPathFilmPhoto(PATH_FILM_PHOTO)).toBe(true);
    expect(isPathFocalLength(PATH_FOCAL_LENGTH)).toBe(true);
    expect(isPathFocalLengthPhoto(PATH_FOCAL_LENGTH_PHOTO)).toBe(true);
    // Negative
    expect(isPathFocalLength(PATH_FILM)).toBe(false);
    expect(isPathFocalLengthPhoto(PATH_FILM_PHOTO)).toBe(false);
  });
  it('can be parsed', () => {
    // Core
    expect(getPathComponents(PATH_ROOT)).toEqual({});
    expect(getPathComponents(PATH_PHOTO)).toEqual({
      photoId: PHOTO_ID,
    });
    // Recents
    expect(getPathComponents(PATH_RECENTS)).toEqual({
      recent: true,
    });
    expect(getPathComponents(PATH_RECENTS_PHOTO)).toEqual({
      photoId: PHOTO_ID,
      recent: true,
    });
    // Year
    expect(getPathComponents(PATH_YEAR)).toEqual({
      year: YEAR,
    });
    expect(getPathComponents(PATH_YEAR_PHOTO)).toEqual({
      photoId: PHOTO_ID,
      year: YEAR,
    });
    // Camera
    expect(getPathComponents(PATH_CAMERA)).toEqual({
      camera: CAMERA_OBJECT,
    });
    expect(getPathComponents(PATH_CAMERA_PHOTO)).toEqual({
      photoId: PHOTO_ID,
      camera: CAMERA_OBJECT,
    });
    // Lens
    expect(getPathComponents(PATH_LENS)).toEqual({
      lens: LENS_OBJECT,
    });
    expect(getPathComponents(PATH_LENS_PHOTO)).toEqual({
      photoId: PHOTO_ID,
      lens: LENS_OBJECT,
    });
    // Album
    expect(getPathComponents(PATH_ALBUM)).toEqual({
      album: ALBUM,
    });
    expect(getPathComponents(PATH_ALBUM_PHOTO)).toEqual({
      photoId: PHOTO_ID,
      album: ALBUM,
    });
    // Tag
    expect(getPathComponents(PATH_TAG)).toEqual({
      tag: TAG,
    });
    expect(getPathComponents(PATH_TAG_PHOTO)).toEqual({
      photoId: PHOTO_ID,
      tag: TAG,
    });
    // Recipe
    expect(getPathComponents(PATH_RECIPE)).toEqual({
      recipe: RECIPE,
    });
    expect(getPathComponents(PATH_RECIPE_PHOTO)).toEqual({
      photoId: PHOTO_ID,
      recipe: RECIPE,
    });
    // Film
    expect(getPathComponents(PATH_FILM)).toEqual({
      film: FILM,
    });
    expect(getPathComponents(PATH_FILM_PHOTO)).toEqual({
      photoId: PHOTO_ID,
      film: FILM,
    });
    // Focal Length
    expect(getPathComponents(PATH_FOCAL_LENGTH)).toEqual({
      focal: FOCAL_LENGTH,
    });
    expect(getPathComponents(PATH_FOCAL_LENGTH_PHOTO)).toEqual({
      photoId: PHOTO_ID,
      focal: FOCAL_LENGTH,
    });
  });
  it('can be escaped', () => {
    // Root
    expect(getEscapePath(PATH_ROOT)).toEqual(undefined);
    expect(getEscapePath(PATH_GRID)).toEqual(undefined);
    expect(getEscapePath(PATH_FULL)).toEqual(undefined);
    expect(getEscapePath(PATH_ADMIN)).toEqual(undefined);
    // Photo
    expect(getEscapePath(PATH_PHOTO)).toEqual(PATH_ROOT);
    // Recents
    expect(getEscapePath(PATH_RECENTS)).toEqual(PATH_ROOT);
    expect(getEscapePath(PATH_RECENTS_PHOTO)).toEqual(PATH_RECENTS);
    // Year
    expect(getEscapePath(PATH_YEAR)).toEqual(PATH_ROOT);
    expect(getEscapePath(PATH_YEAR_PHOTO)).toEqual(PATH_YEAR);
    // Camera
    expect(getEscapePath(PATH_CAMERA)).toEqual(PATH_ROOT);
    expect(getEscapePath(PATH_CAMERA_PHOTO)).toEqual(PATH_CAMERA);
    // Lens
    expect(getEscapePath(PATH_LENS)).toEqual(PATH_ROOT);
    expect(getEscapePath(PATH_LENS_PHOTO)).toEqual(PATH_LENS);
    // Album
    expect(getEscapePath(PATH_ALBUM)).toEqual(PATH_ROOT);
    expect(getEscapePath(PATH_ALBUM_PHOTO)).toEqual(PATH_ALBUM);
    // Tag
    expect(getEscapePath(PATH_TAG)).toEqual(PATH_ROOT);
    expect(getEscapePath(PATH_TAG_PHOTO)).toEqual(PATH_TAG);
    // Recipe
    expect(getEscapePath(PATH_RECIPE)).toEqual(PATH_ROOT);
    expect(getEscapePath(PATH_RECIPE_PHOTO)).toEqual(PATH_RECIPE);
    // Film
    expect(getEscapePath(PATH_FILM)).toEqual(PATH_ROOT);
    expect(getEscapePath(PATH_FILM_PHOTO)).toEqual(PATH_FILM);
    // Focal Length
    expect(getEscapePath(PATH_FOCAL_LENGTH)).toEqual(PATH_ROOT);
    expect(getEscapePath(PATH_FOCAL_LENGTH_PHOTO)).toEqual(PATH_FOCAL_LENGTH);
  });
});
