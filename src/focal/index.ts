import {
  Photo,
  PhotoDateRange,
  descriptionForPhotoSet,
  photoQuantityText,
} from '@/photo';
import {
  absolutePathForFocalLength,
  absolutePathForFocalLengthImage,
} from '@/app/paths';

export type FocalLengths = {
  focal: number
  count: number
}[]

export const getFocalLengthFromString = (focalString?: string) => {
  const focal = focalString?.match(/^([0-9]+)mm/)?.[1];
  return focal ? parseInt(focal, 10) : 0;
};

export const formatFocalLength = (focal?: number) => focal ?
  `${focal}mm`
  : undefined;

export const titleForFocalLength = (
  focal: number,
  photos: Photo[],
  explicitCount?: number,
) => [
  `${formatFocalLength(focal)} Focal Length`,
  photoQuantityText(explicitCount ?? photos.length),
].join(' ');

export const shareTextFocalLength = (focal: number) =>
  `Photos shot at ${formatFocalLength(focal)}`;

export const descriptionForFocalLengthPhotos = (
  photos: Photo[],
  dateBased?: boolean,
  explicitCount?: number,
  explicitDateRange?: PhotoDateRange,
) =>
  descriptionForPhotoSet(
    photos,
    undefined,
    dateBased,
    explicitCount,
    explicitDateRange,
  );

export const generateMetaForFocalLength = (
  focal: number,
  photos: Photo[],
  explicitCount?: number,
  explicitDateRange?: PhotoDateRange,
) => ({
  url: absolutePathForFocalLength(focal),
  title: titleForFocalLength(focal, photos, explicitCount),
  description: descriptionForFocalLengthPhotos(
    photos,
    true,
    explicitCount,
    explicitDateRange,
  ),
  images: absolutePathForFocalLengthImage(focal),
});

export const sortFocalLengths = (focalLengths: FocalLengths) =>
  focalLengths.sort((a, b) => a.focal - b.focal);
