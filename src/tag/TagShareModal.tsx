import { absolutePathForTag, pathForTag } from '@/site/paths';
import { PhotoSetAttributes } from '../photo';
import ShareModal from '@/components/ShareModal';
import TagOGTile from './TagOGTile';
import { shareTextForTag } from '.';

export default function TagShareModal({
  tag,
  photos,
  count,
  dateRange,
}: {
  tag: string
} & PhotoSetAttributes) {
  return (
    <ShareModal
      pathShare={absolutePathForTag(tag)}
      pathClose={pathForTag(tag)}
      socialText={shareTextForTag(tag)}
    >
      <TagOGTile {...{ tag, photos, count, dateRange }} />
    </ShareModal>
  );
};
