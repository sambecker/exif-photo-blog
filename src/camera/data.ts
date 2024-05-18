import { Camera } from '.';
import {
  getPhotosCached,
  getPhotosCameraMetaCached,
} from '@/photo/cache';

export const getPhotosCameraDataCached = ({
  camera,
  limit,
}: {
  camera: Camera,
  limit?: number,
}) =>
  Promise.all([
    getPhotosCached({ camera, limit }),
    getPhotosCameraMetaCached(camera),
  ]);
