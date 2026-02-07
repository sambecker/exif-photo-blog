import AdminBadge from './AdminBadge';
import { Album } from '@/album';
import PhotoAlbum from '@/album/PhotoAlbum';

export default async function AdminAlbumBadge({
  album,
  count,
  hideBadge,
}: {
  album: Album,
  count: number,
  hideBadge?: boolean,
}) {
  return (
    <AdminBadge
      entity={<PhotoAlbum {...{ album }} hoverType="image" />}
      count={count}
      hideBadge={hideBadge}
    />
  );
}