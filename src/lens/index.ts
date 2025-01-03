import { Photo } from '@/photo';
import { parameterize } from '@/utility/string';

const LENS_PLACEHOLDER: Lens = { make: 'Lens', model: 'Model' };

export type Lens = {
  make: string
  model: string
};

export interface LensProps {
  params: Promise<Lens>
}

export interface PhotoLensProps {
  params: Promise<Lens & { photoId: string }>
}

export type LensWithCount = {
  lensKey: string
  lens: Lens
  count: number
}

export type Lenses = LensWithCount[];

export const createLensKey = ({ make, model }: Lens) =>
  parameterize(`${make}-${model}`, true);

export const getLensFromParams = ({
  make,
  model,
}: {
  make: string,
  model: string,
}): Lens => ({
  make: parameterize(make, true),
  model: parameterize(model, true),
});

export const lensFromPhoto = (
  photo: Photo | undefined,
  fallback?: Lens,
): Lens =>
  photo?.lensMake && photo?.lensModel
    ? { make: photo.lensMake, model: photo.lensModel }
    : fallback ?? LENS_PLACEHOLDER;
