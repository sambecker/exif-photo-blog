import { Photo } from '@/photo';
import { SITE_DOMAIN } from './config';

export const ROUTE_ADMIN_UPLOAD = '/admin/uploads';

export const ROUTE_ADMIN_UPLOAD_BLOB_HANDLER = '/admin/uploads/blob';

export const routeForPhoto = (photo: Photo, share?: boolean) =>
  share
    ? `/photos/${photo.idShort}/share`
    : `/photos/${photo.idShort}`;

export const absoluteRouteForPhoto = (photo: Photo) =>
  `https://${SITE_DOMAIN}${routeForPhoto(photo)}`;

export const isRoutePhoto = (pathname = '') =>
  /^\/photos\/[^/]+\/?$/.test(pathname);

export const isRoutePhotoShare = (pathname = '') =>
  /^\/photos\/[^/]+\/share\/?$/.test(pathname);

export const isRouteSignIn = (pathname = '') =>
  pathname.startsWith('/sign-in');

export const isRouteProtected = (pathname = '') =>
  pathname.startsWith('/admin') ||
  pathname === '/checklist';
