import { Photo } from '@/photo';
import { BASE_URL } from './config';

export const ROUTE_ADMIN_UPLOAD = '/admin/uploads';

export const ROUTE_ADMIN_UPLOAD_BLOB_HANDLER = '/admin/uploads/blob';

export const ABSOLUTE_ROUTE_FOR_HOME_IMAGE = `${BASE_URL}/home-image`;

export const routeForPhoto = (photo: Photo, share?: boolean) =>
  share
    ? `/p/${photo.idShort}/share`
    : `/p/${photo.idShort}`;

export const absoluteRouteForPhoto = (photo: Photo) =>
  `${BASE_URL}${routeForPhoto(photo)}`;

export const absoluteRouteForPhotoImage = (photo: Photo) =>
  `${absoluteRouteForPhoto(photo)}/image`;

export const isRoutePhoto = (pathname = '') =>
  /^\/p\/[^/]+\/?$/.test(pathname);

export const isRoutePhotoShare = (pathname = '') =>
  /^\/p\/[^/]+\/share\/?$/.test(pathname);

export const isRouteSignIn = (pathname = '') =>
  pathname.startsWith('/sign-in');

export const isRouteProtected = (pathname = '') =>
  pathname.startsWith('/admin') ||
  pathname === '/checklist';
