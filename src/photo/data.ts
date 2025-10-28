import { parsePhotoDates, parsePhotosDates } from '.';
import { getPhotosNearIdQuery } from './query';

export const getPhotosNearId = (
  ...args: Parameters<typeof getPhotosNearIdQuery>
) => getPhotosNearIdQuery(...args).then(({ photos, indexNumber }) => {
  const [photoId, { limit }] = args;
  const photo = photos.find(({ id }) => id === photoId);
  const isPhotoFirst = photos.findIndex(p => p.id === photoId) === 0;
  return {
    photo: photo ? parsePhotoDates(photo) : undefined,
    photos: parsePhotosDates(photos),
    ...limit && {
      photosGrid: photos.slice(
        isPhotoFirst ? 1 : 2,
        isPhotoFirst ? limit - 1 : limit,
      ),
    },
    indexNumber,
  };
});
