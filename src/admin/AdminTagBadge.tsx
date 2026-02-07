import PhotoTag from '@/tag/PhotoTag';
import PhotoFavs from '@/tag/PhotoFavs';
import { isTagFavs } from '@/tag';
import AdminBadge from './AdminBadge';

export default async function AdminTagBadge({
  tag,
  count,
  hideBadge,
}: {
  tag: string,
  count: number,
  hideBadge?: boolean,
}) {
  return (
    <AdminBadge
      className={isTagFavs(tag) ? 'translate-y-[-0.5px]' : undefined}
      entity={isTagFavs(tag)
        ? <PhotoFavs hoverType="image" />
        : <PhotoTag {...{ tag }} hoverType="image" />}
      count={count}
      hideBadge={hideBadge}
    />
  );
}