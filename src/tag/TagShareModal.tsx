import { absolutePathForTag } from '@/app/paths';
import { PhotoSetAttributes } from '../category';
import ShareModal from '@/share/ShareModal';
import TagOGTile from './TagOGTile';
import { formatTag, shareTextForTag } from '.';
import { getAppText } from '@/i18n/state/server';

export default async function TagShareModal({
  tag,
  photos,
  count,
  dateRange,
}: {
  tag: string
} & PhotoSetAttributes) {
  const appText = await getAppText();
  return (
    <ShareModal
      pathShare={absolutePathForTag(tag, true)}
      navigatorTitle={formatTag(tag)}
      socialText={shareTextForTag(tag, appText)}
    >
      <TagOGTile {...{ tag, photos, count, dateRange }} />
    </ShareModal>
  );
};
