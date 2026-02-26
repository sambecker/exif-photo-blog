import AdminAboutEditPage from '@/about/AdminAboutEditPage';
import { getAbout } from '@/about/query';
import { PRESERVE_ORIGINAL_UPLOADS } from '@/app/config';
import { getPhotoNoStore } from '@/photo/cache';

export default async function AboutEditPage() {
  const about = await getAbout().catch(() => undefined);

  const photoAvatar = about?.photoIdAvatar
    ? await getPhotoNoStore(about?.photoIdAvatar ?? '', true)
      .catch(() => undefined)
    : undefined;

  return (
    <AdminAboutEditPage {...{
      about,
      photoAvatar,
      shouldResizeImages: !PRESERVE_ORIGINAL_UPLOADS,
    }} />
  );
}
