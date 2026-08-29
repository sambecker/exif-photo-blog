import { absolutePathForQuery } from '@/app/path';
import { PhotoSetAttributes } from '../category';
import ShareModal from '@/share/ShareModal';
import QueryOGTile from './QueryOGTile';
import { useAppText } from '@/i18n/state/client';

export default function QueryShareModal({
  query,
  photos,
  count,
  dateRange,
}: {
  query: string
} & PhotoSetAttributes) {
  const appText = useAppText();
  return (
    <ShareModal
      pathShare={absolutePathForQuery(query, true)}
      navigatorTitle={appText.category.queryTitle(query)}
      socialText={appText.category.queryTitle(query)}
    >
      <QueryOGTile {...{ query, photos, count, dateRange }} />
    </ShareModal>
  );
}
