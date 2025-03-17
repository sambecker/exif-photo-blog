import type { Photo } from '@/photo';
import { parameterize } from '@/utility/string';

const CAMERA_PLACEHOLDER: Camera = { make: 'Camera', model: 'Model' };

const CAMERA_MAKE_APPLE = 'apple';

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

// Support keys for make-only and model-only camera queries
export const createCameraKey = ({ make, model }: Partial<Camera>) =>
  parameterize(`${make ?? 'ANY'}-${model ?? 'ANY'}`);

export const getCameraFromParams = ({
  make,
  model,
}: {
  make: string,
  model: string,
}): Camera => ({
  make: parameterize(make),
  model: parameterize(model),
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

const isCameraMakeApple = (make?: string) =>
  make?.toLocaleLowerCase() === CAMERA_MAKE_APPLE;

export const isCameraApple = ({ make }: Camera) =>
  isCameraMakeApple(make);

export const formatCameraText = (
  { make, model: modelRaw }: Camera,
  length:
    'long' |    // Unmodified make and model
    'medium' |  // Make and model, with modifiers removed
    'short'     // Model only
  = 'medium',
) => {
  // Capture simple make without modifiers like 'Corporation' or 'Company'
  const makeSimple = make.match(/^(\S+)/)?.[1];
  const doesModelStartWithMake = (
    makeSimple &&
    modelRaw.toLocaleLowerCase().startsWith(makeSimple.toLocaleLowerCase())
  );
  let model = modelRaw;
  switch (length) {
  case 'long':
    return `${make} ${model}`;
  case 'medium':
    return doesModelStartWithMake || isCameraMakeApple(make)
      ? model
      : `${make} ${model}`;
  case 'short':
    model = doesModelStartWithMake
      ? model.replace(makeSimple, '').trim()
      : model;
    if (
      model.includes('iPhone') &&
      model.length > 9
    ) {
      model = model.replace(/iPhone\s*/i, '');
    }
    return model;
  }
};
