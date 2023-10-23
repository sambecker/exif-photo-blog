import { Photo } from '@/photo';
import { parameterize } from '@/utility/string';

const CAMERA_PLACEHOLDER: Camera = { make: 'Camera', model: 'Model' };

export type Camera = {
  make: string
  model: string
};

export type Cameras = {
  cameraKey: string
  camera: Camera
  count: number
}[];

export const createCameraKey = ({ make, model }: Camera) =>
  parameterize(`${make}-${model}`);

// Assumes no makes ('Fujifilm,' 'Apple,' 'Canon', etc.) have dashes
export const getCameraFromKey = (cameraKey: string): Camera => {
  const [make, model] = cameraKey.toLowerCase().split(/[-| ](.*)/s);
  return { make, model };
};

export const cameraFromPhoto = (
  photo: Photo | undefined,
  fallback?: Camera | string,
): Camera =>
  photo?.make && photo?.model
    ? { make: photo.make, model: photo.model }
    : typeof fallback === 'string'
      ? getCameraFromKey(fallback)
      : fallback ?? CAMERA_PLACEHOLDER;

export const formatCameraText = ({ make, model }: Camera) =>
  `${make} ${model}`;
