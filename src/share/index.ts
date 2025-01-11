import { Photo, PhotoSetAttributes, PhotoSetCategory } from '@/photo';
import { absolutePathForPhotoImage } from '@/site/paths';
import { absolutePathForTagImage } from '@/site/paths';
import {
  absolutePathForCamera,
  absolutePathForFilmSimulation,
} from '@/site/paths';
import { absolutePathForFocalLength } from '@/site/paths';

export type ShareModalProps = Omit<PhotoSetAttributes, 'photos'> & {
  photo?: Photo
  photos?: Photo[]
} & PhotoSetCategory;

export const getSharePathFromShareModalProps = ({
  photo,
  tag,
  camera,
  simulation,
  focal,
}: ShareModalProps) => {
  if (photo) {
    return absolutePathForPhotoImage(photo);
  }
  if (tag) {
    return absolutePathForTagImage(tag);
  }
  if (camera) {
    return absolutePathForCamera(camera);
  }
  if (simulation) {
    return absolutePathForFilmSimulation(simulation);
  }
  if (focal) {
    return absolutePathForFocalLength(focal);
  }
};
