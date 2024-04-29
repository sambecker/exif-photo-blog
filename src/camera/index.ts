import type { Photo } from '@/photo';
import { parameterize } from '@/utility/string';

const CAMERA_PLACEHOLDER: Camera = { make: 'Camera', model: 'Model' };

export type Camera = {
  make: string
  model: string
};

export interface CameraProps {
  params: Camera
}

export interface PhotoCameraProps {
  params: Camera & { photoId: string }
}

export type CameraWithCount = {
  cameraKey: string
  camera: Camera
  count: number
}

export type Cameras = CameraWithCount[];

export const createCameraKey = ({ make, model }: Camera) =>
  parameterize(`${make}-${model}`, true);

export const getCameraFromParams = ({
  make,
  model,
}: {
  make: string,
  model: string,
}): Camera => ({
  make: parameterize(make, true),
  model: parameterize(model, true),
});

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
  fallback?: Camera,
): Camera =>
  photo?.make && photo?.model
    ? { make: photo.make, model: photo.model }
    : fallback ?? CAMERA_PLACEHOLDER;

export const formatCameraText = (
  { make: makeRaw, model: modelRaw }: Camera,
  includeMake: 'always' | 'never' | 'if-not-apple' = 'if-not-apple',
  removeIPhoneOnLongModels?: boolean
) => {
  // Remove 'Corporation' from makes like 'Nikon Corporation'
  const make = makeRaw.replace(/ Corporation/i, '');
  // Remove potential duplicate make from model
  let model = modelRaw.replace(`${make} `, '');
  if (
    removeIPhoneOnLongModels &&
    model.includes('iPhone') &&
    model.length > 9
  ) {
    model = model.replace(/iPhone\s*/i, '');
  }
  return (
    includeMake === 'never' || 
    includeMake === 'if-not-apple' && make === 'Apple'
  ) ? model
    : `${make} ${model}`;
};

export const formatCameraModelTextShort = (camera: Camera) =>
  formatCameraText(camera, 'never', true);
