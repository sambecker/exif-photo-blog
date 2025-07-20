import { descriptionForPhoto, Photo, titleForPhoto } from '@/photo';
import {
  getNextImageUrlForRequest,
  NextImageSize,
} from '@/platforms/next-image';

export const FEED_PHOTO_REQUEST_LIMIT = 40;

export const FEED_PHOTO_WIDTH_SMALL = 200;
export const FEED_PHOTO_WIDTH_MEDIUM = 640;
export const FEED_PHOTO_WIDTH_LARGE = 1200;

export interface FeedMedia {
  url: string
  width: number
  height: number
}

export const generateFeedMedia = (
  photo: Photo,
  size: NextImageSize,
): FeedMedia => ({
  url: getNextImageUrlForRequest({ imageUrl: photo.url, size }),
  width: size,
  height: Math.round(size / photo.aspectRatio),
});

export const getCoreFeedFields = (photo: Photo) => ({
  id: photo.id,
  title: titleForPhoto(photo),
  description: descriptionForPhoto(photo, true),
});
