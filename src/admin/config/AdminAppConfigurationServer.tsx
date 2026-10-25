import AdminAppConfigurationClient from './AdminAppConfigurationClient';
import { APP_CONFIGURATION } from '@/app/config';
import { testConnectionsAction } from '@/admin/actions';
import { generateAuthSecret } from '@/auth';
import { getPhotosCached } from '@/photo/cache';
import { TAG_FAVS } from '@/tag';

const getSamplePhotoTitlePhoto = async () => {
  try {
    const favs = await getPhotosCached({ tag: TAG_FAVS, limit: 1 });
    if (favs[0]) { return favs[0]; }
    const photos = await getPhotosCached({ limit: 1 });
    return photos[0];
  } catch {
    return undefined;
  }
};

export default async function AdminAppConfigurationServer({
  simplifiedView,
}: {
  simplifiedView?: boolean
}) {
  const [
    connectionErrors,
    secret,
    samplePhotoTitlePhoto,
  ] = await Promise.all([
    testConnectionsAction().catch(() => ({})),
    generateAuthSecret(),
    getSamplePhotoTitlePhoto(),
  ]);

  return (
    <AdminAppConfigurationClient {...{
      ...APP_CONFIGURATION,
      ...connectionErrors,
      secret,
      simplifiedView,
      samplePhotoTitlePhoto,
    }} />
  );
}
