import { absolutePathForRecents } from '@/app/paths';
import { PhotoSetAttributes } from '../category';
import ShareModal from '@/share/ShareModal';
import RecentsOGTile from './RecentsOGTile';
import { useAppText } from '@/i18n/state/client';

export default function RecentsShareModal({
  photos,
  count,
  dateRange,
}: PhotoSetAttributes) {
  const appText = useAppText();
  return (
    <ShareModal
      pathShare={absolutePathForRecents(true)}
      navigatorTitle={appText.category.recentTitle}
      socialText={appText.category.recentTitle}
    >
      <RecentsOGTile {...{ photos, count, dateRange }} />
    </ShareModal>
  );
} 