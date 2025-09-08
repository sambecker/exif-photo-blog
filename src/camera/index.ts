import { CategoryQueryMeta } from '@/category';
import type { Photo } from '@/photo';
import { isCameraMakeApple } from '@/platforms/apple';
import { formatSonyModel, isMakeSony } from '@/platforms/sony';
import { MakeModelTextLength, parameterize } from '@/utility/string';

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

export type CameraWithMeta = {
  cameraKey: string
  camera: Camera
} & CategoryQueryMeta;

export type Cameras = CameraWithMeta[];

// Support keys for make-only and model-only camera queries
export const createCameraKey = ({ make, model }: Partial<Camera>) =>
  parameterize(`${make ?? 'ANY'}-${model ?? 'ANY'}`);

export const formatCameraParams = ({
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
  a: CameraWithMeta,
  b: CameraWithMeta,
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
  { make, model: _model }: Camera,
  length: MakeModelTextLength = 'medium',
) => {
  // Capture simple make without modifiers like 'Corporation' or 'Company'
  const makeSimple = make.match(/^(\S+)/)?.[1];
  let model = isMakeSony(make) ? formatSonyModel(_model) : _model;
  const doesModelStartWithMake = (
    makeSimple &&
    model.toLocaleLowerCase().startsWith(makeSimple.toLocaleLowerCase())
  );
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
