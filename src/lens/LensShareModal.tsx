import { absolutePathForLens } from '@/app/paths';
import { PhotoSetAttributes } from '../category';
import ShareModal from '@/share/ShareModal';
import { formatLensText, Lens } from '.';
import { shareTextForLens } from './meta';
import LensOGTile from './LensOGTile';
import { getAppText } from '@/i18n/state/server';

export default async function LensShareModal({
  lens,
  photos,
  count,
  dateRange,
}: {
  lens: Lens
} & PhotoSetAttributes) {
  const appText = await getAppText();
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
