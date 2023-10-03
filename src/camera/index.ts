import { Photo } from '@/photo';
import { parameterize } from '@/utility/string';

const CAMERA_PLACEHOLDER: Camera = { make: 'Camera', model: 'Model' };

export type Camera = {
  make: string
  model: string
};

export const createCameraKey = (make: string, model: string) =>
  parameterize(`${make}-${model}`);

// Assumes no makes ('Fujifilm,' 'Apple,' 'Canon', etc.) have dashes
export const getMakeModelFromCameraString = (camera: string): Camera => {
  const [make, model] = camera.toLowerCase().split(/[-| ](.*)/s);
  return { make, model };
};

export const cameraFromPhoto = (
  photo: Photo | undefined,
  fallback?: Camera | string,
): Camera =>
  photo?.make && photo?.model
    ? { make: photo.make, model: photo.model }
    : typeof fallback === 'string'
      ? getMakeModelFromCameraString(fallback)
      : fallback ?? CAMERA_PLACEHOLDER;

export const formatCameraText = ({ make, model }: Camera) =>
  `${make} ${model}`;
