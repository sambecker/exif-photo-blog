import AdminAboutEditPage from '@/about/AdminAboutEditPage';
import { getAbout } from '@/about/query';
import { PRESERVE_ORIGINAL_UPLOADS } from '@/app/config';
import { feedQueryOptions } from '@/feed';
import {
  getPhotosCached,
  getPhotosMetaCached,
} from '@/photo/cache';
import { getPhoto } from '@/photo/query';
import { TAG_FAVS } from '@/tag';

const PHOTO_CHOOSER_QUERY_OPTIONS = feedQueryOptions({
  isGrid: true,
  excludeFromFeeds: false,
});

export default async function AboutEditPage() {
  const [
    {
      about,
      photoAvatar,
      photoHero,
    },
    photos,
    photosCount,
    photosFavs,
  ] = await Promise.all([
    getAbout()
      .then(async about => {
        const photoAvatar = about?.photoIdAvatar
          ? await getPhoto(about?.photoIdAvatar ?? '', true)
            .catch(() => undefined)
          : undefined;

        const photoHero = about?.photoIdHero
          ? await getPhoto(about?.photoIdHero ?? '', true)
            .catch(() => undefined)
          : undefined;

        return {
          about,
          photoAvatar,
          photoHero,
        };
      })
      .catch(() => ({
        about: undefined,
        photoAvatar: undefined,
        photoHero: undefined,
      })),
    getPhotosCached(PHOTO_CHOOSER_QUERY_OPTIONS)
      .catch(() => []),
    getPhotosMetaCached(PHOTO_CHOOSER_QUERY_OPTIONS)
      .then(({ count }) => count)
      .catch(() => 0),
    getPhotosCached({ tag: TAG_FAVS })
      .catch(() => []),
  ]);

  return (
    <AdminAboutEditPage {...{
      about,
      photoAvatar,
      photoHero,
      photos,
      photosCount,
      photosFavs,
      shouldResizeImages: !PRESERVE_ORIGINAL_UPLOADS,
    }} />
  );
}
