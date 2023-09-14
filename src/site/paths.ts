import { Photo } from '@/photo';
import { BASE_URL } from './config';

const PREFIX_PHOTO = '/p';
const PREFIX_TAG = '/t';
const PREFIX_ADMIN = '/admin';

export const PATH_ADMIN_PHOTOS = `${PREFIX_ADMIN}/photos`;
export const PATH_ADMIN_UPLOAD = `${PREFIX_ADMIN}/uploads`;
export const PATH_ADMIN_UPLOAD_BLOB_HANDLER = `${PATH_ADMIN_UPLOAD}/blob`;

export const ABSOLUTE_PATH_FOR_HOME_IMAGE = `${BASE_URL}/home-image`;

export const pathForPhoto = (photo: Photo, share?: boolean) =>
  share
    ? `${PREFIX_PHOTO}/${photo.idShort}/share`
    : `${PREFIX_PHOTO}/${photo.idShort}`;

export const pathForPhotoEdit = (photo: Photo) =>
  `${PATH_ADMIN_PHOTOS}/${photo.idShort}/edit`;

export const pathForTag = (tag: string) => `${PREFIX_TAG}/${tag}`;

export const absolutePathForPhoto = (photo: Photo) =>
  `${BASE_URL}${pathForPhoto(photo)}`;

export const absolutePathForTag = (tag: string) =>
  `${BASE_URL}${pathForTag(tag)}`;

export const absolutePathForPhotoImage = (photo: Photo) =>
  `${absolutePathForPhoto(photo)}/image`;

export const absolutePathForTagImage = (tag: string) =>
  `${absolutePathForTag(tag)}/image`;

export const isPathPhoto = (pathname = '') =>
  /^\/p\/[^/]+\/?$/.test(pathname);

export const isPathPhotoShare = (pathname = '') =>
  /^\/p\/[^/]+\/share\/?$/.test(pathname);

export const isPathSignIn = (pathname = '') =>
  pathname.startsWith('/sign-in');

export const isPathProtected = (pathname = '') =>
  pathname.startsWith(PREFIX_ADMIN) ||
  pathname === '/checklist';
