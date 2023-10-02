import { Photo } from '@/photo';
import { BASE_URL } from './config';
import { parameterize } from '@/utility/string';

// Prefixes
const PREFIX_PHOTO  = '/p';
const PREFIX_TAG    = '/t';
const PREFIX_DEVICE = '/d';

// Modifiers
const SHARE = 'share';
const NEXT = 'next';

// Core paths
export const PATH_ROOT  = '/';
export const PATH_GRID  = '/grid';
export const PATH_ADMIN = '/admin';
export const PATH_OG    = '/og';

// Extended paths
export const PATH_ADMIN_PHOTOS = `${PATH_ADMIN}/photos`;
export const PATH_ADMIN_UPLOAD = `${PATH_ADMIN}/uploads`;
export const PATH_ADMIN_UPLOAD_BLOB_HANDLER = `${PATH_ADMIN_UPLOAD}/blob`;

// Absolute paths
export const ABSOLUTE_PATH_FOR_HOME_IMAGE = `${BASE_URL}/home-image`;

const pathWithNext = (path: string, next?: number) =>
  next !== undefined ? `${path}?${NEXT}=${next}` : path;

export const pathForRoot = (next?: number) =>
  pathWithNext(PATH_ROOT, next);

export const pathForGrid = (next?: number) =>
  pathWithNext(PATH_GRID, next);

export const pathForAdminPhotos = (next?: number) =>
  pathWithNext(PATH_ADMIN_PHOTOS, next);

export const pathForOg = (next?: number) =>
  pathWithNext(PATH_OG, next);

type PhotoOrPhotoId = Photo | string;

const getPhotoId = (photoOrPhotoId: PhotoOrPhotoId) =>
  typeof photoOrPhotoId === 'string' ? photoOrPhotoId : photoOrPhotoId.id;

export const pathForPhoto = (photo: PhotoOrPhotoId, tag?: string) =>
  tag
    ? `${pathForTag(tag)}/${getPhotoId(photo)}`
    : `${PREFIX_PHOTO}/${getPhotoId(photo)}`;

export const pathForPhotoShare = (photo: PhotoOrPhotoId, tag?: string) =>
  `${pathForPhoto(photo, tag)}/${SHARE}`;

export const pathForPhotoEdit = (photo: PhotoOrPhotoId) =>
  `${PATH_ADMIN_PHOTOS}/${getPhotoId(photo)}/edit`;

export const pathForTag = (tag: string) =>
  `${PREFIX_TAG}/${tag}`;

export const pathForDevice = (make?: string, model?: string) =>
  `${PREFIX_DEVICE}/${parameterize(`${make}-${model}`)}`;

export const pathForTagShare = (tag: string) =>
  `${pathForTag(tag)}/${SHARE}`;

export const absolutePathForPhoto = (photo: PhotoOrPhotoId, tag?: string) =>
  `${BASE_URL}${pathForPhoto(photo, tag)}`;

export const absolutePathForTag = (tag: string) =>
  `${BASE_URL}${pathForTag(tag)}`;

export const absolutePathForPhotoImage = (photo: PhotoOrPhotoId) =>
  `${absolutePathForPhoto(photo)}/image`;

export const absolutePathForTagImage = (tag: string) =>
  `${absolutePathForTag(tag)}/image`;

// p/[photoId]
export const isPathPhoto = (pathname = '') =>
  /^\/p\/[^/]+\/?$/.test(pathname);

// p/[photoId]/share
export const isPathPhotoShare = (pathname = '') =>
  /^\/p\/[^/]+\/share\/?$/.test(pathname);

// t/[tagId]
export const isPathTag = (pathname = '') =>
  /^\/t\/[^/]+\/?$/.test(pathname);

// t/[tagId]/share
export const isPathTagShare = (pathname = '') =>
  /^\/t\/[^/]+\/share\/?$/.test(pathname);

// t/[tagId]/[photoId]
export const isPathTagPhoto = (pathname = '') =>
  /^\/t\/[^/]+\/[^/]+\/?$/.test(pathname);

// t/[tagId]/[photoId]/share
export const isPathTagPhotoShare = (pathname = '') =>
  /^\/t\/[^/]+\/[^/]+\/share\/?$/.test(pathname);

export const isPathGrid = (pathname = '') =>
  pathname.startsWith(PATH_GRID);

export const isPathSignIn = (pathname = '') =>
  pathname.startsWith('/sign-in');

export const isPathAdmin = (pathname = '') =>
  pathname.startsWith('/admin');

export const isPathProtected = (pathname = '') =>
  pathname.startsWith(PATH_ADMIN) ||
  pathname === '/checklist';

export const getPathComponents = (pathname = ''): {
  photoId?: string
  tag?: string
} => {
  const photoIdFromPhoto = pathname.match(/^\/p\/([^/]+)/)?.[1];
  const photoIdFromTag = pathname.match(/^\/t\/[^/]+\/((?!share)[^/]+)/)?.[1];
  const tag = pathname.match(/^\/t\/([^/]+)/)?.[1];
  return {
    photoId: (
      photoIdFromPhoto ||
      photoIdFromTag
    ),
    tag,
  };
};

export const getEscapePath = (pathname?: string) => {
  const { photoId, tag } = getPathComponents(pathname);
  if (
    (photoId && isPathPhoto(pathname)) ||
    (tag && isPathTag(pathname))
  ) {
    return PATH_GRID;
  } else if (photoId && isPathTagPhotoShare(pathname)) {
    return pathForPhoto(photoId, tag);
  } else if (photoId && isPathPhotoShare(pathname)) {
    return pathForPhoto(photoId);
  } else if (tag && (isPathTagPhoto(pathname) || isPathTagShare(pathname))) {
    return pathForTag(tag);
  } else if (tag && isPathTagShare(pathname)) {
    return pathForTag(tag);
  }
};
