import { Photo } from '@/photo';
import { BASE_URL } from './config';
import {
  Device,
  createDeviceKey,
  getMakeModelFromDeviceString,
} from '@/device';

// Prefixes
const PREFIX_PHOTO  = '/p';
const PREFIX_TAG    = '/t';
const PREFIX_DEVICE = '/shot-on';

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

export const pathForPhoto = (
  photo: PhotoOrPhotoId,
  tag?: string,
  device?: Device,
) =>
  tag
    ? `${pathForTag(tag)}/${getPhotoId(photo)}`
    : device
      ? `${pathForDevice(device)}/${getPhotoId(photo)}`
      : `${PREFIX_PHOTO}/${getPhotoId(photo)}`;

export const pathForPhotoShare = (
  photo: PhotoOrPhotoId,
  tag?: string,
  device?: Device,
) =>
  `${pathForPhoto(photo, tag, device)}/${SHARE}`;

export const pathForPhotoEdit = (photo: PhotoOrPhotoId) =>
  `${PATH_ADMIN_PHOTOS}/${getPhotoId(photo)}/edit`;

export const pathForTag = (tag: string) =>
  `${PREFIX_TAG}/${tag}`;

export const pathForTagShare = (tag: string) =>
  `${pathForTag(tag)}/${SHARE}`;

export const pathForDevice = ({ make, model }: Device) =>
  `${PREFIX_DEVICE}/${createDeviceKey(make, model)}`;

export const pathForDeviceShare = (device: Device) =>
  `${pathForDevice(device)}/${SHARE}`;

export const absolutePathForPhoto = (
  photo: PhotoOrPhotoId,
  tag?: string,
  device?: Device,
) =>
  `${BASE_URL}${pathForPhoto(photo, tag, device)}`;

export const absolutePathForTag = (tag: string) =>
  `${BASE_URL}${pathForTag(tag)}`;

export const absolutePathForDevice= (device: Device) =>
  `${BASE_URL}${pathForDevice(device)}`;

export const absolutePathForPhotoImage = (photo: PhotoOrPhotoId) =>
  `${absolutePathForPhoto(photo)}/image`;

export const absolutePathForTagImage = (tag: string) =>
  `${absolutePathForTag(tag)}/image`;

export const absolutePathForDeviceImage= (device: Device) =>
  `${absolutePathForDevice(device)}/image`;

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

// shot-on/[device]
export const isPathDevice = (pathname = '') =>
  /^\/shot-on\/[^/]+\/?$/.test(pathname);

// shot-on/[device]/share
export const isPathDeviceShare = (pathname = '') =>
  /^\/shot-on\/[^/]+\/share\/?$/.test(pathname);

// shot-on/[device]/[photoId]
export const isPathDevicePhoto = (pathname = '') =>
  /^\/shot-on\/[^/]+\/[^/]+\/?$/.test(pathname);

// shot-on/[device]/[photoId]/share
export const isPathDevicePhotoShare = (pathname = '') =>
  /^\/shot-on\/[^/]+\/[^/]+\/share\/?$/.test(pathname);

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
  device?: Device
} => {
  const photoIdFromPhoto = pathname.match(/^\/p\/([^/]+)/)?.[1];
  const photoIdFromTag = pathname.match(/^\/t\/[^/]+\/((?!share)[^/]+)/)?.[1];
  // eslint-disable-next-line max-len
  const photoIdFromDevice = pathname.match(/^\/shot-on\/[^/]+\/((?!share)[^/]+)/)?.[1];
  const tag = pathname.match(/^\/t\/([^/]+)/)?.[1];
  const deviceString = pathname.match(/^\/shot-on\/([^/]+)/)?.[1];
  const device = deviceString
    ? getMakeModelFromDeviceString(deviceString)
    : undefined;
  return {
    photoId: (
      photoIdFromPhoto ||
      photoIdFromTag ||
      photoIdFromDevice
    ),
    tag,
    device,
  };
};

export const getEscapePath = (pathname?: string) => {
  const { photoId, tag, device } = getPathComponents(pathname);
  if (
    (photoId && isPathPhoto(pathname)) ||
    (tag && isPathTag(pathname)) ||
    (device && isPathDevice(pathname))
  ) {
    return PATH_GRID;
  } else if (photoId && isPathTagPhotoShare(pathname)) {
    return pathForPhoto(photoId, tag);
  } else if (photoId && isPathDevicePhotoShare(pathname)) {
    return pathForPhoto(photoId, undefined, device);
  } else if (photoId && isPathPhotoShare(pathname)) {
    return pathForPhoto(photoId);
  } else if (tag && (
    isPathTagPhoto(pathname) ||
    isPathTagShare(pathname)
  )) {
    return pathForTag(tag);
  } else if (device && (
    isPathDevicePhoto(pathname) ||
    isPathDeviceShare(pathname)
  )) {
    return pathForDevice(device);
  }
};
