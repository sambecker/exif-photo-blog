import { Photo } from '@/photo';
import { absolutePathForPhoto } from './paths';
import { formatDateFromPostgresString } from '@/utility/date';
import { getNextImageUrlForRequest } from '@/services/next-image';

export const API_PHOTO_REQUEST_LIMIT = 40;

export interface PublicApi {
  meta: {
    title: string
    url: string
  }
  photos: PublicApiPhoto[]
}

interface PublicApiPhoto {
  id: string
  title?: string
  url: string
  make?: string
  model?: string
  tags?: string[]
  takenAtNaive: string
  src: Record<
    'small' | 'medium' | 'large',
    string
  >
}

export const formatPhotoForApi = (photo: Photo): PublicApiPhoto => ({
  id: photo.id,
  title: photo.title,
  url: absolutePathForPhoto(photo),
  ...photo.make && { make: photo.make },
  ...photo.model && { model: photo.model },
  ...photo.tags.length > 0 && { tags: photo.tags },
  takenAtNaive: formatDateFromPostgresString(photo.takenAtNaive),
  src: {
    small: getNextImageUrlForRequest(photo.url, 200),
    medium: getNextImageUrlForRequest(photo.url, 640),
    large: getNextImageUrlForRequest(photo.url, 1200),
  },
});
