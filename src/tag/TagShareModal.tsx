import { absolutePathForTag, pathForTag } from '@/site/paths';
import { Photo } from '../photo';
import ShareModal from '@/components/ShareModal';
import TagOGTile from './TagOGTile';

export default function TagShareModal({
  tag,
  photos,
}: {
  tag: string
  photos: Photo[]
}) {
  return (
    <ShareModal
      title="Share Photos"
      pathShare={absolutePathForTag(tag)}
      pathClose={pathForTag(tag)}
    >
      <TagOGTile tag={tag} photos={photos} />
    </ShareModal>
  );
};
