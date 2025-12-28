import { getIBMPlexMono } from '@/app/font';
import { cachedOgResponse } from './cache';
import { getPhoto, getPhotos } from '@/photo/query';
import {
  IMAGE_OG_DIMENSION,
  IMAGE_OG_DIMENSION_SMALL,
  OGImageDimension,
} from '@/image-response/size';
import {
  isNextImageReadyBasedOnPhotos,
} from '@/platforms/safe-photo-image-response';
import { JSX } from 'react';
import { Photo } from '@/photo';
import { ImageResponse } from 'next/og';

export const cachedOgPhotoResponse = async (
  categoryOrKey: Parameters<typeof cachedOgResponse>[0],
  photoQueryOrId: Parameters<typeof getPhotos>[0] | string,
  getImageResponseComponent: (args: {
    photos: Photo[],
    fontFamily: string,
    width: OGImageDimension['width']
    height: OGImageDimension['height']
  }) => JSX.Element,
  size: 'small' | 'medium' = 'small',
) =>
  cachedOgResponse(
    categoryOrKey,
    async () => {
      const [
        photos,
        { fontFamily, fonts },
      ] = await Promise.all([
        typeof photoQueryOrId === 'string'
          ? getPhoto(photoQueryOrId).then(photo => photo ? [photo] : [])
          : getPhotos(photoQueryOrId),
        getIBMPlexMono(),
      ]);
    
      const { width, height } = size === 'small'
        ? IMAGE_OG_DIMENSION_SMALL
        : IMAGE_OG_DIMENSION;

      // Make sure next/image can be reached from absolute urls,
      // which may not exist on first pre-render
      const isNextImageReady = await isNextImageReadyBasedOnPhotos(photos);

      return new ImageResponse(
        getImageResponseComponent({
          photos: isNextImageReady ? photos : [],
          fontFamily,
          width,
          height,
        }),
        { width, height, fonts },
      );
    });
