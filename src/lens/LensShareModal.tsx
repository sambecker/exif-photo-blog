import { absolutePathForLens } from '@/app/paths';
import { PhotoSetAttributes } from '../category';
import ShareModal from '@/share/ShareModal';
import { formatLensText, Lens } from '.';
import { shareTextForLens } from './meta';
import LensOGTile from './LensOGTile';
import { useAppText } from '@/i18n/state/client';

export default function LensShareModal({
  lens,
  photos,
  count,
  dateRange,
}: {
  lens: Lens
} & PhotoSetAttributes) {
  const appText = useAppText();
  return (
    <ShareModal
      pathShare={absolutePathForLens(lens, true)}
      navigatorTitle={formatLensText(lens)}
      socialText={shareTextForLens(lens, photos, appText)}
    >
      <LensOGTile {...{ lens, photos, count, dateRange }} />
    </ShareModal>
  );
};
