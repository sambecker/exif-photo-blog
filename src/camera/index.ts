import type { Photo } from '@/photo';
import { parameterize } from '@/utility/string';

const CAMERA_PLACEHOLDER: Camera = { make: 'Camera', model: 'Model' };

export type Camera = {
  make: string
  model: string
};

export interface CameraProps {
  params: Promise<Camera>
}

export interface PhotoCameraProps {
  params: Promise<Camera & { photoId: string }>
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
  { make, model: modelRaw }: Camera,
  includeMake: 'always' | 'never' | 'if-not-apple' = 'if-not-apple',
  removeIPhoneOnLongModels?: boolean,
) => {
  // Capture simple make without modifiers like 'Corporation' or 'Company'
  const makeSimple = make.match(/^(\S+)/)?.[1];
  const doesModelStartWithMake = (
    makeSimple &&
    modelRaw.toLocaleLowerCase().startsWith(makeSimple.toLocaleLowerCase())
  );
  let model = modelRaw;
  if (
    removeIPhoneOnLongModels &&
    model.includes('iPhone') &&
    model.length > 9
  ) {
    model = model.replace(/iPhone\s*/i, '');
  }
  return (
    includeMake === 'never' ||
    doesModelStartWithMake ||
    (includeMake === 'if-not-apple' && make === 'Apple')
  ) ? model
    : `${make} ${model}`;
};

export const formatCameraModelTextShort = (camera: Camera) =>
  formatCameraText(camera, 'never', true);
