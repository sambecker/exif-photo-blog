import { absolutePathForTag, pathForTag } from '@/site/paths';
import { Photo } from '../photo';
import ShareModal from '@/components/ShareModal';
import TagOGTile from './TagOGTile';

export default function TagShareModal({
  tag,
  photos,
  count,
}: {
  tag: string
  photos: Photo[]
  count?: number
}) {
  return (
    <ShareModal
      title="Share Photos"
      pathShare={absolutePathForTag(tag)}
      pathClose={pathForTag(tag)}
    >
      <TagOGTile {...{ tag, photos, count }} />
    </ShareModal>
  );
};
