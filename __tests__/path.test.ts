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
} from '@/app/path';
import { TAG_PRIVATE } from '@/tag';

const PHOTO_ID            = 'UsKSGcbt';
const TAG                 = 'tag-name';
const CAMERA_MAKE         = 'fujifilm';
const CAMERA_MODEL        = 'x-t1';
const CAMERA_OBJECT       = { make: CAMERA_MAKE, model: CAMERA_MODEL };
const FILM                = 'acros';
const FOCAL_LENGTH        = 90;
const FOCAL_LENGTH_STRING = `${FOCAL_LENGTH}mm`;

const PATH_ROOT                     = '/';
const PATH_GRID                     = '/grid';
const PATH_FULL                     = '/full';
const PATH_ADMIN                    = '/admin/photos';
const PATH_OG                       = '/og';
const PATH_OG_ALL                   = `${PATH_OG}/all`;
const PATH_OG_SAMPLE                = `${PATH_OG}/sample`;

const PATH_PHOTO                    = `/p/${PHOTO_ID}`;

const PATH_TAG                      = `/tag/${TAG}`;
const PATH_TAG_PHOTO                = `${PATH_TAG}/${PHOTO_ID}`;

const PATH_TAG_PRIVATE               = `/tag/${TAG_PRIVATE}`;
const PATH_TAG_PRIVATE_PHOTO         = `${PATH_TAG_PRIVATE}/${PHOTO_ID}`;

const PATH_CAMERA                   = `/shot-on/${CAMERA_MAKE}/${CAMERA_MODEL}`;
const PATH_CAMERA_PHOTO             = `${PATH_CAMERA}/${PHOTO_ID}`;

const PATH_FILM                     = `/film/${FILM}`;
const PATH_FILM_PHOTO               = `${PATH_FILM}/${PHOTO_ID}`;

const PATH_FOCAL_LENGTH             = `/focal/${FOCAL_LENGTH_STRING}`;
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
    expect(isPathProtected(PATH_OG)).toBe(true);
    expect(isPathProtected(PATH_OG_ALL)).toBe(true);
    expect(isPathProtected(PATH_OG_SAMPLE)).toBe(true);
    expect(isPathProtected(PATH_TAG_PRIVATE)).toBe(true);
    expect(isPathProtected(PATH_TAG_PRIVATE_PHOTO)).toBe(true);
  });
  it('can be classified', () => {
    // Positive
    expect(isPathPhoto(PATH_PHOTO)).toBe(true);
    expect(isPathTag(PATH_TAG)).toBe(true);
    expect(isPathTagPhoto(PATH_TAG_PHOTO)).toBe(true);
    expect(isPathCamera(PATH_CAMERA)).toBe(true);
    expect(isPathCameraPhoto(PATH_CAMERA_PHOTO)).toBe(true);
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
    // Tag
    expect(getPathComponents(PATH_TAG)).toEqual({
      tag: TAG,
    });
    expect(getPathComponents(PATH_TAG_PHOTO)).toEqual({
      photoId: PHOTO_ID,
      tag: TAG,
    });
    // Camera
    expect(getPathComponents(PATH_CAMERA)).toEqual({
      camera: CAMERA_OBJECT,
    });
    expect(getPathComponents(PATH_CAMERA_PHOTO)).toEqual({
      photoId: PHOTO_ID,
      camera: CAMERA_OBJECT,
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
    // Tag
    expect(getEscapePath(PATH_TAG)).toEqual(PATH_ROOT);
    expect(getEscapePath(PATH_TAG_PHOTO)).toEqual(PATH_TAG);
    // Camera
    expect(getEscapePath(PATH_CAMERA)).toEqual(PATH_ROOT);
    expect(getEscapePath(PATH_CAMERA_PHOTO)).toEqual(PATH_CAMERA);
    // Film
    expect(getEscapePath(PATH_FILM)).toEqual(PATH_ROOT);
    expect(getEscapePath(PATH_FILM_PHOTO)).toEqual(PATH_FILM);
    // Focal Length
    expect(getEscapePath(PATH_FOCAL_LENGTH)).toEqual(PATH_ROOT);
    expect(getEscapePath(PATH_FOCAL_LENGTH_PHOTO)).toEqual(PATH_FOCAL_LENGTH);
  });
});
