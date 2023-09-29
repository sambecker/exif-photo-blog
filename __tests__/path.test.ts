import '@testing-library/jest-dom';
import {
  getEscapePath,
  getPathComponents,
  isPathPhoto,
  isPathPhotoShare,
  isPathTag,
  isPathTagPhoto,
  isPathTagPhotoShare,
  isPathTagShare,
} from '@/site/paths';

const PHOTO_ID = 'UsKSGcbt';
const TAG = 'tag-name';
const SHARE = 'share';

const PATH_ROOT = '/';
const PATH_GRID = '/grid';
const PATH_ADMIN = '/admin/photos';
const PATH_PHOTO = `/p/${PHOTO_ID}`;
const PATH_PHOTO_SHARE = `${PATH_PHOTO}/${SHARE}`;
const PATH_TAG = `/t/${TAG}`;
const PATH_TAG_SHARE = `${PATH_TAG}/${SHARE}`;
const PATH_TAG_PHOTO = `${PATH_TAG}/${PHOTO_ID}`;
const PATH_TAG_PHOTO_SHARE = `${PATH_TAG}/${PHOTO_ID}/${SHARE}`;
 
describe('Paths', () => {
  it('can be classified', () => {
    // Positive
    expect(isPathPhoto(PATH_PHOTO)).toBe(true);
    expect(isPathPhotoShare(PATH_PHOTO_SHARE)).toBe(true);
    expect(isPathTag(PATH_TAG)).toBe(true);
    expect(isPathTagShare(PATH_TAG_SHARE)).toBe(true);
    expect(isPathTagPhoto(PATH_TAG_PHOTO)).toBe(true);
    expect(isPathTagPhotoShare(PATH_TAG_PHOTO_SHARE)).toBe(true);
    // Negative
    expect(isPathPhoto(PATH_TAG_PHOTO_SHARE)).toBe(false);
    expect(isPathPhotoShare(PATH_TAG_PHOTO)).toBe(false);
    expect(isPathTag(PATH_TAG_SHARE)).toBe(false);
    expect(isPathTagShare(PATH_TAG)).toBe(false);
    expect(isPathTagPhoto(PATH_PHOTO_SHARE)).toBe(false);
    expect(isPathTagPhotoShare(PATH_PHOTO)).toBe(false);
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
  });
});
