import { absolutePathForTag } from '@/app/paths';
import { PhotoSetAttributes } from '../category';
import ShareModal from '@/share/ShareModal';
import TagOGTile from './TagOGTile';
import { formatTag, shareTextForTag } from '.';

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
      navigatorTitle={formatTag(tag)}
      socialText={shareTextForTag(tag)}
    >
      <TagOGTile {...{ tag, photos, count, dateRange }} />
    </ShareModal>
  );
};
