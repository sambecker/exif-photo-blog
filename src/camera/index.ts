import type { Photo } from '@/photo';
import { parameterize } from '@/utility/string';

const CAMERA_PLACEHOLDER: Camera = { make: 'Camera', model: 'Model' };

export type Camera = {
  make: string
  model: string
};

export type CameraWithCount = {
  cameraKey: string
  camera: Camera
  count: number
}

export type Cameras = CameraWithCount[];

export const createCameraKey = ({ make, model }: Camera) =>
  parameterize(`${make}-${model}`, true);

// Assumes no makes ('Fujifilm,' 'Apple,' 'Canon', etc.) have dashes
export const getCameraFromKey = (cameraKey: string): Camera => {
  const [make, model] = cameraKey.toLowerCase().split(/[-| ](.*)/s);
  return { make, model };
};

export const sortCamerasWithCount = (
  a: CameraWithCount,
  b: CameraWithCount,
) => {
  const aText = formatCameraText(a.camera);
  const bText = formatCameraText(b.camera);
  return aText.localeCompare(bText);
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

export const formatCameraText = (
  { make, model: modelRaw }: Camera,
  includeMakeApple?: boolean,
) => {
  // Remove potential duplicate make from model
  const model = modelRaw.replace(`${make} `, '');
  return make === 'Apple' && !includeMakeApple
    ? model
    : `${make} ${model}`;
};

export const formatCameraModelText = (
  { make, model: modelRaw }: Camera,
) => {
  // Remove potential duplicate make from model
  const model = modelRaw.replace(`${make} `, '');
  const textLength = model?.length ?? 0;
  if (textLength > 0 && textLength <= 8) {
    return model;
  } else if (model?.includes('iPhone')) {
    return model.split('iPhone')[1];
  } else {
    return undefined;
  }
};
