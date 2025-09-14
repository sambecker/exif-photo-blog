import { absolutePathForYear } from '@/app/path';
import { PhotoSetAttributes } from '../category';
import ShareModal from '@/share/ShareModal';
import YearOGTile from './YearOGTile';
import { useAppText } from '@/i18n/state/client';

export default function YearShareModal({
  year,
  photos,
  count,
  dateRange,
}: {
  year: string
} & PhotoSetAttributes) {
  const appText = useAppText();
  return (
    <ShareModal
      pathShare={absolutePathForYear(year, true)}
      navigatorTitle={appText.category.yearTitle(year)}
      socialText={appText.category.yearShare(year)}
    >
      <YearOGTile {...{ year, photos, count, dateRange }} />
    </ShareModal>
  );
} 