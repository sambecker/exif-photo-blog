import AdminLibraryEditPage from '@/library/AdminLibraryEditPage';
import { getLibraryData } from '@/library/data';
import { PRESERVE_ORIGINAL_UPLOADS } from '@/app/config';
import { feedQueryOptions } from '@/feed';
import {
  getPhotosCached,
  getPhotosMetaCached,
} from '@/photo/cache';
import { TAG_FAVS } from '@/tag';
import { getDataForCategoriesCached } from '@/category/cache';
import { NULL_CATEGORY_DATA } from '@/category/data';

const PHOTO_CHOOSER_QUERY_OPTIONS = feedQueryOptions({
  isGrid: true,
  excludeFromFeeds: false,
});

export default async function LibraryEditPage() {
  const [
    {
      library,
      photoAvatar,
    },
    photos,
    photosCount,
    photosFavs,
    { albums, tags },
  ] = await Promise.all([
    getLibraryData()
      .catch(() => ({
        library: undefined,
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
    getDataForCategoriesCached()
      .catch(() => NULL_CATEGORY_DATA),
  ]);

  return (
    <AdminLibraryEditPage {...{
      library,
      photoAvatar,
      photos,
      photosCount,
      photosFavs,
      albums,
      tags,
      shouldResizeImages: !PRESERVE_ORIGINAL_UPLOADS,
    }} />
  );
}
