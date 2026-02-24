import AdminAboutEditPage from '@/about/AdminAboutEditPage';
import { PRESERVE_ORIGINAL_UPLOADS } from '@/app/config';
import { getPhotosCached } from '@/photo/cache';
import { TAG_FAVS } from '@/tag';

export default async function AboutEditPage() {
  const photoAvatar = await getPhotosCached({ tag: TAG_FAVS, limit: 6 })
    .then(photos => photos[5])
    .catch(() => undefined);

  return (
    <AdminAboutEditPage
      photoAvatar={photoAvatar}
      shouldResizeImages={!PRESERVE_ORIGINAL_UPLOADS}
    />
  );
}
