import { Photo } from '@/photo';
import { BASE_URL } from './config';
import {
  Camera,
  createCameraKey,
  getMakeModelFromCameraString,
} from '@/camera';

// Prefixes
const PREFIX_PHOTO  = '/p';
const PREFIX_TAG    = '/t';
const PREFIX_CAMERA = '/shot-on';

// Core paths
export const PATH_ROOT      = '/';
export const PATH_GRID      = '/grid';
export const PATH_ADMIN     = '/admin';
export const PATH_SIGN_IN   = '/sign-in';
export const PATH_OG        = '/og';
export const PATH_CHECKLIST = '/checklist';

// Extended paths
export const PATH_ADMIN_PHOTOS = `${PATH_ADMIN}/photos`;
export const PATH_ADMIN_UPLOAD = `${PATH_ADMIN}/uploads`;
export const PATH_ADMIN_UPLOAD_BLOB_HANDLER = `${PATH_ADMIN_UPLOAD}/blob`;

// Modifiers
const SHARE = 'share';
const NEXT  = 'next';

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

export const pathForPhoto = (
  photo: PhotoOrPhotoId,
  tag?: string,
  camera?: Camera,
) =>
  tag
    ? `${pathForTag(tag)}/${getPhotoId(photo)}`
    : camera
      ? `${pathForCamera(camera)}/${getPhotoId(photo)}`
      : `${PREFIX_PHOTO}/${getPhotoId(photo)}`;

export const pathForPhotoShare = (
  photo: PhotoOrPhotoId,
  tag?: string,
  camera?: Camera,
) =>
  `${pathForPhoto(photo, tag, camera)}/${SHARE}`;

export const pathForPhotoEdit = (photo: PhotoOrPhotoId) =>
  `${PATH_ADMIN_PHOTOS}/${getPhotoId(photo)}/edit`;

export const pathForTag = (tag: string, next?: number) =>
  pathWithNext(
    `${PREFIX_TAG}/${tag}`,
    next,
  );

export const pathForTagShare = (tag: string) =>
  `${pathForTag(tag)}/${SHARE}`;

export const pathForCamera = ({ make, model }: Camera, next?: number) =>
  pathWithNext(
    `${PREFIX_CAMERA}/${createCameraKey(make, model)}`,
    next,
  );

export const pathForCameraShare = (camera: Camera) =>
  `${pathForCamera(camera)}/${SHARE}`;

export const absolutePathForPhoto = (
  photo: PhotoOrPhotoId,
  tag?: string,
  camera?: Camera,
) =>
  `${BASE_URL}${pathForPhoto(photo, tag, camera)}`;

export const absolutePathForTag = (tag: string) =>
  `${BASE_URL}${pathForTag(tag)}`;

export const absolutePathForCamera= (camera: Camera) =>
  `${BASE_URL}${pathForCamera(camera)}`;

export const absolutePathForPhotoImage = (photo: PhotoOrPhotoId) =>
  `${absolutePathForPhoto(photo)}/image`;

export const absolutePathForTagImage = (tag: string) =>
  `${absolutePathForTag(tag)}/image`;

export const absolutePathForCameraImage= (camera: Camera) =>
  `${absolutePathForCamera(camera)}/image`;

// p/[photoId]
export const isPathPhoto = (pathname = '') =>
  /^\/p\/[^/]+\/?$/.test(pathname);

// p/[photoId]/share
export const isPathPhotoShare = (pathname = '') =>
  /^\/p\/[^/]+\/share\/?$/.test(pathname);

// t/[tag]
export const isPathTag = (pathname = '') =>
  /^\/t\/[^/]+\/?$/.test(pathname);

// t/[tag]/share
export const isPathTagShare = (pathname = '') =>
  /^\/t\/[^/]+\/share\/?$/.test(pathname);

// t/[tag]/[photoId]
export const isPathTagPhoto = (pathname = '') =>
  /^\/t\/[^/]+\/[^/]+\/?$/.test(pathname);

// t/[tag]/[photoId]/share
export const isPathTagPhotoShare = (pathname = '') =>
  /^\/t\/[^/]+\/[^/]+\/share\/?$/.test(pathname);

// shot-on/[camera]
export const isPathCamera = (pathname = '') =>
  /^\/shot-on\/[^/]+\/?$/.test(pathname);

// shot-on/[camera]/share
export const isPathCameraShare = (pathname = '') =>
  /^\/shot-on\/[^/]+\/share\/?$/.test(pathname);

// shot-on/[camera]/[photoId]
export const isPathCameraPhoto = (pathname = '') =>
  /^\/shot-on\/[^/]+\/[^/]+\/?$/.test(pathname);

// shot-on/[camera]/[photoId]/share
export const isPathCameraPhotoShare = (pathname = '') =>
  /^\/shot-on\/[^/]+\/[^/]+\/share\/?$/.test(pathname);

export const isPathGrid = (pathname = '') =>
  pathname.startsWith(PATH_GRID);

export const isPathSignIn = (pathname = '') =>
  pathname.startsWith(PATH_SIGN_IN);

export const isPathAdmin = (pathname = '') =>
  pathname.startsWith(PATH_ADMIN);

export const isPathProtected = (pathname = '') =>
  pathname.startsWith(PATH_ADMIN) ||
  pathname === PATH_CHECKLIST;

export const getPathComponents = (pathname = ''): {
  photoId?: string
  tag?: string
  camera?: Camera
} => {
  const photoIdFromPhoto = pathname.match(/^\/p\/([^/]+)/)?.[1];
  const photoIdFromTag = pathname.match(/^\/t\/[^/]+\/((?!share)[^/]+)/)?.[1];
  // eslint-disable-next-line max-len
  const photoIdFromCamera = pathname.match(/^\/shot-on\/[^/]+\/((?!share)[^/]+)/)?.[1];
  const tag = pathname.match(/^\/t\/([^/]+)/)?.[1];
  const cameraString = pathname.match(/^\/shot-on\/([^/]+)/)?.[1];
  const camera = cameraString
    ? getMakeModelFromCameraString(cameraString)
    : undefined;
  return {
    photoId: (
      photoIdFromPhoto ||
      photoIdFromTag ||
      photoIdFromCamera
    ),
    tag,
    camera,
  };
};

export const getEscapePath = (pathname?: string) => {
  const { photoId, tag, camera } = getPathComponents(pathname);
  if (
    (photoId && isPathPhoto(pathname)) ||
    (tag && isPathTag(pathname)) ||
    (camera && isPathCamera(pathname))
  ) {
    return PATH_GRID;
  } else if (photoId && isPathTagPhotoShare(pathname)) {
    return pathForPhoto(photoId, tag);
  } else if (photoId && isPathCameraPhotoShare(pathname)) {
    return pathForPhoto(photoId, undefined, camera);
  } else if (photoId && isPathPhotoShare(pathname)) {
    return pathForPhoto(photoId);
  } else if (tag && (
    isPathTagPhoto(pathname) ||
    isPathTagShare(pathname)
  )) {
    return pathForTag(tag);
  } else if (camera && (
    isPathCameraPhoto(pathname) ||
    isPathCameraShare(pathname)
  )) {
    return pathForCamera(camera);
  }
};
