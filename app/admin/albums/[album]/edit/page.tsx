import AdminChildPage from '@/components/AdminChildPage';
import { redirect } from 'next/navigation';
import { getPhotosCached, getPhotosMetaCached } from '@/photo/cache';
import { PATH_ADMIN, PATH_ADMIN_ALBUMS, pathForAlbum } from '@/app/path';
import PhotoLightbox from '@/photo/PhotoLightbox';
import { getAlbumFromSlug } from '@/album/query';
import AdminAlbumBadge from '@/admin/AdminAlbumBadge';
import AdminAlbumForm from '@/admin/AdminAlbumForm';
import { HAS_LOCATION_SERVICES } from '@/app/config';

const MAX_PHOTO_TO_SHOW = 6;

interface Props {
  params: Promise<{ album: string }>
}

export default async function AlbumPageEdit({
  params,
}: Props) {
  const { album: albumFromParams } = await params;

  const albumSlug = decodeURIComponent(albumFromParams);

  const album = await getAlbumFromSlug(albumSlug);

  if (!album) { redirect(PATH_ADMIN); }
  
  const [
    { count },
    photos,
  ] = await Promise.all([
    getPhotosMetaCached({ album }),
    getPhotosCached({ album, limit: MAX_PHOTO_TO_SHOW }),
  ]);

  if (count === 0) { redirect(PATH_ADMIN); }

  return (
    <AdminChildPage
      backPath={PATH_ADMIN_ALBUMS}
      backLabel="Albums"
      breadcrumb={<AdminAlbumBadge {...{ album, count, hideBadge: true }} />}
    >
      <AdminAlbumForm {...{
        album,
        hasLocationServices: HAS_LOCATION_SERVICES,
      }}>
        {photos.length > 0 &&
          <PhotoLightbox
            {...{ count, photos, album }}
            maxPhotosToShow={MAX_PHOTO_TO_SHOW}
            moreLink={pathForAlbum(album)}
          />}
      </AdminAlbumForm>
    </AdminChildPage>
  );
};
