import PhotoTag from '@/tag/PhotoTag';
import { photoLabelForCount } from '@/photo';
import { clsx } from 'clsx/lite';
import FavsTag from '@/tag/FavsTag';
import { isTagFavs } from '@/tag';
import Badge from '@/components/Badge';

export default function AdminTagBadge({
  tag,
  count,
  hideBadge,
}: {
  tag: string,
  count: number,
  hideBadge?: boolean,
}) {
  const renderBadgeContent = () =>
    <div className={clsx(
      'inline-flex items-center gap-2',
      // Fix nested EntityLink-in-Badge quirk for tags
      '[&>*>*:first-child]:items-center',
    )}>
      {isTagFavs(tag)
        ? <FavsTag />
        : <PhotoTag {...{ tag }} />}
      <div className="text-dim uppercase">
        <span>{count}</span>
        <span className="hidden xs:inline-block">
          &nbsp;
          {photoLabelForCount(count)}
        </span>
      </div>
    </div>;

  return (
    hideBadge
      ? renderBadgeContent()
      : <Badge>{renderBadgeContent()}</Badge>
  );
}