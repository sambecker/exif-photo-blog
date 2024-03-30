/* eslint-disable max-len */
import '@testing-library/jest-dom';
import {
  getEscapePath,
  getPathComponents,
  isPathCamera,
  isPathCameraPhoto,
  isPathCameraPhotoShare,
  isPathCameraShare,
  isPathFilmSimulation,
  isPathFilmSimulationPhoto,
  isPathFilmSimulationPhotoShare,
  isPathFilmSimulationShare,
  isPathPhoto,
  isPathPhotoShare,
  isPathTag,
  isPathTagPhoto,
  isPathTagPhotoShare,
  isPathTagShare,
} from '@/site/paths';

const PHOTO_ID        = 'UsKSGcbt';
const TAG             = 'tag-name';
const CAMERA_MAKE     = 'fujifilm';
const CAMERA_MODEL    = 'x-t1';
const CAMERA_OBJECT   = { make: CAMERA_MAKE, model: CAMERA_MODEL };
const FILM_SIMULATION = 'acros';
const SHARE           = 'share';

const PATH_ROOT                         = '/';
const PATH_GRID                         = '/grid';
const PATH_ADMIN                        = '/admin/photos';

const PATH_PHOTO                        = `/p/${PHOTO_ID}`;
const PATH_PHOTO_SHARE                  = `${PATH_PHOTO}/${SHARE}`;

const PATH_TAG                          = `/tag/${TAG}`;
const PATH_TAG_SHARE                    = `${PATH_TAG}/${SHARE}`;
const PATH_TAG_PHOTO                    = `${PATH_TAG}/${PHOTO_ID}`;
const PATH_TAG_PHOTO_SHARE              = `${PATH_TAG_PHOTO}/${SHARE}`;

const PATH_CAMERA                       = `/shot-on/${CAMERA_MAKE}/${CAMERA_MODEL}`;
const PATH_CAMERA_SHARE                 = `${PATH_CAMERA}/${SHARE}`;
const PATH_CAMERA_PHOTO                 = `${PATH_CAMERA}/${PHOTO_ID}`;
const PATH_CAMERA_PHOTO_SHARE           = `${PATH_CAMERA_PHOTO}/${SHARE}`;

const PATH_FILM_SIMULATION              = `/film/${FILM_SIMULATION}`;
const PATH_FILM_SIMULATION_SHARE        = `${PATH_FILM_SIMULATION}/${SHARE}`;
const PATH_FILM_SIMULATION_PHOTO        = `${PATH_FILM_SIMULATION}/${PHOTO_ID}`;
const PATH_FILM_SIMULATION_PHOTO_SHARE  = `${PATH_FILM_SIMULATION_PHOTO}/${SHARE}`;
 
describe('Paths', () => {
  it('can be classified', () => {
    // Positive
    expect(isPathPhoto(PATH_PHOTO)).toBe(true);
    expect(isPathPhotoShare(PATH_PHOTO_SHARE)).toBe(true);
    expect(isPathTag(PATH_TAG)).toBe(true);
    expect(isPathTagShare(PATH_TAG_SHARE)).toBe(true);
    expect(isPathTagPhoto(PATH_TAG_PHOTO)).toBe(true);
    expect(isPathTagPhotoShare(PATH_TAG_PHOTO_SHARE)).toBe(true);
    expect(isPathCamera(PATH_CAMERA)).toBe(true);
    expect(isPathCameraShare(PATH_CAMERA_SHARE)).toBe(true);
    expect(isPathCameraPhoto(PATH_CAMERA_PHOTO)).toBe(true);
    expect(isPathCameraPhotoShare(PATH_CAMERA_PHOTO_SHARE)).toBe(true);
    expect(isPathFilmSimulation(PATH_FILM_SIMULATION)).toBe(true);
    expect(isPathFilmSimulationShare(PATH_FILM_SIMULATION_SHARE)).toBe(true);
    expect(isPathFilmSimulationPhoto(PATH_FILM_SIMULATION_PHOTO)).toBe(true);
    expect(isPathFilmSimulationPhotoShare(PATH_FILM_SIMULATION_PHOTO_SHARE)).toBe(true);
    // Negative
    expect(isPathPhoto(PATH_TAG_PHOTO_SHARE)).toBe(false);
    expect(isPathPhotoShare(PATH_TAG_PHOTO)).toBe(false);
    expect(isPathTag(PATH_TAG_SHARE)).toBe(false);
    expect(isPathTagShare(PATH_TAG)).toBe(false);
    expect(isPathTagPhoto(PATH_PHOTO_SHARE)).toBe(false);
    expect(isPathTagPhotoShare(PATH_PHOTO)).toBe(false);
    expect(isPathCamera(PATH_TAG_SHARE)).toBe(false);
    expect(isPathCameraShare(PATH_TAG)).toBe(false);
    expect(isPathCameraPhoto(PATH_PHOTO_SHARE)).toBe(false);
    expect(isPathCameraPhotoShare(PATH_PHOTO)).toBe(false);
    expect(isPathFilmSimulation(PATH_TAG_SHARE)).toBe(false);
    expect(isPathFilmSimulationShare(PATH_TAG)).toBe(false);
    expect(isPathFilmSimulationPhoto(PATH_PHOTO_SHARE)).toBe(false);
    expect(isPathFilmSimulationPhotoShare(PATH_PHOTO)).toBe(false);
  });
  it('can be parsed', () => {
    expect(getPathComponents(PATH_ROOT)).toEqual({});
    expect(getPathComponents(PATH_PHOTO)).toEqual({
      photoId: PHOTO_ID,
    });
    expect(getPathComponents(PATH_PHOTO_SHARE)).toEqual({
      photoId: PHOTO_ID,
    });
    expect(getPathComponents(PATH_TAG)).toEqual({
      tag: TAG,
    });
    expect(getPathComponents(PATH_TAG_SHARE)).toEqual({
      tag: TAG,
    });
    expect(getPathComponents(PATH_TAG_PHOTO)).toEqual({
      photoId: PHOTO_ID,
      tag: TAG,
    });
    expect(getPathComponents(PATH_TAG_PHOTO_SHARE)).toEqual({
      photoId: PHOTO_ID,
      tag: TAG,
    });
    expect(getPathComponents(PATH_CAMERA)).toEqual({
      camera: CAMERA_OBJECT,
    });
    expect(getPathComponents(PATH_CAMERA_SHARE)).toEqual({
      camera: CAMERA_OBJECT,
    });
    expect(getPathComponents(PATH_CAMERA_PHOTO)).toEqual({
      photoId: PHOTO_ID,
      camera: CAMERA_OBJECT,
    });
    expect(getPathComponents(PATH_CAMERA_PHOTO_SHARE)).toEqual({
      photoId: PHOTO_ID,
      camera: CAMERA_OBJECT,
    });
    expect(getPathComponents(PATH_FILM_SIMULATION)).toEqual({
      simulation: FILM_SIMULATION,
    });
    expect(getPathComponents(PATH_FILM_SIMULATION_SHARE)).toEqual({
      simulation: FILM_SIMULATION,
    });
    expect(getPathComponents(PATH_FILM_SIMULATION_PHOTO)).toEqual({
      photoId: PHOTO_ID,
      simulation: FILM_SIMULATION,
    });
    expect(getPathComponents(PATH_FILM_SIMULATION_PHOTO_SHARE)).toEqual({
      photoId: PHOTO_ID,
      simulation: FILM_SIMULATION,
    });
  });
  it('can be escaped', () => {
    // Root views
    expect(getEscapePath(PATH_ROOT)).toEqual(undefined);
    expect(getEscapePath(PATH_GRID)).toEqual(undefined);
    expect(getEscapePath(PATH_ADMIN)).toEqual(undefined);
    // Photo views
    expect(getEscapePath(PATH_PHOTO)).toEqual(PATH_GRID);
    expect(getEscapePath(PATH_PHOTO_SHARE)).toEqual(PATH_PHOTO);
    // Tag views
    expect(getEscapePath(PATH_TAG)).toEqual(PATH_GRID);
    expect(getEscapePath(PATH_TAG_SHARE)).toEqual(PATH_TAG);
    expect(getEscapePath(PATH_TAG_PHOTO)).toEqual(PATH_TAG);
    expect(getEscapePath(PATH_TAG_PHOTO_SHARE)).toEqual(PATH_TAG_PHOTO);
    // Camera views
    expect(getEscapePath(PATH_CAMERA)).toEqual(PATH_GRID);
    expect(getEscapePath(PATH_CAMERA_SHARE)).toEqual(PATH_CAMERA);
    expect(getEscapePath(PATH_CAMERA_PHOTO)).toEqual(PATH_CAMERA);
    expect(getEscapePath(PATH_CAMERA_PHOTO_SHARE)).toEqual(PATH_CAMERA_PHOTO);
    // Film Simulation views
    expect(getEscapePath(PATH_FILM_SIMULATION)).toEqual(PATH_GRID);
    expect(getEscapePath(PATH_FILM_SIMULATION_SHARE)).toEqual(PATH_FILM_SIMULATION);
    expect(getEscapePath(PATH_FILM_SIMULATION_PHOTO)).toEqual(PATH_FILM_SIMULATION);
    expect(getEscapePath(PATH_FILM_SIMULATION_PHOTO_SHARE)).toEqual(PATH_FILM_SIMULATION_PHOTO);
  });
});
