import { absolutePathForTag, pathForTag } from '@/site/paths';
import { Photo, PhotoDateRange } from '../photo';
import ShareModal from '@/components/ShareModal';
import TagOGTile from './TagOGTile';

export default function TagShareModal({
  tag,
  photos,
  count,
  dateRange,
}: {
  tag: string
  photos: Photo[]
  count?: number
  dateRange?: PhotoDateRange
}) {
  return (
    <ShareModal
      title="Share Photos"
      pathShare={absolutePathForTag(tag)}
      pathClose={pathForTag(tag)}
    >
      <TagOGTile {...{ tag, photos, count, dateRange }} />
    </ShareModal>
  );
};
